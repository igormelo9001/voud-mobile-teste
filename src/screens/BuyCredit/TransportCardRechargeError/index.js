// NPM imports
import React, { PureComponent, Fragment } from "react";
import { NavigationActions } from "react-navigation";
import { View, ScrollView, Image } from "react-native";
import { connect } from "react-redux";

// VouD imports
import BrandText from "../../../components/BrandText";
import SystemText from "../../../components/SystemText";
import Button from "../../../components/Button";
import Icon from "../../../components/Icon";
import { voudErrorCodes } from "../../../shared/services";

import { backToHome, navigateToRoute } from "../../../redux/nav";
import {
  requestPaymentTransactionClear,
  paymentCardTypes,
  cieloPaymentStatusCode,
  productTypes
} from "../../../redux/financial";

import { routeNames } from "../../../shared/route-names";
import { GATrackEvent, GAEventParams } from "../../../shared/analytics";
import { FetchError } from "../../../shared/custom-errors";

import styles from "./style";

const cardsErrorImage = require("../../../images/img-pagamento-erro.png");

// Screen component
class TransportCardRechargeErrorView extends PureComponent {
  componentDidMount() {
    const {
      navigation: {
        state: {
          params: { paymentData }
        }
      }
    } = this.props;
    const isDebit =
      paymentData && paymentData.paymentCardType === paymentCardTypes.DEBIT;
    const {
      categories: { ERROR },
      actions: { SUBMIT }
    } = GAEventParams;

    GATrackEvent(
      ERROR,
      SUBMIT,
      isDebit
        ? this._getGADebitCardPaymentErrorLabel()
        : this._getGACreditCardPaymentErrorLabel()
    );
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(requestPaymentTransactionClear());
  }

  _changePaymentMethod = () => {
    const { dispatch } = this.props;
    dispatch(
      navigateToRoute(
        [NavigationActions.back(), routeNames.SELECT_PAYMENT_METHOD],
        {
          purchaseFlow: true,
          backRouteName: routeNames.BUY_CREDIT
        }
      )
    );
  };

  _goToHome = () => {
    const { dispatch } = this.props;
    dispatch(backToHome());
  };

  _goToPurchaseHistory = () => {
    const { dispatch } = this.props;
    dispatch(backToHome());
    dispatch(navigateToRoute(routeNames.PURCHASE_HISTORY));
  };

  _getGACreditCardPaymentErrorLabel = () => {
    const {
      labels: { SUBMIT_CREDIT_CARD_PAYMENT_ERROR }
    } = GAEventParams;
    const {
      navigation: {
        state: {
          params: { error }
        }
      }
    } = this.props;
    const additionalData = error ? error.additionalData : null;
    const payload = additionalData ? additionalData.payload : null;
    const acquirerStatus =
      payload && payload.acquirerStatus ? payload.acquirerStatus : "";
    const acquirerReturnCode =
      payload && payload.acquirerReturnCode ? payload.acquirerReturnCode : "";

    return `${SUBMIT_CREDIT_CARD_PAYMENT_ERROR}${
      acquirerStatus !== "" ? `-${acquirerStatus}` : ""
    }${acquirerReturnCode !== "" ? `-${acquirerReturnCode}` : ""}`;
  };

  _getGADebitCardPaymentErrorLabel = () => {
    const {
      labels: { SUBMIT_DEBIT_CARD_PAYMENT_ERROR }
    } = GAEventParams;
    const {
      navigation: {
        state: { params }
      }
    } = this.props;
    const error = params ? params.error : null;
    const additionalData = error ? error.additionalData : null;
    const payload = additionalData ? additionalData.payload : null;
    let acquirerReturnCode = payload && payload[0] ? payload[0].code : null;
    let acquirerStatus = null;

    if (!acquirerReturnCode) {
      acquirerStatus =
        payload && payload.acquirerStatus ? payload.acquirerStatus : "";
      acquirerReturnCode =
        payload && payload.acquirerReturnCode ? payload.acquirerReturnCode : "";
    }

    return `${SUBMIT_DEBIT_CARD_PAYMENT_ERROR}${
      acquirerStatus !== "" ? `-${acquirerStatus}` : ""
    }${acquirerReturnCode !== "" ? `-${acquirerReturnCode}` : ""}`;
  };

  _getErrorTitle = () => {
    const {
      navigation: {
        state: {
          params: { error }
        }
      }
    } = this.props;
    const additionalData = error ? error.additionalData : null;
    const payload = additionalData ? additionalData.payload : null;
    const acquirerStatus =
      payload && payload.acquirerStatus ? payload.acquirerStatus : null;

    if (error.statusCode === voudErrorCodes.EXCEEDED_DAILY_PURCHASE_LIMIT)
      return "Compra não efetuada!";

    if (acquirerStatus === cieloPaymentStatusCode.DENIED) {
      return "Pagamento não autorizado!";
    }

    if (error && error.name === FetchError.getName()) {
      return "Falha de comunicação!";
    }

    if (!additionalData) {
      return "Falha de comunicação!";
    }

    return "Falha na transação!";
  };

  _renderCardPaymentDeniedErrorText = () => {
    return (
      <View style={{ alignItems: "center" }}>
        <SystemText style={styles.errorDetailText}>
          {`Altere a forma de pagamento e tente`}
        </SystemText>
        <SystemText style={styles.errorDetailText}>novamente.</SystemText>
      </View>
    );
  };

  _renderDefaultErrorText = () => {
    const {
      navigation: {
        state: { params }
      }
    } = this.props;

    const error = params ? params.error : null;
    const additionalData = error ? error.additionalData : null;
    const payload = additionalData ? additionalData.payload : null;
    const acquirerReturnCode = payload && payload[0] ? payload[0].code : null;
    return (
      <Fragment>
        <SystemText style={styles.errorDetailText}>
          {
            "Tivemos uma falha ao processar sua compra. Não se preocupe, o valor não será descontado do seu cartão de crédito. Tente novamente mais tarde."
          }
        </SystemText>
        {acquirerReturnCode && (
          <View>
            <SystemText style={styles.codesText}>{error.message}</SystemText>
          </View>
        )}
      </Fragment>
    );
  };

  _renderFetchErrorText = () => {
    return (
      <SystemText style={styles.errorDetailText}>
        {
          "Tivemos uma falha de requisição com o servidor. Verifique o seu histórico de compras ou tente novamente."
        }
      </SystemText>
    );
  };

  _renderLimitExceeded = () => {
    return (
      <SystemText style={styles.errorDetailText}>
        {
          "Você excedeu o limite para comprar créditos para este cartão de transporte."
        }
      </SystemText>
    );
  };

  _renderErrorDetailText = () => {
    const {
      navigation: {
        state: {
          params: { error }
        }
      }
    } = this.props;

    const additionalData = error ? error.additionalData : null;
    const payload = additionalData ? additionalData.payload : null;
    const acquirerStatus =
      payload && payload.acquirerStatus ? payload.acquirerStatus : null;

    if (error.statusCode === voudErrorCodes.EXCEEDED_DAILY_PURCHASE_LIMIT) {
      return this._renderLimitExceeded();
    }

    if (acquirerStatus === cieloPaymentStatusCode.DENIED) {
      return this._renderCardPaymentDeniedErrorText();
    }

    if (error && error.name === FetchError.getName()) {
      return this._renderFetchErrorText();
    }

    return this._renderDefaultErrorText();
  };

  _renderErrorDetail = () => {
    const {
      navigation: {
        state: {
          params: { error }
        }
      }
    } = this.props;

    const additionalData = error ? error.additionalData : null;
    const payload = additionalData ? additionalData.payload : null;
    const acquirerStatus =
      payload && payload.acquirerStatus ? payload.acquirerStatus : null;

    if (error.statusCode === voudErrorCodes.EXCEEDED_DAILY_PURCHASE_LIMIT) {
      return this._renderLimitExceeded();
    }

    if (acquirerStatus === cieloPaymentStatusCode.DENIED) {
      return this._renderCardPaymentDeniedErrorText();
    }

    if (error && error.name === FetchError.getName()) {
      return this._renderFetchErrorText();
    }

    return this._renderErrorText();
  };

  _renderErrorText = () => {
    const {
      navigation: {
        state: { params }
      }
    } = this.props;

    const error = params ? params.error : null;
    const additionalData = error ? error.additionalData : null;
    // const payload = additionalData ? additionalData : null;
    // const acquirerReturnCode = payload && payload[0] ? payload[0].code : null;
    return (
      <Fragment>
        {additionalData && (
          <View>
            <SystemText style={[styles.codesText]}>
              {additionalData.returnMessage}
            </SystemText>
          </View>
        )}
      </Fragment>
    );
  };

  _renderActionBtn = () => {
    const {
      navigation: {
        state: {
          params: { error }
        }
      }
    } = this.props;
    const additionalData = error ? error.additionalData : null;
    const payload = additionalData ? additionalData.payload : null;
    const acquirerStatus =
      payload && payload.acquirerStatus ? payload.acquirerStatus : null;

    const titleButton =
      error.statusCode === voudErrorCodes.EXCEEDED_DAILY_PURCHASE_LIMIT
        ? "ALTERAR CARTÃO DE TRANSPORTE"
        : "TENTAR NOVAMENTE";

    if (acquirerStatus === cieloPaymentStatusCode.DENIED) {
      return (
        <Fragment>
          <Button onPress={this._changePaymentMethod}>
            Alterar forma de pagamento
          </Button>
        </Fragment>
      );
    }

    if (error && error.name === FetchError.getName()) {
      return (
        <Fragment>
          <Button onPress={this._goToPurchaseHistory}>
            Verificar histórico de compras
          </Button>
        </Fragment>
      );
    }

    return (
      <Button onPress={this._goToHome} style={styles.actionButton}>
        {titleButton}
      </Button>
    );
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Icon
            style={styles.closeIcon}
            name="close"
            onPress={this._goToHome}
          />
          <Icon style={styles.attentionIcon} name="ic-error" />
          <BrandText style={styles.errorTitle}>
            {this._getErrorTitle()}
          </BrandText>

          <View style={{ marginBottom: 74 }}>
            {this._renderErrorDetailText()}
          </View>
        </View>
        <View style={styles.cardsErrorImageContainer}>
          <Image style={styles.cardsErrorImage} source={cardsErrorImage} />
        </View>
        <View style={{ padding: 16 }}>{this._renderErrorDetail()}</View>
        <View style={styles.actionBtnContainer}>{this._renderActionBtn()}</View>
      </View>
    );
  }
}

export const TransportCardRechargeError = connect()(
  TransportCardRechargeErrorView
);
