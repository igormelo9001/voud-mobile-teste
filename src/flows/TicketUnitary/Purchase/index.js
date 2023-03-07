import React, { Component } from "react";
import { connect } from "react-redux";

import {
  View,
  ScrollView,
  AppState,
  BackHandler,
  Keyboard
} from "react-native";
import { reduxForm, Field, formValueSelector, change } from "redux-form";
// import { NavigationActions } from 'react-navigation';
import Header, { headerActionTypes } from "../../../components/Header";
import { showBuySessionExitAlert } from "../../../shared/buy-session-timer";
import { routeNames } from "../../../shared/route-names";
import { navigateToRoute } from "../../../redux/nav";
import { fetchPromocodeClear } from "../../../redux/promo-code";
import { showToast, toastStyles } from "../../../redux/toast";
import { clearReduxForm } from "../../../utils/redux-form-util";
import {
  calculateTaxClear,
  paymentCardTypes,
  productTypes
} from "../../../redux/financial";
import { required } from "../../../utils/validators";
import {
  getPromocodeResponse,
  getSelectedPaymentMethod,
  getLoggedUser
} from "../../../redux/selectors";
import { fetchAPIStatus } from "../../../redux/api-status";

import {
  unselectPaymentMethod,
  fetchSavedPaymentMethods,
  selectFirstPaymentMethod
} from "../../../redux/payment-method";

import BuySummary from "../../../screens/PaymentCheckout/BuySummary";
import PromocodeField from "../../../screens/BuyCredit/PurchaseForm/PromocodeField";
import PaymentMethodField from "../../../screens/BuyCredit/PurchaseForm/PaymentMethodField";
import PurchaseCardView from "./card";
import CreditValue from "./CreditValue";

import styles from "./style";
import LoadMask from "../../../components/LoadMask";

const reduxFormName = "purchaseTicketForm";
const discountLabel = "Desconto";
const TOASTED_MUST_HAVE_CREDIT = "Favor selecionar o valor da recarga.";
const TOASTED_MUST_HAVE_PAYMENT_METHOD = "Favor selecionar forma de pagamento.";

class PurchaseTicketView extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      navigation: { dispatch }
    } = this.props;

    const value = 4.3;
    dispatch(change(reduxFormName, "creditValue", value.toFixed(2)));

    this.fetchRequests();
  }

  componentWillMount() {
    // this.fetchRequests();
  }

  // eslint-disable-next-line react/sort-comp
  componentWillUnmount() {
    const {
      navigation: { dispatch }
    } = this.props;
    BackHandler.removeEventListener("hardwareBackPress", this.back);

    dispatch(calculateTaxClear());
    clearReduxForm(dispatch, reduxFormName);
    dispatch(fetchPromocodeClear());

    if (AppState.currentState === "active") {
      dispatch(unselectPaymentMethod());
    }
  }

  componentDidUpdate() {
    const { promocodeResponse, dispatch, change } = this.props;
    if (promocodeResponse.data != null) {
      const { discountValue } = promocodeResponse.data;
      dispatch(change("discountValue", discountValue));
    } else {
      dispatch(change("discountValue", null));
    }
  }

  back = () => {
    const {
      navigation: { dispatch }
    } = this.props;
    showBuySessionExitAlert(dispatch, false);
  };

  fetchRequests = () => {
    const { dispatch, selectedPaymentMethod } = this.props;

    dispatch(fetchSavedPaymentMethods()).then(() => {
      if (!selectedPaymentMethod) dispatch(selectFirstPaymentMethod());
    });
    // dispatch(fetchAPIStatus());
  };

  onPressDiscountValue = () => {
    const {
      dispatch,
      creditValue,
      discountValue,
      paymentMethod,
      change
    } = this.props;
    dispatch(change("enableSmartPurchase", false));

    const ticketUnitary = true;

    if (discountValue) {
      dispatch(fetchPromocodeClear());
      return;
    }
    if (!creditValue) {
      dispatch(showToast(TOASTED_MUST_HAVE_CREDIT, toastStyles.DEFAULT));
      return;
    }
    if (!paymentMethod) {
      dispatch(
        showToast(TOASTED_MUST_HAVE_PAYMENT_METHOD, toastStyles.DEFAULT)
      );
      return;
    }

    dispatch(
      navigateToRoute(routeNames.PROMOCODE_MODAL, {
        creditValue,
        ticketUnitary
      })
    );
  };

  onPaymentMethodChange = paymentMethod => {
    const {
      navigation: { dispatch }
    } = this.props;

    if (
      paymentMethod &&
      paymentMethod.isTemporaryCard &&
      !paymentMethod.saveCreditCard
    ) {
      dispatch(change(reduxFormName, "enableSmartPurchase", false));
    }
  };

  getPaymentInfo = formData => {
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

    return {
      productType: productTypes.TICKET_UNITY,
      rechargeValue: Number(creditValue) * 100,
      scheduledDay: enableSmartPurchase ? scheduledDay : null,
      paymentCardType: paymentCardTypes.CREDIT,
      paymentMethodId: !isTemporaryCard ? id : null,
      creditCardNumber: cardNumber || null,
      creditCardExpirationDate: expirationDate || null,
      creditCardBrand: cardFlag || null,
      cardToken: cardToken || null,
      saveCreditCard: saveCreditCard || null,
      creditCardHolder: cardHolder || null
    };
  };

  submit = () => {
    const { handleSubmit, valid } = this.props;
    Keyboard.dismiss();

    if (valid) {
      handleSubmit(this.onSubmit)();
    }
  };

  onSubmit = formData => {
    const {
      loggedUser,
      valid,
      promocodeResponse,
      selectedPaymentMethod,
      dispatch,
      navigation: {
        state: {
          params: { type }
        }
      }
    } = this.props;

    if (valid) {
      const paymentData = this.getPaymentInfo(formData);
      const cardFlag =
        selectedPaymentMethod.items && selectedPaymentMethod.items.cardFlag;
      const purchaseTicketUnitary = {
        isPurchaseTicket: true,
        type
      };
      const promocode = promocodeResponse.data
        ? {
            code: promocodeResponse.data.code,
            rechargeValue: paymentData.rechargeValue / 100,
            idCustomer: loggedUser.id,
            brandcard: cardFlag
          }
        : {};

      dispatch(
        navigateToRoute(routeNames.PURCHASE_CONFIRMATION_DIALOG, {
          paymentData,
          smartPurchaseFlow: false,
          promocode,
          purchaseTicketUnitary
        })
      );
    }
  };

  render() {
    const {
      navigation: {
        state: {
          params: { type }
        }
      },
      creditValue,
      valid,
      discountValue,
      payment: { isFetching }
    } = this.props;

    const creditValueFieldLabel = "Valor da compra";
    // const isValid = creditValue > 0;
    return (
      <View style={styles.container}>
        <Header
          title="Comprar bilhete QR Code"
          left={{
            type: headerActionTypes.BACK,
            onPress: this.back
          }}
        />
        {isFetching && <LoadMask />}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
        >
          <View style={{ marginBottom: 10 }}>
            <PurchaseCardView type={type} value="4,30" />
          </View>

          {/* <View style={styles.containerButton}>
            <CreditValue name="creditValueTicketUnity" reduxFormName={reduxFormName} />
          </View> */}
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end"
            }}
          >
            {/* <Field
              name="discountValue"
              props={{
                reduxFormName,
                discountValue,
                onPress: this.onPressDiscountValue,
              }}
              component={PromocodeField}
            /> */}
            <Field
              name="paymentMethod"
              props={{
                reduxFormName,
                purchaseFlow: false,
                backRouteName: routeNames.BUY_CREDIT,
                ticketUnitary: true
              }}
              onChange={this.onPaymentMethodChange}
              component={PaymentMethodField}
              validate={[required]}
            />
            <BuySummary
              rechargeValue={creditValue}
              creditValueLabel={creditValueFieldLabel}
              discountValue={discountValue}
              discountLabel={discountLabel}
              valid={valid}
              showSubmitButton={valid}
              smartPurchaseFlow={false}
              submit={this.submit}
              isTicketUnitary
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

// Redux
const mapStateToProps = state => {
  return {
    initialValues: {
      creditValue: 0,
      paymentMethod: null
    },
    creditValue: formValueSelector(reduxFormName)(state, "creditValue"),
    discountValue: formValueSelector(reduxFormName)(state, "discountValue"),
    paymentMethod: formValueSelector(reduxFormName)(state, "paymentMethod"),
    promocodeResponse: getPromocodeResponse(state),
    selectedPaymentMethod: getSelectedPaymentMethod(state),
    loggedUser: getLoggedUser(state),
    payment: state.paymentMethod.saved
  };
};

export const PurchaseTicket = connect(mapStateToProps)(
  reduxForm({ form: reduxFormName, destroyOnUnmount: false })(
    PurchaseTicketView
  )
);
