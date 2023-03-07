// NPM imports
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";

// VouD imports
import Header, { headerActionTypes } from "../../components/Header";
import RequestFeedback from "../../components/RequestFeedback";
import SmartPurchaseList from "./SmartPurchaseList";

import {
  fetchSmartPurchases,
  fetchSaveSmartPurchase
} from "../../redux/smart-purchase";
import { setPurchaseTransportCard } from "../../redux/financial";
import {
  fetchCardList,
  transportCardTypes,
  fetchCardListRealBalance
} from "../../redux/transport-card";
import { viewHelpDetails } from "../../redux/help";
import { navigateToRoute } from "../../redux/nav";
import {
  getCardListUI,
  getSmartPurchaseListUI,
  getSmartPurchaseList,
  getSmartPurchaseHelpId,
  getIssuerConfig,
  getSaveSmartPurchaseUI,
  getSavedPaymentList,
  getSavedPaymentMethodsUI,
  getHasConfigError,
  getPurchaseTransportCard,
  getCurrentTransportCardDetails
} from "../../redux/selectors";
import { routeNames } from "../../shared/route-names";
import { checkIssuerEnabled } from "../../utils/issuer-config";
import { showToast } from "../../redux/toast";
import { addEllipsis } from "../../utils/string-util";
import LoadMask from "../../components/LoadMask";
import { checkIfSmartPurchaseHasPaymentMethod } from "../../utils/smart-purchase-util";
import { fetchSavedPaymentMethods } from "../../redux/payment-method";
import { configErrorHandler } from "../../shared/config-error-handler";

// Screen component
class SmartPurchaseView extends Component {
  componentDidMount() {
    this._fetchRequests();
  }

  _fetchRequests = () => {
    const { dispatch } = this.props;

    dispatch(fetchCardList()).then(() => {
      dispatch(fetchSmartPurchases());
    });
    dispatch(fetchSavedPaymentMethods());
  };

  _goToSetSmartPurchase = ({ cardData }) => {
    const { dispatch, issuerConfig, hasConfigError } = this.props;

    if (hasConfigError) {
      configErrorHandler();
      return;
    }

    if (checkIssuerEnabled(cardData.issuerType, issuerConfig)) {
      dispatch(setPurchaseTransportCard(cardData.uuid));

      dispatch(
        navigateToRoute(routeNames.BUY_CREDIT, { smartPurchaseFlow: true })
      );
    }
  };

  _goToEditSmartPurchase = smartPurchase => {
    const { cardData } = smartPurchase;
    const { dispatch, issuerConfig, hasConfigError } = this.props;

    if (hasConfigError) {
      configErrorHandler();
      return;
    }

    if (checkIssuerEnabled(cardData.issuerType, issuerConfig)) {
      dispatch(setPurchaseTransportCard(cardData.uuid));
      dispatch(navigateToRoute(routeNames.EDIT_SMART_PURCHASE));
    }
  };

  _getTransportCardName = cardData => {
    return cardData.issuerType &&
      cardData.nick &&
      cardData.issuerType.toLowerCase() === cardData.nick.toLowerCase()
      ? cardData.issuerType
      : `${cardData.issuerType} ${addEllipsis(cardData.nick, 25)}`;
  };

  _toggleItemStatus = itemData => {
    const { dispatch, savedPaymentMethods } = this.props;
    const {
      cardData,
      id,
      isActive,
      paymentMethod,
      rechargeValue,
      scheduledDay,
      idTransportCardWallet,
      productQuantity
    } = itemData;

    const params = {
      smartPurchaseId: id,
      activateSmartPurchase: !isActive,
      paymentMethodId: paymentMethod.id,
      rechargeValue: Number(rechargeValue) * 100,
      scheduledDay,
      transportCardId: cardData.uuid,
      transportCardIssuer: cardData.issuer,
      buAdditionalData: {
        ...(cardData.layoutType === transportCardTypes.BU
          ? {
              idTransportCardWallet,
              productQuantity
            }
          : {})
      }
    };

    if (
      !checkIfSmartPurchaseHasPaymentMethod(
        dispatch,
        paymentMethod.id,
        savedPaymentMethods
      )
    )
      return;

    dispatch(fetchSaveSmartPurchase(params)).then(() => {
      const toastMessage = `Compra programada do cartão ${this._getTransportCardName(
        cardData
      )} ${!isActive ? "habilitada" : "desabilitada"} com sucesso!`;

      dispatch(showToast(toastMessage));
    });
  };

  _renderMainContent = () => {
    const {
      smartPurchaseList,
      cardListUi,
      smartPurchaseListUi,
      savedPaymentMethodsUi
    } = this.props;

    if (
      !cardListUi.isFetching &&
      !smartPurchaseListUi.isFetching &&
      cardListUi.error === "" &&
      smartPurchaseListUi.error === "" &&
      smartPurchaseList &&
      smartPurchaseList[0]
    )
      return (
        <SmartPurchaseList
          itemList={smartPurchaseList}
          onConfig={this._goToSetSmartPurchase}
          onEdit={this._goToEditSmartPurchase}
          onItemStatusToggle={this._toggleItemStatus}
        />
      );

    return (
      <View style={styles.requestFeedbackContainer}>
        <RequestFeedback
          loadingMessage="Carregando compras programadas..."
          errorMessage={
            cardListUi.error ||
            smartPurchaseListUi.error ||
            savedPaymentMethodsUi.error
          }
          emptyMessage="Não foram encontrados cartões"
          retryMessage="Tentar novamente"
          isFetching={
            cardListUi.isFetching ||
            smartPurchaseListUi.isFetching ||
            savedPaymentMethodsUi.isFetching
          }
          onRetry={this._fetchRequests}
        />
      </View>
    );
  };

  _viewHelp = () => {
    const { dispatch, smartPurchaseHelpId } = this.props;
    dispatch(viewHelpDetails(smartPurchaseHelpId));
    dispatch(navigateToRoute(routeNames.HELP_DETAILS));
  };

  render() {
    const { dispatch, saveSmartPurchaseUi } = this.props;
    return (
      <View style={styles.container}>
        <Header
          title="Compra programada"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: () => dispatch(NavigationActions.back())
          }}
          right={{
            type: headerActionTypes.HELP,
            icon: "help",
            onPress: this._viewHelp
          }}
        />
        {this._renderMainContent()}
        {saveSmartPurchaseUi.isFetching && (
          <LoadMask message="Atualizando compra programada" />
        )}
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
  requestFeedbackContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24
  }
});

function mapStateToProps(state) {
  return {
    hasConfigError: getHasConfigError(state),
    cardListUi: getCardListUI(state),
    smartPurchaseListUi: getSmartPurchaseListUI(state),
    saveSmartPurchaseUi: getSaveSmartPurchaseUI(state),
    smartPurchaseList: getSmartPurchaseList(state),
    smartPurchaseHelpId: getSmartPurchaseHelpId(state),
    savedPaymentMethodsUi: getSavedPaymentMethodsUI(state),
    savedPaymentMethods: getSavedPaymentList(state),
    issuerConfig: getIssuerConfig(state)
  };
}

export const SmartPurchase = connect(mapStateToProps)(SmartPurchaseView);

export * from "./EditSmartPurchase";
