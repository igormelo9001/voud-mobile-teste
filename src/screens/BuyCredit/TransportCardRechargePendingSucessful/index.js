// NPM imports
import React, { Component } from "react";
import { ScrollView, Image, View, BackHandler } from "react-native";
import { connect } from "react-redux";

// VouD imports
import BrandText from "../../../components/BrandText";
import SystemText from "../../../components/SystemText";
import Icon from "../../../components/Icon";
import Button from "../../../components/Button";
import { backToHome, navigateFromHome, backToRoute } from "../../../redux/nav";
import { fetchCardList } from "../../../redux/transport-card";
import { routeNames } from "../../../shared/route-names";
import { productTypes, getProductTypeLabel } from "../../../redux/financial";
import { buCreditTypeLabels } from "../../../utils/transport-card";
import { formatCurrencyFromCents } from "../../../utils/parsers-formaters";

const validator = require("../../../images/validator-y.png");
const smartPurchaseCalendar = require("../../../images/smart-purchase-calendar.png");

import styles from "./style";

// Screen component
class TransportCardRechargePendingSuccessfulView extends Component {
  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this._backHandler);
  }

  componentDidMount() {
    RatingTracker.handlePositiveEvent();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._backHandler);
  }

  _backHandler = () => {
    this._finish();
    return true;
  };

  _finish = () => {
    const {
      dispatch,
      navigation: {
        state: {
          params: { smartPurchaseFlow }
        }
      }
    } = this.props;
    dispatch(fetchCardList());

    if (smartPurchaseFlow) {
      dispatch(backToRoute(routeNames.SMART_PURCHASE));
    } else {
      dispatch(backToHome());
    }
  };

  _goToServicePoints = () => {
    const { dispatch } = this.props;
    dispatch(
      navigateFromHome(routeNames.SEARCH_POINTS_OF_INTEREST, {
        isTransportCardRecharge: true
      })
    );
  };

  _getPurchaseValueText = () => {
    const {
      navigation: {
        state: {
          params: { paymentData }
        }
      }
    } = this.props;
    const purchaseValue =
      paymentData && paymentData.purchaseValue ? paymentData.purchaseValue : 0;
    return `R$ ${formatCurrencyFromCents(purchaseValue)}`;
  };

  _hasScheduledDay = () => {
    const {
      navigation: {
        state: {
          params: { paymentData }
        }
      }
    } = this.props;
    return paymentData && paymentData.scheduledDay ? true : false;
  };

  _renderPurchaseImage = () => {
    if (this._hasScheduledDay())
      return (
        <Image
          style={styles.smartPurchaseCalendarImage}
          source={smartPurchaseCalendar}
        />
      );

    return <Image style={styles.validatorImage} source={validator} />;
  };

  _getPurchaseOrderText = () => {
    const {
      navigation: {
        state: {
          params: { paymentData }
        }
      }
    } = this.props;
    const isBU = paymentData && paymentData.productType === productTypes.BU;
    const buAdditionalData =
      paymentData && paymentData.buAdditionalData
        ? paymentData.buAdditionalData
        : null;

    if (
      isBU &&
      buAdditionalData &&
      buAdditionalData.buCreditType === buCreditTypeLabels.TEMPORAL
    ) {
      const { periodType, transportType, productQuantity } = buAdditionalData;
      return `${productQuantity} ${
        productQuantity === 1 ? "cota" : "cotas"
      } (${periodType.toLowerCase()} ${transportType.toLowerCase()})`;
    }

    const rechargeValue =
      paymentData && paymentData.rechargeValue ? paymentData.rechargeValue : 0;
    return `R$ ${formatCurrencyFromCents(rechargeValue)}`;
  };

  _getCardNameText = () => {
    const {
      navigation: {
        state: {
          params: { paymentData }
        }
      }
    } = this.props;
    const transportCardNick =
      paymentData && paymentData.transportCardNick
        ? paymentData.transportCardNick
        : "";
    const productType = paymentData && paymentData.productType;
    return `cartão ${getProductTypeLabel(productType)} ${transportCardNick}`;
  };

  _renderPurchaseValidationText = () => {
    return (
      <View style={styles.containerDescription}>
        <BrandText
          style={styles.description}
        >{`Você precisa aproximar o seu cartão em`}</BrandText>
        <BrandText
          style={styles.description}
        >{`qualquer validador das estações de ônibus,`}</BrandText>
        <BrandText
          style={styles.description}
        >{`metrô e trêm ou aguardar 3 dias para validar`}</BrandText>
        <BrandText style={styles.description}>{` nos ônibus.`}</BrandText>
      </View>
    );
  };

  _renderPurchaseText = () => {
    const {
      navigation: {
        state: {
          params: { paymentData }
        }
      }
    } = this.props;

    const scheduledDay =
      paymentData && paymentData.scheduledDay ? paymentData.scheduledDay : 0;

    return (
      <View style={styles.textTitle}>
        <SystemText
          style={styles.purchaseValidationText}
        >{`Todo dia ${scheduledDay} efetuaremos um pedido de`}</SystemText>
        <SystemText
          style={styles.purchaseValidationText}
        >{`compra de R$ ${this._getPurchaseOrderText()}  para este cartão.`}</SystemText>
      </View>
    );
  };

  _getSuccessTitle = () => {
    const {
      navigation: {
        state: {
          params: { smartPurchaseFlow }
        }
      }
    } = this.props;

    if (smartPurchaseFlow) {
      return "A sua compra programada foi agendada com sucesso!";
    }

    if (this._hasScheduledDay()) {
      return "Pagamento mensal aprovado!";
    }
    return "Pagamento aprovado!";
  };

  render() {
    const {
      navigation: {
        state: {
          params: { smartPurchaseFlow }
        }
      }
    } = this.props;

    return (
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Icon style={styles.closeIcon} name="close" onPress={this._finish} />
          <Icon style={styles.successIcon} name="check-circle-outline-copy" />
          <BrandText
            style={
              this._hasScheduledDay()
                ? styles.successTitleSmartPurchase
                : styles.successTitle
            }
          >
            {this._getSuccessTitle()}
          </BrandText>
          {!this._hasScheduledDay() && (
            <View style={styles.textTitle}>
              <SystemText
                style={styles.purchaseValidationText}
              >{`Agora, valide seus créditos`}</SystemText>
              <SystemText
                style={styles.purchaseValidationText}
              >{`nos pontos de recarga.`}</SystemText>
            </View>
          )}
          {this._hasScheduledDay() && this._renderPurchaseText()}
        </View>
        <View style={styles.purchaseImageContainer}>
          {this._renderPurchaseImage()}
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContainer}
        >
          {this._renderPurchaseValidationText()}
        </ScrollView>
        <View style={styles.actionBtnContainer}>
          {smartPurchaseFlow ? (
            <Button onPress={this._finish}>OK</Button>
          ) : (
            <Button onPress={this._goToServicePoints}>Ver Validadores</Button>
          )}
        </View>
      </View>
    );
  }
}

export const TransportCardRechargePendingSuccessful = connect()(
  TransportCardRechargePendingSuccessfulView
);
