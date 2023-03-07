// NPM imports
import React from "react";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";

import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  View,
  AppState,
  TouchableOpacity
} from "react-native";

// VouD imports
import Header, { headerActionTypes } from "../../components/Header";
import ScreenWithCardHeader from "../../components/ScreenWithCardHeader";
import TransportCard from "../../components/TransportCard";
import BrandText from "../../components/BrandText";
import Button from "../../components/Button";

import NextRechargesBox from "./NextRechargesBox";

import {
  fetchCardListRealBalance,
  fetchCardStatement,
  fetchNextRecharges,
  transportCardTypes,
  fetchClearCardStatement
} from "../../redux/transport-card";
import { viewHelpDetails } from "../../redux/help";
import { routeNames } from "../../shared/route-names";
import { colors } from "../../styles";
import {
  getCurrentTransportCard,
  getCurrentTransportCardDetails,
  getStatementUI,
  filterCurrentCardStatementBySupportedCharacteristics,
  getCardHelpId,
  getHasConfigError,
  getBOMCreditValueRange,
  getIssuerConfig,
  getConfigContentUI,
  rechargePendingValue
} from "../../redux/selectors";

// Group imports
import CardStatement from "./CardStatement";
import { navigateToRoute } from "../../redux/nav";
import { getPaddingForNotch } from "../../utils/is-iphone-with-notch";
import { goToPurchaseCredit } from "../../utils/purchase-credit";
import { formatCurrency } from "../../utils/parsers-formaters";

// Screen component
const emptyImage = require("../../images/empty.png");
const validator = require("../../images/img-validador.png");

class CardDetailsView extends ScreenWithCardHeader {
  constructor(props) {
    super(props);
    this.state = {
      showMoviment: false,
      appState: AppState.currentState,
      isLoadingExtract: false,
      valueTotal: 0
    };
  }

  componentDidMount() {
    this.props.dispatch(fetchClearCardStatement());
    this._loadCardList();
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    const { appState } = this.state;
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      this._loadCardList();
    }
    this.setState({ appState: nextAppState });
  };

  _loadCardList = () => {
    const { cardData } = this.props;
    this.props.dispatch(fetchCardListRealBalance(cardData.uuid));

    if (cardData && cardData.layoutType !== transportCardTypes.BU) {
      this._loadNextRecharges();
    }
  };

  _loadNextRecharges = () => {
    const { dispatch, cardData } = this.props;
    dispatch(fetchNextRecharges(cardData.uuid));
  };

  _openNextRechargesView = () => {
    const { dispatch } = this.props;
    dispatch(navigateToRoute(routeNames.NEXT_RECHARGES));
  };

  _openSchoolCardDetailsView = () => {
    const { dispatch } = this.props;
    dispatch(navigateToRoute(routeNames.SCHOOL_CARD_DETAILS));
  };

  _viewHelp = () => {
    const { dispatch, cardHelpId } = this.props;
    dispatch(viewHelpDetails(cardHelpId));
    dispatch(navigateToRoute(routeNames.HELP_DETAILS));
  };

  _buyCredits = () => {
    const {
      dispatch,
      hasConfigError,
      cardData,
      bomCreditValueRange: { minRechargeValue },
      issuerConfig,
      configUi
    } = this.props;

    goToPurchaseCredit(
      dispatch,
      cardData,
      minRechargeValue,
      issuerConfig,
      hasConfigError,
      configUi
    );
  };

  onReload = () => {
    const { isLoadingExtract } = this.state;
    const { dispatch, cardDataDetails } = this.props;

    this.setState({ showMoviment: true, isLoadingExtract: !isLoadingExtract });
    if (cardDataDetails) dispatch(fetchCardStatement(cardDataDetails.uuid));
  };

  _renderPurchaseHistory = () => {
    const { isLoadingExtract } = this.state;
    const {
      dispatch,
      cardDataDetails,
      cardStatement,
      statementUi,
      cardData,
      valueRechargePending
    } = this.props;
    if (!cardData) return null;

    const isBu = this._isBu(cardDataDetails);
    const hasNextRecharges = this._hasNextRecharges(cardData);
    if (isBu) {
      return (
        <View style={styles.buStatementMessage}>
          <Image source={emptyImage} style={styles.emptyIcon} />
          <BrandText style={styles.buStatementText}>
            Informações de saldo e últimas movimentações não disponíveis para
            este cartão.
          </BrandText>
        </View>
      );
    }
    if (!hasNextRecharges && cardData) {
      return (
        <CardStatement
          cardData={cardDataDetails}
          itemList={cardStatement}
          statementUI={statementUi}
          onReload={this.onReload}
          onPress={() => {}}
          showEntryType={cardDataDetails && this._isVT(cardDataDetails)}
          showMoviment={this.state.showMoviment}
          isLoadingExtract={isLoadingExtract}
        />
      );
    }
    return (
      <View style={styles.rechargeContainer}>
        <SystemText
          style={[styles.title, { fontWeight: "bold" }]}
        >{`R$ ${formatCurrency(valueRechargePending)}`}</SystemText>
        <BrandText style={styles.title}>aguardando validação</BrandText>
        <BrandText style={styles.firstRow}>
          Para validar seus créditos aproxime o seu
        </BrandText>
        <BrandText style={styles.row}>
          cartão em um terminal de validação
        </BrandText>
        <BrandText style={styles.description}>
          {" "}
          disponível em pontos de ônibus, estações
        </BrandText>
        <BrandText style={styles.description}>
          {" "}
          de trem, metrô ou estabelecimentos
        </BrandText>
        <BrandText style={styles.description}>habilitados.</BrandText>
      </View>
    );
  };

  _hasNextRecharges = cardData =>
    cardData &&
    cardData.layoutType !== transportCardTypes.BOM_ESCOLAR_GRATUIDADE &&
    cardData.nextRecharges &&
    cardData.nextRecharges.list &&
    cardData.nextRecharges.list.length > 0;

  _isSchool = cardData =>
    cardData.layoutType === transportCardTypes.BOM_ESCOLAR ||
    cardData.layoutType === transportCardTypes.BOM_ESCOLAR_GRATUIDADE;

  _isRecharchable = cardData =>
    cardData.layoutType !== transportCardTypes.BOM_ESCOLAR_GRATUIDADE;

  _isVT = cardData =>
    cardData.layoutType === transportCardTypes.BOM_VT ||
    cardData.layoutType === transportCardTypes.BOM_VT_EXPRESS;

  _isBu = cardData => cardData && cardData.layoutType === transportCardTypes.BU;

  _isLegal = cardData =>
    cardData && cardData.layoutType === transportCardTypes.LEGAL;

  _renderButtons = () => {
    const { cardData } = this.props;

    if (!cardData) return null;

    const hasNextRecharges = this._hasNextRecharges(cardData);
    const isSchool = this._isSchool(cardData);
    const isRecharchable = this._isRecharchable(cardData);

    const hasInfoButton = hasNextRecharges || isSchool;
    const hasAnyButton = hasInfoButton || isRecharchable;

    if (hasAnyButton)
      return (
        <View style={styles.buttonsContainer}>
          {hasInfoButton && (
            <View style={styles.infoButtonContainer}>
              {isSchool && (
                <Button
                  style={StyleSheet.flatten([
                    styles.infoButton,
                    hasNextRecharges ? { marginLeft: 8 } : {}
                  ])}
                  sm
                  gray
                  icon="school"
                  onPress={this._openSchoolCardDetailsView}
                >
                  Detalhes escolar
                </Button>
              )}
            </View>
          )}
          {isRecharchable && (
            <Button style={{ marginTop: 8 }} sm onPress={this._buyCredits}>
              Comprar créditos
            </Button>
          )}
        </View>
      );

    return null;
  };

  render() {
    const {
      dispatch,
      cardData,
      cardDataDetails,
      rechargePendingValue,
      nextRecharges
    } = this.props;
    const isBu = this._isBu(cardData);
    const isLegal = this._isLegal(cardData);
    // const isLegal = true;

    const hasNextRecharges = this._hasNextRecharges(cardData);

    return (
      <View style={styles.mainContainer}>
        <Header
          title="Detalhes do cartão"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: () => dispatch(NavigationActions.back())
          }}
          right={{
            type: headerActionTypes.EDIT,
            onPress: () => dispatch(navigateToRoute(routeNames.EDIT_CARD))
          }}
          renderExtension={this._renderExtension}
        />
        <TransportCard
          data={cardDataDetails}
          collapse={this._collapse}
          style={StyleSheet.flatten([
            styles.card,
            { marginTop: this._cardMargin }
          ])}
          onHelp={this._viewHelp}
          onRefreshing={this._loadCardList}
        />
        <ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this._scrollY } } }
          ])}
          style={styles.scrollView}
          contentContainerStyle={styles.list}
        >
          {cardDataDetails && this._renderButtons()}
          {isBu || isLegal ? (
            <View style={styles.buStatementMessage}>
              <Image source={emptyImage} style={styles.emptyIcon} />
              <BrandText style={styles.buStatementText}>
                Informações de saldo e últimas movimentações não disponíveis
                para este cartão.
              </BrandText>
            </View>
          ) : (
            <CardStatement
              cardData={this.props.cardDataDetails}
              itemList={this.props.cardStatement}
              statementUI={this.props.statementUi}
              onReload={() => {
                if (!this.state.isLoadingExtract) {
                  dispatch(fetchCardStatement(cardDataDetails.uuid));
                } else {
                  dispatch(fetchClearCardStatement());
                }

                this.setState({
                  showMoviment: true,
                  isLoadingExtract: !this.state.isLoadingExtract
                });
              }}
              onPress={() => {}}
              showEntryType={cardDataDetails && this._isVT(cardDataDetails)}
              showMoviment={this.state.showMoviment}
              isLoadingExtract={this.state.isLoadingExtract}
              hasNextRecharges={hasNextRecharges}
            />
          )}
        </ScrollView>

        {hasNextRecharges &&
          cardDataDetails &&
          nextRecharges &&
          nextRecharges.error === "" && (
            <NextRechargesBox
              value={formatCurrency(rechargePendingValue)}
              onPress={this._openNextRechargesView}
              type="RECHARGE_PENDING"
            />
          )}

        {!hasNextRecharges &&
          cardDataDetails &&
          nextRecharges &&
          nextRecharges.error !== "" && (
            <NextRechargesBox
              value={formatCurrency(rechargePendingValue)}
              onPress={this._openNextRechargesView}
              type="RECHARGE_ERROR"
            />
          )}
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingBottom: getPaddingForNotch(),
    backgroundColor: "white"
  },
  card: {
    zIndex: 20,
    marginHorizontal: 16
  },
  scrollView: {
    flex: 1
  },
  buttonsContainer: {
    alignItems: "stretch",
    padding: 16
  },
  infoButtonContainer: {
    flexDirection: "row"
  },
  infoButton: {
    flex: 1
  },
  list: {},
  firstButton: {
    flex: 1,
    marginRight: 16
  },
  secondButton: {
    flex: 1
  },
  singleButton: {
    margin: 16,
    marginTop: 0
  },
  buStatementMessage: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16
  },
  emptyIcon: {
    height: 40,
    width: 40,
    marginRight: 16
  },
  buStatementText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 24,
    color: colors.GRAY
  },
  containerRechargePending: {
    marginLeft: 12,
    marginRight: 12
  },
  rechargePending: {
    height: 71,
    width: "100%",
    position: "absolute",
    bottom: 12,
    backgroundColor: "#6E3E91",
    elevation: 1,
    borderRadius: 8
  },
  rechargePendingImage: {
    flexDirection: "row"
  },
  containerImageRechargePending: {
    marginLeft: 15.5,
    marginTop: 17.5,
    marginBottom: 18.5
  },
  containerRechargeDescription: {
    flex: 1,
    marginLeft: 16.49,
    marginTop: 10,
    alignItems: "flex-start"
  },
  rechargeValue: {
    color: "#fdc300",
    fontSize: 12,
    fontWeight: "bold"
  }
});

// redux connect and export
const mapStateToProps = state => {
  return {
    hasConfigError: getHasConfigError(state),
    configUi: getConfigContentUI(state),
    cardData: getCurrentTransportCard(state),
    cardDataDetails: getCurrentTransportCardDetails(state),
    bomCreditValueRange: getBOMCreditValueRange(state),
    cardStatement: filterCurrentCardStatementBySupportedCharacteristics(state),
    statementUi: getStatementUI(state),
    cardHelpId: getCardHelpId(state),
    issuerConfig: getIssuerConfig(state),
    rechargePendingValue: rechargePendingValue(state),
    nextRecharges: state.transportCard.nextRecharges[0]
  };
};

export const CardDetails = connect(mapStateToProps)(CardDetailsView);

export * from "./EditCard";
export * from "./NextRecharges";
export * from "./SchoolCardDetails";
