// NPM imports
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  BackHandler,
  View,
  ScrollView,
  StyleSheet,
  AppState
} from "react-native";
import Moment from "moment";

// VouD imports
import Header, { headerActionTypes } from "../../components/Header";
import TransportCardSm from "../../components/TransportCardSm";
import KeyboardDismissView from "../../components/KeyboardDismissView";
import {
  getPurchaseTransportScheduledCard,
  getPurchaseTransportCard,
  getSavedPaymentMethodsUI,
  getSmartPurchaseListUI,
  getEditTransportCardUI,
  getApiStatusUI,
  getSelectedPaymentMethod,
  getTransportCards,
  getPromocodeResponse,
  getLoggedUser
} from "../../redux/selectors";
import { navigateToRoute } from "../../redux/nav";
import {
  fetchSavedPaymentMethods,
  selectFirstPaymentMethod,
  selectPaymentMethod,
  unselectPaymentMethod
} from "../../redux/payment-method";
import { fetchSmartPurchases } from "../../redux/smart-purchase";
import { transportCardTypes } from "../../redux/transport-card";
import { setPurchaseTransportCard } from "../../redux/financial";
import { routeNames } from "../../shared/route-names";
import { showBuySessionExitAlert } from "../../shared/buy-session-timer";

// Group imports
import { productTypes, paymentCardTypes } from "../../redux/financial";
import { getStateCurrentRouteName } from "../../utils/nav-util";
import { findBUProduct, buCreditTypeLabels } from "../../utils/transport-card";
import RequestFeedback from "../../components/RequestFeedback";
import LoadMask from "../../components/LoadMask";
import BrandText from "../../components/BrandText";
import PurchaseForm from "./PurchaseForm";
import { colors } from "../../styles";
import { fetchAPIStatus } from "../../redux/api-status";
import { getPaddingForNotch } from "../../utils/is-iphone-with-notch";
import _ from "lodash";
import IconButton from "../../components/IconButton";
import { fetchPromocodeClear } from "../../redux/promo-code";

// Screen component
class BuyCreditView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSmartPurchaseAlert: false
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    BackHandler.addEventListener("hardwareBackPress", this._backHandler);
    this._fetchRequests();
  }

  componentDidMount() {
    const { cardData, cardsList, dispatch } = this.props;
    if (!_.isEmpty(cardData)) return;

    if (cardsList.length > 0)
      dispatch(setPurchaseTransportCard(cardsList[0].id));
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._backHandler);

    if (AppState.currentState === "active") {
      this.props.dispatch(unselectPaymentMethod());
    }
  }

  _fetchRequests = () => {
    const {
      dispatch,
      navigation: {
        state: { params }
      },
      selectedPaymentMethod
    } = this.props;
    const editSmartPurchase =
      params && params.editSmartPurchase ? params.editSmartPurchase : null;

    dispatch(fetchSavedPaymentMethods()).then(() => {
      if (editSmartPurchase) {
        const paymentMethodId = editSmartPurchase.paymentMethod
          ? editSmartPurchase.paymentMethod.id
          : null;
        dispatch(selectPaymentMethod(paymentMethodId));
      } else {
        if (!selectedPaymentMethod) dispatch(selectFirstPaymentMethod());
      }
    });
    dispatch(fetchAPIStatus());

    if (!this._isSmartPurchaseFlow()) {
      dispatch(fetchSmartPurchases());
    }
  };

  _backHandler = () => {
    const { nav } = this.props;
    const currentRouteName = getStateCurrentRouteName(nav);

    if (currentRouteName === routeNames.BUY_CREDIT) {
      this._back();
      return true;
    }
    return false;
  };

  _getBUAdditionalData = ({
    buCreditType,
    periodType,
    transportType,
    quotaQty
  }) => {
    const { cardData } = this.props;

    const selectedBUProduct = findBUProduct(
      cardData.wallets,
      buCreditType,
      buCreditType,
      transportType,
      cardData.activeMonth
    );

    return {
      idTransportCardWallet: selectedBUProduct ? selectedBUProduct.id : 0,
      productQuantity:
        buCreditType === buCreditTypeLabels.TEMPORAL ? quotaQty : 0,
      buCreditType,
      periodType,
      transportType
    };
  };

  renderProductTypes = () => {
    // const isBU = this._isBUFlow();

    const {
      cardData: { layoutType }
    } = this.props;

    switch (layoutType) {
      case transportCardTypes.BU:
        return productTypes.BU;
      case transportCardTypes.LEGAL:
        return productTypes.LEGAL;

      default:
        return productTypes.BOM;
    }
  };

  _getPaymentInfo = formData => {
    const {
      cardData,
      navigation: {
        state: { params }
      }
    } = this.props;
    const {
      paymentMethod: {
        id,
        isTemporaryCard,
        saveCreditCard,
        items: { cardNumber, expirationDate, cardFlag, cardToken, cardHolder }
      },
      creditValue,
      enableSmartPurchase,
      scheduledDay
    } = formData;
    const isBU = this._isBUFlow();
    const editSmartPurchase =
      params && params.editSmartPurchase ? params.editSmartPurchase : null;

    return {
      // productType: isBU ? productTypes.BU : productTypes.BOM,
      productType: this.renderProductTypes(),
      transportCardNumber: cardData.cardNumber,
      transportCardId: cardData.uuid,
      transportCardIssuer: cardData.issuer,
      transportCardNick: cardData.nick,
      rechargeValue: creditValue,
      purchaseValue: Number(creditValue),
      scheduledDay: enableSmartPurchase ? scheduledDay : null,
      paymentCardType: paymentCardTypes.CREDIT,
      paymentMethodId: !isTemporaryCard ? id : null,
      creditCardNumber: cardNumber ? cardNumber : null,
      creditCardExpirationDate: expirationDate ? expirationDate : null,
      creditCardBrand: cardFlag ? cardFlag : null,
      cardToken: cardToken ? cardToken : null,
      saveCreditCard: saveCreditCard ? saveCreditCard : null,
      creditCardHolder: cardHolder ? cardHolder : null,
      buAdditionalData: {
        ...(isBU ? this._getBUAdditionalData(formData) : {})
      },
      ...(this._isSmartPurchaseFlow() ? { activateSmartPurchase: true } : {}),
      ...(editSmartPurchase ? { smartPurchaseId: editSmartPurchase.id } : {})
    };
  };

  _submit = formData => {
    const { loggedUser, promocodeResponse, selectedPaymentMethod } = this.props;
    const paymentData = this._getPaymentInfo(formData);
    const cardFlag =
      selectedPaymentMethod.items && selectedPaymentMethod.items.cardFlag;

    const promocode = promocodeResponse.data
      ? {
          code: promocodeResponse.data.code,
          rechargeValue: paymentData.rechargeValue / 100,
          idCustomer: loggedUser.id,
          brandcard: cardFlag
        }
      : {};

    this.props.dispatch(
      navigateToRoute(routeNames.PURCHASE_CONFIRMATION_DIALOG, {
        paymentData,
        smartPurchaseFlow: this._isSmartPurchaseFlow(),
        promocode: promocode
      })
    );
  };

  _back = () => {
    const { dispatch } = this.props;
    showBuySessionExitAlert(dispatch, this._isSmartPurchaseFlow());
  };

  _isBUFlow = () => this.props.cardData.layoutType === transportCardTypes.BU;

  _isSmartPurchaseFlow = () => {
    const {
      navigation: {
        state: { params }
      }
    } = this.props;
    return params && params.smartPurchaseFlow;
  };

  _showLastSmartPurchaseFireAlert = showSmartPurchaseAlert => {
    this.setState({ showSmartPurchaseAlert });
  };

  _renderSmartPurchaseAlert = () => {
    return (
      <View style={styles.smartPurchaseAlertContainer}>
        <BrandText style={styles.smartPurchaseAlertText}>
          <BrandText>
            As compras programadas foram encerradas por hoje,{" "}
          </BrandText>
          <BrandText style={styles.fontBold}>
            mas não se preocupe, ela será realizada no dia seguinte, logo pela
            manhã
          </BrandText>
          <BrandText>{`. As próximas compras serão realizadas todo dia ${Moment().format(
            "DD"
          )} de cada mês.`}</BrandText>
        </BrandText>
      </View>
    );
  };

  _renderOtherCards() {
    if (this.props.cardsList.length <= 1)
      return <View style={styles.changeCard} />;

    return (
      <IconButton
        style={styles.changeCard}
        iconStyle={styles.changeCardIcon}
        textStyle={styles.changeCardText}
        iconName="retweet"
        onPress={this._handleCardSelect}
      >
        escolher outro cartão
      </IconButton>
    );
  }

  _handleCardSelect = () => {
    if (this.props.cardsList.length > 1)
      this.props.dispatch(fetchPromocodeClear());
    this.props.dispatch(navigateToRoute(routeNames.CARD_SELECT));
  };

  render() {
    const {
      cardData,
      cardsList,
      savedPaymentMethodsUi,
      smartPurchaseUi,
      removeUi,
      apiStatusUi,
      navigation: {
        state: { params }
      },
      cardDetails
    } = this.props;

    const isSmartPurchaseFlow = this._isSmartPurchaseFlow();
    const editSmartPurchase =
      params && params.editSmartPurchase ? params.editSmartPurchase : null;
    const hideForm =
      savedPaymentMethodsUi.isFetching ||
      savedPaymentMethodsUi.error !== "" ||
      smartPurchaseUi.isFetching ||
      smartPurchaseUi.error !== "" ||
      apiStatusUi.isFetching ||
      apiStatusUi.error !== "" ||
      _.isEmpty(cardData);

    return (
      <View style={styles.container}>
        <Header
          title={isSmartPurchaseFlow ? "Programar compra" : "Comprar crédito"}
          left={{
            type: headerActionTypes.BACK,
            onPress: this._back
          }}
        />
        {this.state.showSmartPurchaseAlert && this._renderSmartPurchaseAlert()}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
        >
          <KeyboardDismissView>
            {hideForm && (
              <View style={styles.requestFeedbackContainer}>
                <RequestFeedback
                  loadingMessage="Carregando..."
                  errorMessage={
                    savedPaymentMethodsUi.error ||
                    smartPurchaseUi.error ||
                    apiStatusUi.error
                  }
                  retryMessage="Tentar novamente"
                  isFetching={
                    savedPaymentMethodsUi.isFetching ||
                    smartPurchaseUi.isFetching ||
                    apiStatusUi.isFetching
                  }
                  onRetry={this._fetchRequests}
                />
              </View>
            )}
            {/* Note - This View uses hideForm styles to prevent unecessary unmounts when the request states changes */}
            {!_.isEmpty(cardData) && (
              <View style={hideForm ? styles.hideForm : styles.formContainer}>
                <TransportCardSm
                  style={styles.transportCard}
                  cardName={cardData.nick}
                  cardNumber={cardData.cardNumber}
                  layoutType={cardData.layoutType}
                />
                {this._renderOtherCards()}
                <PurchaseForm
                  onSubmit={this._submit}
                  cardData={cardData}
                  cardDetails={cardDetails}
                  style={styles.form}
                  smartPurchaseFlow={isSmartPurchaseFlow}
                  editSmartPurchase={editSmartPurchase}
                  onShowLastSmartPurchaseFireAlert={
                    this._showLastSmartPurchaseFireAlert
                  }
                />
              </View>
            )}
          </KeyboardDismissView>
        </ScrollView>
        {(removeUi.isFetching ||
          (_.isEmpty(cardData) && cardsList.length > 0)) && <LoadMask />}
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  transportCard: {
    marginTop: 16,
    marginHorizontal: 16
  },
  scrollView: {
    flex: 1,
    paddingBottom: getPaddingForNotch()
  },
  content: {
    flexGrow: 1
  },
  form: {
    flex: 1
  },
  hideForm: {
    width: 0,
    height: 0
  },
  formContainer: {
    flex: 1,
    position: "relative"
  },
  requestFeedbackContainer: {
    flex: 1,
    justifyContent: "center"
  },
  smartPurchaseAlertContainer: {
    padding: 16,
    backgroundColor: colors.GRAY_DARKER
  },
  smartPurchaseAlertText: {
    color: "white",
    fontSize: 14,
    lineHeight: 20
  },
  fontBold: {
    fontWeight: "bold"
  },
  changeCard: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40
  },
  changeCardIcon: {
    fontSize: 20
  },
  changeCardText: {
    fontSize: 14
  }
});

// redux connect and export
const mapStateToProps = state => {
  return {
    cardData: getPurchaseTransportScheduledCard(state),
    cardsList: getTransportCards(state),
    nav: state.nav,
    savedPaymentMethodsUi: getSavedPaymentMethodsUI(state),
    smartPurchaseUi: getSmartPurchaseListUI(state),
    removeUi: getEditTransportCardUI(state),
    apiStatusUi: getApiStatusUI(state),
    selectedPaymentMethod: getSelectedPaymentMethod(state),
    promocodeResponse: getPromocodeResponse(state),
    loggedUser: getLoggedUser(state),
    cardDetails: getPurchaseTransportCard(state)
  };
};

export const BuyCredit = connect(mapStateToProps)(BuyCreditView);

// export other screens from group
export * from "./TransportCardRechargeSuccessful";
export * from "./CardListSelect";
