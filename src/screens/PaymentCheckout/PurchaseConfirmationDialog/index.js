// NPM imports
import React, { Component } from "react";
import { View, BackHandler, StyleSheet, Alert } from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";

// VouD imports
import Dialog from "../../../components/Dialog";
import {
  getBUSupportedCreditTypesSelector,
  getPaymentTransactionUI,
  getSaveSmartPurchaseUI
} from "../../../redux/selectors";
import PurchaseConfirmationForm from "./PurchaseConfirmationForm";
import { GATrackEvent, GAEventParams } from "../../../shared/analytics";
import {
  fetchPaymentTransaction,
  paymentCardTypes,
  productTypes,
  requestPaymentTransactionClear
} from "../../../redux/financial";
import { routeNames } from "../../../shared/route-names";
import { navigateToRoute } from "../../../redux/nav";
import { voudErrorCodes } from "../../../shared/services";
import LoadMask from "../../../components/LoadMask";
import { fetchSaveSmartPurchase } from "../../../redux/smart-purchase";
import { fetchPaymentRegisterComplementaryData } from "../../../flows/RequestCard/store/requestCard";
import KeyboardDismissView from "../../../components/KeyboardDismissView";

import { fetchTicketUnitary } from "../../../flows/TicketUnitary/store/ducks/ticketUnitary";

// Screen component
class PurchaseConfirmationDialogView extends Component {
  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._backHandler);
    this.props.dispatch(requestPaymentTransactionClear());
  }

  _backHandler = () => {
    this._dismiss();
    return true;
  };

  _dismiss = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
  };

  _handlePaymentError = error => {
    const {
      dispatch,
      navigation: {
        state: {
          params: { paymentData }
        }
      }
    } = this.props;
    const paymentCardType = paymentData.paymentCardType;
    const productType = paymentData ? paymentData.productType : "";
    let pageError = routeNames.PAYMENT_ERROR;

    if (error.statusCode === voudErrorCodes.EXCEEDED_DAILY_PURCHASE_LIMIT) {
      Alert.alert(
        "Limite diário excedido",
        "Você atingiu o limite de compras permitidas para o dia. Por favor, tente novamente amanhã.",
        [
          {
            text: "OK, entendi",
            onPress: this._dismissAlert
          }
        ],
        {
          onDismiss: this._dismissAlert
        }
      );
      return;
    }

    if (
      paymentCardType === paymentCardTypes.DEBIT ||
      productType !== productTypes.PHONE_RECHARGE
    ) {
      pageError = routeNames.TRANSPORT_CARD_RECHARGE_ERROR;
    }

    if (
      paymentCardType === paymentCardTypes.CREDIT ||
      productType !== productTypes.PHONE_RECHARGE
    ) {
      pageError = routeNames.TRANSPORT_CARD_RECHARGE_ERROR;
    }

    dispatch(
      navigateToRoute([NavigationActions.back(), pageError], {
        paymentData,
        error,
        requestCard: false
      })
    );
  };

  _handlePaymentSuccess = () => {
    const {
      dispatch,
      navigation: {
        state: {
          params: { paymentData, smartPurchaseFlow }
        }
      }
    } = this.props;
    const productType = paymentData ? paymentData.productType : "";

    if (productType === productTypes.PHONE_RECHARGE) {
      dispatch(
        navigateToRoute(routeNames.PHONE_RECHARGE_SUCCESSFUL, { paymentData })
      );
    } else {
      dispatch(
        navigateToRoute(routeNames.PAYMENT_SUCCESSFUL, {
          paymentData,
          smartPurchaseFlow
        })
      );
    }
  };

  _handlerPaymentRequestCardSuccess = () => {
    const {
      dispatch,
      navigation: {
        state: {
          params: { paymentData }
        }
      }
    } = this.props;
    dispatch(
      navigateToRoute(routeNames.REQUEST_CARD_PAYMENT_SUCCESSFUL, {
        paymentData
      })
    );
  };

  _handlerPaymentErrorRequestCard = response => {
    const paymentData = {};
    const { dispatch } = this.props;

    dispatch(
      navigateToRoute([NavigationActions.back(), routeNames.PAYMENT_ERROR], {
        paymentData,
        error: {
          message: "",
          payload: response
        },
        requestCard: true
      })
    );
  };

  _submit = ({ creditCardSecurityCode }) => {
    const {
      dispatch,
      navigation: {
        state: {
          params: {
            paymentData,
            smartPurchaseFlow,
            promocode,
            purchaseTicketUnitary
          }
        }
      }
    } = this.props;

    if (
      paymentData.productType !== undefined &&
      paymentData.productType === "REQUEST_CARD"
    ) {
      // const { categories: { FORM }, actions: { SUBMIT }, labels: { SUBMIT_REQUEST_CARD_PAYMENT } } = GAEventParams;
      // GATrackEvent(FORM, SUBMIT, SUBMIT_REQUEST_CARD_PAYMENT);
      dispatch(
        fetchPaymentRegisterComplementaryData(
          paymentData,
          creditCardSecurityCode
        )
      )
        .then(response => {
          if (parseInt(response.returnCode) === 201) {
            this._handlerPaymentRequestCardSuccess();
          } else {
            this._handlerPaymentErrorRequestCard(response);
          }
        })
        .catch(error => {
          this._handlerPaymentErrorRequestCard(response);
        });
    } else if (purchaseTicketUnitary) {
      if (purchaseTicketUnitary.isPurchaseTicket) {
        const {
          categories: { FORM },
          actions: { SUBMIT },
          labels: { SUBMIT_CREDIT_QRCODE_PAYMENT }
        } = GAEventParams;

        GATrackEvent(FORM, SUBMIT, SUBMIT_CREDIT_QRCODE_PAYMENT);

        const { dispatch } = this.props;

        const completePaymentData = {
          ...paymentData,
          creditCardSecurityCode,
          promocode
        };

        dispatch(fetchTicketUnitary(completePaymentData))
          .then(res => {
            if (res.returnCode === 1) {
              this._handlePaymentError({
                statusCode: 999901
              });
            } else {
              dispatch(
                navigateToRoute(
                  routeNames.PURCHASE_TICKET_PAYMENT_SUCESSFUL,
                  {}
                )
              );
            }
          })
          .catch(this._handlePaymentError);
      }
    } else {
      const {
        categories: { FORM },
        actions: { SUBMIT },
        labels: { SUBMIT_CREDIT_CARD_PAYMENT }
      } = GAEventParams;
      const completePaymentData = {
        ...paymentData,
        creditCardSecurityCode,
        promocode
      };

      const fetchAction = smartPurchaseFlow
        ? fetchSaveSmartPurchase
        : fetchPaymentTransaction;

      if (!smartPurchaseFlow) {
        GATrackEvent(FORM, SUBMIT, SUBMIT_CREDIT_CARD_PAYMENT);
      }

      dispatch(fetchAction(completePaymentData))
        .then(this._handlePaymentSuccess)
        .catch(this._handlePaymentError);
    }
  };

  render() {
    const {
      navigation: {
        state: {
          params: { paymentData, smartPurchaseFlow, promocode }
        }
      },
      paymentTransactionUi,
      saveSmartPurchaseUi,
      requestCard,
      ticketUnitary
    } = this.props;

    const isLoading = ticketUnitary.isFetching || requestCard.isFetching;

    return (
      <View style={styles.mainContainer}>
        {isLoading && <LoadMask />}
        <Dialog noPadding onDismiss={this._dismiss}>
          <KeyboardDismissView style={styles.dialogContent}>
            <PurchaseConfirmationForm
              onSubmit={this._submit}
              paymentData={paymentData}
              smartPurchaseFlow={smartPurchaseFlow}
            />
          </KeyboardDismissView>
        </Dialog>
        {(paymentTransactionUi.isFetching ||
          saveSmartPurchaseUi.isFetching) && <LoadMask />}
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  dialogContent: {
    flex: 0
  }
});

const mapStateToProps = state => {
  return {
    buSupportedCreditTypes: getBUSupportedCreditTypesSelector(state),
    paymentTransactionUi: getPaymentTransactionUI(state),
    saveSmartPurchaseUi: getSaveSmartPurchaseUI(state),
    requestCard: state.requestCard,
    ticketUnitary: state.ticketUnitary
  };
};

export const PurchaseConfirmationDialog = connect(mapStateToProps)(
  PurchaseConfirmationDialogView
);
