// NPM imports
import React, { Component, Fragment } from "react";
import { NavigationActions } from "react-navigation";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { connect } from "react-redux";

// VouD imports
import BrandText from "../../components/BrandText";
import SystemText from "../../components/SystemText";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import TouchableText from "../../components/TouchableText";

import { backToHome, navigateToRoute } from "../../redux/nav";
import {
  requestPaymentTransactionClear,
  paymentCardTypes,
  cieloPaymentStatusCode,
  productTypes
} from "../../redux/financial";
import { colors } from "../../styles";
import { routeNames } from "../../shared/route-names";
import { GATrackEvent, GAEventParams } from "../../shared/analytics";
import { FetchError } from "../../shared/custom-errors";

const cardsErrorImage = require("../../images/cards-error.png");

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white"
  },
  headerContainer: {
    paddingTop: 48,
    backgroundColor: colors.BRAND_ERROR,
    alignItems: "center",
    paddingHorizontal: 16
  },
  scrollView: {
    flex: 1
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 16
  },
  closeIcon: {
    color: "white",
    width: 24,
    fontSize: 24,
    position: "absolute",
    top: 40,
    left: 16
  },
  attentionIcon: {
    color: "white",
    width: 72,
    fontSize: 72,
    marginTop: 16,
    marginBottom: 36
  },
  errorTitle: {
    color: "white",
    fontSize: 20,
    lineHeight: 28,
    textAlign: "center",
    marginBottom: 93
  },
  errorDetailText: {
    color: colors.GRAY,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center"
  },
  cardsErrorImageContainer: {
    alignItems: "center"
  },
  cardsErrorImage: {
    marginTop: -57,
    width: 150,
    height: 114
  },
  actionBtnContainer: {
    padding: 16
  },
  cancelButton: {
    marginTop: 16
  },
  codesText: {
    marginTop: 16,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    color: colors.GRAY
  }
});

// Screen component
class PaymentErrorView extends Component {
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
    const {
      dispatch,
      navigation: {
        state: {
          params: { error, requestCard }
        }
      }
    } = this.props;

    if (requestCard) {
      this._goToPaymentRequestCard();
    } else {
      dispatch(backToHome());
    }
  };

  _goToPaymentRequestCard = () => {
    const { dispatch } = this.props;
    dispatch(
      navigateToRoute([NavigationActions.back()], {
        backRouteName: routeNames.REQUEST_CARD_PAYMENT
      })
    );
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
          params: { error, requestCard }
        }
      }
    } = this.props;
    const additionalData = error ? error.additionalData : null;
    const payload = additionalData ? additionalData.payload : null;
    const acquirerStatus =
      payload && payload.acquirerStatus ? payload.acquirerStatus : null;

    if (acquirerStatus === cieloPaymentStatusCode.DENIED) {
      return "Pagamento não autorizado";
    }

    if (error && error.name === FetchError.getName()) {
      return "Falha de comunicação";
    }

    if (requestCard) {
      let message = "Pagamento não autorizado";
      if (error.payload === undefined) {
        message = "Falha na transação";
      } else if (parseInt(error.payload.returnCode, 10) === 1) {
        message = "Falha na transação";
      }
      return message;
    }

    return "Falha na transação";
  };

  _renderCardPaymentDeniedErrorText = () => {
    const {
      navigation: {
        state: {
          params: { paymentData, error }
        }
      }
    } = this.props;
    const additionalData = error ? error.additionalData : null;
    const payload = additionalData ? additionalData.payload : null;
    const acquirerStatus =
      payload && payload.acquirerStatus ? payload.acquirerStatus : null;
    const acquirerReturnCode =
      payload && payload.acquirerReturnCode ? payload.acquirerReturnCode : null;
    const acquirerReturnMessage =
      payload && payload.acquirerReturnMessage
        ? payload.acquirerReturnMessage
        : null;
    const productText =
      paymentData && paymentData.productType === productTypes.PHONE_RECHARGE
        ? "realizar a recarga de celular."
        : "comprar os créditos.";

    return (
      <Fragment>
        <SystemText style={styles.errorDetailText}>
          {`Ocorreu um erro no processo de autorização de seu pagamento. Utilize outra forma de pagamento para ${productText}`}
        </SystemText>
        {acquirerReturnMessage && (
          <SystemText style={styles.codesText}>
            {acquirerReturnMessage}
          </SystemText>
        )}
        <SystemText style={styles.codesText}>{`- ${acquirerStatus}${
          acquirerReturnCode ? ` / ${acquirerReturnCode}` : ""
        } -`}</SystemText>
      </Fragment>
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

    let text =
      "Tivemos uma falha ao processar sua compra. Não se preocupe, o valor não será descontado do seu cartão de crédito. Tente novamente mais tarde.";
    if (params.requestCard) {
      text =
        "Tivemos uma falha ao processar seu pagamento.Tente novamente mais tarde.";

      if (params.error.payload === undefined) {
        text =
          "Tivemos uma falha na solicitação. Não se preocupe, o valor não será descontado do seu cartão de crédito. Tente novamente mais tarde.";
      } else if (parseInt(params.error.payload.returnCode, 10) === 1) {
        text =
          "Tivemos uma falha na solicitação. Não se preocupe, o valor não será descontado do seu cartão de crédito. Tente novamente mais tarde.";
      }
    }

    return (
      <Fragment>
        <SystemText style={styles.errorDetailText}>{text}</SystemText>
        <SystemText style={styles.codesText}>{error.message}</SystemText>
        {acquirerReturnCode && (
          <SystemText
            style={styles.codesText}
          >{`- ${acquirerReturnCode} -`}</SystemText>
        )}
      </Fragment>
    );
  };

  _renderFetchErrorText = () => {
    return (
      <SystemText style={styles.errorDetailText}>
        {`Tivemos uma falha de requisição com o servidor. Verifique o seu histórico de compras ou tente novamente.`}
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

    if (acquirerStatus === cieloPaymentStatusCode.DENIED) {
      return this._renderCardPaymentDeniedErrorText();
    }

    if (error && error.name === FetchError.getName()) {
      return this._renderFetchErrorText();
    }

    return this._renderDefaultErrorText();
  };

  _renderActionBtn = () => {
    const {
      navigation: {
        state: {
          params: { error, requestCard }
        }
      }
    } = this.props;

    const additionalData = error ? error.additionalData : null;
    const payload = additionalData ? additionalData.payload : null;
    const acquirerStatus =
      payload && payload.acquirerStatus ? payload.acquirerStatus : null;

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

    if (requestCard) {
      return (
        <Button
          onPress={this._goToPaymentRequestCard}
          style={styles.actionButton}
        >
          Voltar
        </Button>
      );
    }

    return (
      <Button onPress={this._goToHome} style={styles.actionButton}>
        Voltar para a home
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
          <Icon style={styles.attentionIcon} name="attention" />
          <BrandText style={styles.errorTitle}>
            {this._getErrorTitle()}
          </BrandText>
        </View>
        <View style={styles.cardsErrorImageContainer}>
          <Image style={styles.cardsErrorImage} source={cardsErrorImage} />
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContainer}
        >
          {this._renderErrorDetailText()}
        </ScrollView>
        <View style={styles.actionBtnContainer}>{this._renderActionBtn()}</View>
      </View>
    );
  }
}

export const PaymentError = connect()(PaymentErrorView);
