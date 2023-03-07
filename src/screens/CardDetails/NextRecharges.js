// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { View, ScrollView, StyleSheet, Animated, Platform, Dimensions } from 'react-native';
import Moment from 'moment';

// VouD imports
import Header, { headerActionTypes } from '../../components/Header';
import BrandText from '../../components/BrandText';
import SystemText from '../../components/SystemText';
import InfoListItem from '../../components/InfoList/InfoListItem';
import KeyValueItem from '../../components/KeyValueItem';
import RequestFeedback from '../../components/RequestFeedback';
import { colors } from '../../styles';
import { formatCurrency, formatBomCardNumber } from '../../utils/parsers-formaters';

import { getColorForLayoutType } from '../../utils/transport-card';

import { fetchNextRecharges, transportCardTypes } from '../../redux/transport-card';
import {
  getCurrentTransportCard,
  getNextRechargesHelpId,
  rechargePendingValue,
} from '../../redux/selectors';
import { viewHelpDetails } from '../../redux/help';
import { routeNames } from '../../shared/route-names';
import { navigateToRoute } from '../../redux/nav';

import NextRechargeList from './NextRechargesList';

const { height } = Dimensions.get('window');

// Screen component
class NextRechargesView extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._fetchNextRecharges();
  }

  _fetchNextRecharges = () => {
    const { dispatch, cardData } = this.props;
    dispatch(fetchNextRecharges(cardData.uuid));
  };

  _getCardColor = () => {
    const { cardData } = this.props;

    if (
      cardData.layoutType &&
      (cardData.layoutType === transportCardTypes.BOM_VT ||
        cardData.layoutType === transportCardTypes.BOM_VT_EXPRESS)
    ) {
      return colors.CARD_VT;
    }

    if (
      cardData.layoutType &&
      (cardData.layoutType === transportCardTypes.BOM_ESCOLAR ||
        cardData.layoutType === transportCardTypes.BOM_ESCOLAR_GRATUIDADE)
    ) {
      return colors.BRAND_SECONDARY;
    }

    return colors.CARD_C;
  };

  // _renderMainContent = () => {
  //   const { cardData } = this.props;
  //   const { nextRecharges } = cardData;

  //   return (
  //     <ScrollView style={styles.scrollView}>
  //       <BrandText style={styles.cardInfoLabel}>{cardData.nick}</BrandText>
  //         <SystemText
  //           style={StyleSheet.flatten([
  //             styles.cardInfoValue,
  //             { borderColor: this._getCardColor() }
  //           ])}
  //         >
  //           {formatBomCardNumber(cardData.cardNumber)}
  //         </SystemText>

  //       <InfoListItem itemContent={"Recarga pendente"} isHeader />
  //       <View style={styles.groupInfoContainer}>
  //         <KeyValueItem
  //           keyContent={"Valor"}
  //           valueContent={"R$ " + formatCurrency(cardData.balanceNextRecharge)}
  //         />
  //       </View>
  //       <InfoListItem itemContent={"Detalhado"} isHeader />
  //       <View style={styles.detailSubheader}>
  //         <View style={styles.detailSubheaderLabels}>
  //           <BrandText style={styles.subheaderInfoLabelL}>
  //             Data cadastro
  //           </BrandText>
  //           <BrandText style={styles.subheaderInfoLabelR}>Valor</BrandText>
  //         </View>
  //       </View>
  //       <View style={styles.groupInfoContainer}>
  //         {nextRecharges &&
  //           nextRecharges.list &&
  //           nextRecharges.list.map((item, i) => {
  //             return (
  //               <KeyValueItem
  //                 key={`${i}`}
  //                 keyContent={Moment(item.availableDate).format("DD/MM/YYYY")}
  //                 valueContent={"R$ " + formatCurrency(item.recharge)}
  //                 useSysFontOnKey
  //               />
  //             );
  //           })}
  //       </View>
  //     </ScrollView>
  //   );
  // };

  _viewHelp = () => {
    const { dispatch, nextRechargesHelpId } = this.props;
    dispatch(viewHelpDetails(nextRechargesHelpId));
    dispatch(navigateToRoute(routeNames.HELP_DETAILS));
  };

  render() {
    const { dispatch, cardData, rechargePendingValue } = this.props;
    const { nextRecharges } = cardData;
    const isFetching = nextRecharges ? nextRecharges.isFetching : false;
    const error = nextRecharges ? nextRecharges.error : '';
    const nextRechargesList = nextRecharges ? nextRecharges.list : [];
    const color = getColorForLayoutType(cardData.layoutType);

    return (
      <View style={styles.mainContainer}>
        <Header
          title="Aguardando validação"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: () => dispatch(NavigationActions.back()),
          }}
          right={{
            type: headerActionTypes.HELP,
            icon: 'help-outline',
            onPress: this._viewHelp,
          }}
          isRequestCard
        />
        {!nextRecharges.isFetching && nextRechargesList && nextRechargesList[0] ? (
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: colors.BRAND_PRIMARY, height: 26 }} />
            <View style={styles.containerTitleCard}>
              <View
                style={StyleSheet.flatten([
                  styles.numberCard,
                  { borderTopColor: color, borderBottomColor: color },
                ])}
              >
                <View style={styles.containerText}>
                  <SystemText style={styles.text}>{cardData.nick}</SystemText>
                  <SystemText style={styles.text}>
                    {formatBomCardNumber(cardData.cardNumber)}
                  </SystemText>
                </View>
              </View>
            </View>
            <View style={styles.containerDetails}>
              <View style={styles.containerTextDetails}>
                <BrandText style={styles.textDetails}>Detalhado</BrandText>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <NextRechargeList itemList={nextRecharges.list} />
            </View>
            <View style={styles.containerValueTotalFooter}>
              <View style={styles.containerValueTotal}>
                <SystemText style={styles.textValueTotal}>Valor total</SystemText>
                <SystemText style={styles.textValueTotal}>{`R$ ${formatCurrency(
                  rechargePendingValue
                )}`}</SystemText>
              </View>
            </View>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.requestFeedbackContainer}
          >
            <RequestFeedback
              loadingMessage="Carregando recargas pendentes..."
              errorMessage={error}
              emptyMessage="Não foram encontradas recargas pendentes"
              retryMessage="Tentar novamente"
              isFetching={isFetching}
              onRetry={this._fetchNextRecharges}
            />
          </ScrollView>
        )}
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  requestFeedbackContainer: {
    flexGrow: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  cardInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  cardInfoLabel: {
    flex: 1,
    marginRight: 8,
    fontSize: 16,
    lineHeight: 20,
    color: colors.GRAY_DARKER,
  },
  cardInfoValue: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 2,
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '500',
    color: colors.GRAY_DARKER,
  },
  detailSubheader: {
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.GRAY_LIGHT2,
  },
  cardTypeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
    color: colors.GRAY_DARKER,
  },
  detailSubheaderLabels: {
    flexDirection: 'row',
  },
  subheaderInfoLabelL: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 16,
    color: colors.GRAY,
  },
  subheaderInfoLabelR: {
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 16,
    color: colors.GRAY,
  },
  groupInfoContainer: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  containerTitleCard: {
    marginLeft: 16,
    marginRight: 16,
  },
  numberCard: {
    position: 'absolute',
    height: 54,
    backgroundColor: 'white',
    top: -26,
    left: 0,
    right: 0,
    elevation: 10,
    borderTopWidth: 5,
    borderBottomWidth: 1,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderColor:
      Platform.OS === 'android' && Platform.Version < 21 ? colors.OVERLAY_LIGHT : 'transparent',
    borderWidth: Platform.OS === 'android' && Platform.Version < 21 ? 1 : 0,
  },
  text: {
    height: 20,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  containerText: {
    flex: 1,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 16,
  },
  textValueTotal: {
    height: 19,
    lineHeight: 19,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6E3E91',
  },
  containerValueTotalFooter: {
    position: 'absolute',
    bottom: 0,
    height: 67,
    width: '100%',
    backgroundColor: '#EAEAEA',
  },
  containerValueTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 18,
    marginTop: 24,
    marginRight: 18,
  },
  containerDetails: {
    height: 52,
    backgroundColor: '#EAEAEA',
    width: '100%',
    marginTop: 43,
  },
  containerTextDetails: {
    marginLeft: 17,
    marginTop: 16,
  },
  textDetails: {
    height: 20,
    color: '#6B3C8C',
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});

// redux connect and export
const mapStateToProps = state => {
  return {
    cardData: getCurrentTransportCard(state),
    nextRechargesHelpId: getNextRechargesHelpId(state),
    rechargePendingValue: rechargePendingValue(state),
  };
};

export const NextRecharges = connect(mapStateToProps)(NextRechargesView);
