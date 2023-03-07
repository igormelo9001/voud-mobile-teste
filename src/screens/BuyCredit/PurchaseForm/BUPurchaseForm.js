// NPM imports
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { reduxForm, Field, formValueSelector, change } from "redux-form";

import {
  StyleSheet,
  View,
  Keyboard,
  Alert,
  TouchableNative
} from "react-native";

// VouD imports
import { colors } from "../../../styles";
import { required } from "../../../utils/validators";
import { calculateTaxClear, productTypes } from "../../../redux/financial";
import {
  getBUSupportedCreditTypesSelector,
  getHasCurrentTransportCardActiveSmartPurchase,
  getEditTransportCardUI,
  getLoggedUser,
  getSelectedPaymentMethod,
  getPromocodeResponse
} from "../../../redux/selectors";

import { fetchPromocodeClear } from "../../../redux/promo-code";

import BuySummary from "../../PaymentCheckout/BuySummary";

import {
  buCreditTypeLabels,
  findBUTemporalProduct,
  findBUProduct,
  getBUCreditTypeLabel,
  getBUPeriodTypeLabel,
  getBUTransportTypeLabel,
  getCreditValueFieldLabel
} from "../../../utils/transport-card";
import SelectionButtonsField from "../../../components/SelectionButtonsField";
import CreditValueField from "./CreditValueField";
import BUTemporalProductFieldGroup from "./BUTemporalProductFieldGroup";
import PaymentMethodField from "./PaymentMethodField";
import ScheduledDayField from "./ScheduledDayField";
import SmartPurchaseCheckboxField from "./SmartPurchaseCheckboxField";

import BrandText from "../../../components/BrandText";
import MessageBox from "../../../components/MessageBox";
import TouchableText from "../../../components/TouchableText";
import { fetchRemoveCard } from "../../../redux/transport-card";
import { insufficientQuotaErrorHandler } from "../../../shared/insufficient-quota";
import { showSmartPurchaseUnavailableForEscolar } from "../../../utils/smart-purchase-util";
import { routeNames } from "../../../shared/route-names";
import { clearReduxForm } from "../../../utils/redux-form-util";

import { navigateToRoute } from "../../../redux/nav";
import { showToast, toastStyles } from "../../../redux/toast";

import PromocodeField from "./PromocodeField";

// consts
const reduxFormName = "buPurchaseForm";
const discountLabel = "Desconto";
const TOASTED_MUST_HAVE_CREDIT = "Favor selecionar o valor da recarga.";

// Component
class BUPurchaseForm extends Component {
  constructor(props) {
    super(props);
    this.promoCode = null;
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(calculateTaxClear());
    clearReduxForm(dispatch, reduxFormName);
    dispatch(fetchPromocodeClear());
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

  _submit = values => {
    const { handleSubmit, onSubmit, valid } = this.props;
    Keyboard.dismiss();
    if (valid) {
      handleSubmit(onSubmit)();
    }
  };

  _getCreditTypeOptions = () => {
    this.props.buSupportedCreditTypes &&
    this.props.buSupportedCreditTypes.map(buCreditType => ({
      label: buCreditType,
      value: buCreditType
    }));
  }

  _onCreditTypeChange = buCreditType => {
    const { dispatch } = this.props;

    dispatch(fetchPromocodeClear());

    dispatch(change(reduxFormName, "creditValue", 0));

    if (buCreditType === buCreditTypeLabels.TEMPORAL) {
      dispatch(change(reduxFormName, "periodType", ""));
      dispatch(change(reduxFormName, "transportType", ""));
      dispatch(change(reduxFormName, "quotaQty", 0));
    }

    if (buCreditType === buCreditTypeLabels.ESCOLAR) {
      dispatch(change(reduxFormName, "enableSmartPurchase", false));
    }
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(calculateTaxClear());
    clearReduxForm(dispatch, reduxFormName);
  }

  _submit = () => {
    const { handleSubmit, onSubmit, valid } = this.props;

    Keyboard.dismiss();

    if (valid) {
      handleSubmit(onSubmit)();
    }
  };

  _getCreditTypeOptions = () =>
    this.props.buSupportedCreditTypes &&
    this.props.buSupportedCreditTypes.map(buCreditType => ({
      label: buCreditType,
      value: buCreditType
    }));

  _onCreditTypeChange = buCreditType => {
    const { dispatch } = this.props;

    dispatch(fetchPromocodeClear());

    dispatch(change(reduxFormName, "creditValue", 0));

    if (buCreditType === buCreditTypeLabels.TEMPORAL_DIARIO) {
      dispatch(change(reduxFormName, "periodType", ""));
      dispatch(change(reduxFormName, "transportType", ""));
      dispatch(change(reduxFormName, "quotaQty", 0));
    }

    if (buCreditType === buCreditTypeLabels.TEMPORAL_MENSAL) {
      dispatch(change(reduxFormName, "periodType", ""));
      dispatch(change(reduxFormName, "transportType", ""));
      dispatch(change(reduxFormName, "quotaQty", 0));
    }

    // if (buCreditType === buCreditTypeLabels.TEMPORAL) {
    //   dispatch(change(reduxFormName, 'periodType', ''));
    //   dispatch(change(reduxFormName, 'transportType', ''));
    //   dispatch(change(reduxFormName, 'quotaQty', 0));
    // }

    if (buCreditType === buCreditTypeLabels.ESCOLAR) {
      dispatch(change(reduxFormName, "enableSmartPurchase", false));
    }
  };

  _onChangeValidation = buCreditType => {
    const { cardData, smartPurchaseFlow } = this.props;

    if (smartPurchaseFlow && buCreditType === buCreditTypeLabels.ESCOLAR) {
      showSmartPurchaseUnavailableForEscolar();
      return false;
    }

    // check if card has sufficient quota
    if (buCreditType === buCreditTypeLabels.ESCOLAR) {
      const buProduct = findBUProduct(
        cardData.wallets,
        buCreditTypeLabels.ESCOLAR
      );
      const quotaValue = buProduct ? buProduct.productMaximalQuantity : 0;
      const minBuyValue = buProduct ? buProduct.productMinimalQuantity : 0;

      if (quotaValue < minBuyValue) {
        insufficientQuotaErrorHandler(quotaValue, minBuyValue);
        return false;
      }
    }
    return true;
  };

  _onPaymentMethodChange = paymentMethod => {
    if (
      paymentMethod &&
      paymentMethod.isTemporaryCard &&
      !paymentMethod.saveCreditCard
    ) {
      this.props.dispatch(change(reduxFormName, "enableSmartPurchase", false));
    }
  };

  _removeCard = () => {
    const {
      dispatch,
      cardData: { id }
    } = this.props;
    dispatch(fetchRemoveCard(id));
  };

  _showRemoveCardAlert = () => {
    Alert.alert(
      "Remover cartão",
      "Você tem certeza que deseja remover este cartão?",
      [
        {
          text: "Cancelar",
          onPress: () => {}
        },
        {
          text: "Sim",
          onPress: this._removeCard
        }
      ]
    );
  };

  _renderErrorState = () => {
    const { removeUi } = this.props;

    return (
      <View>
        <View style={styles.errorTextContainer}>
          <BrandText style={styles.errorText}>
            Este cartão não está habilitado para compras de créditos comum,
            escolar ou temporal.{"\n\n"}
            Para mais informações, contate a SPTrans pelo número 156.
          </BrandText>
        </View>
        {removeUi.error ? (
          <MessageBox message={removeUi.error} style={styles.errorMessage} />
        ) : null}
        <TouchableText
          onPress={this._showRemoveCardAlert}
          style={styles.removeBtn}
          color={colors.CARD_VT}
        >
          Remover cartão
        </TouchableText>
      </View>
    );
  };

  _onPressDiscountValue = () => {
    const {
      dispatch,
      creditValue,
      discountValue,
      paymentMethod,
      change
    } = this.props;
    dispatch(change("enableSmartPurchase", false));

    if (discountValue) {
      dispatch(fetchPromocodeClear());
      return;
    } else if (!creditValue) {
      dispatch(showToast(TOASTED_MUST_HAVE_CREDIT, toastStyles.DEFAULT));
      return;
    } else if (!paymentMethod) {
      dispatch(
        showToast(TOASTED_MUST_HAVE_PAYMENT_METHOD, toastStyles.DEFAULT)
      );
      return;
    }

    dispatch(navigateToRoute(routeNames.PROMOCODE_MODAL));
  };

  _isTemporalActiveMonth = () => {
    const { cardDetails, buCreditType } = this.props;
    return (
      buCreditType === buCreditTypeLabels.TEMPORAL_MENSAL &&
      !cardDetails.activeMonth
    );
  };

  _renderContentPayment = () => {
    const {
      buCreditType,
      cardDetails,
      enableSmartPurchase,
      paymentMethod,
      hasSmartPurchase,
      smartPurchaseFlow,
      editSmartPurchase,
      onShowLastSmartPurchaseFireAlert,
      discountValue,
      cardData
    } = this.props;

    if (this._isTemporalActiveMonth()) {
      return;
    } else {
      return (
        <Fragment>
          {smartPurchaseFlow && (
            <Field
              name="scheduledDay"
              props={{
                style: styles.scheduledDayFieldWithBorder,
                onShowLastSmartPurchaseFireAlert,
                editSmartPurchase
              }}
              component={ScheduledDayField}
              validate={[required]}
            />
          )}
          <Field
            name="discountValue"
            props={{
              reduxFormName,
              discountValue: discountValue,
              onPress: this._onPressDiscountValue
            }}
            component={PromocodeField}
          />

          <Field
            name="paymentMethod"
            props={{
              reduxFormName,
              purchaseFlow: !smartPurchaseFlow,
              backRouteName: routeNames.BUY_CREDIT
            }}
            onChange={this._onPaymentMethodChange}
            component={PaymentMethodField}
            validate={[required]}
          />
          {!smartPurchaseFlow &&
            !hasSmartPurchase &&
            !discountValue &&
            paymentMethod && (
              <Fragment>
                <Field
                  props={{
                    buCreditType,
                    cardData
                  }}
                  name="enableSmartPurchase"
                  component={SmartPurchaseCheckboxField}
                />
                {enableSmartPurchase && (
                  <Field
                    name="scheduledDay"
                    props={{
                      style: styles.scheduledDayField
                    }}
                    component={ScheduledDayField}
                  />
                )}
              </Fragment>
            )}
        </Fragment>
      );
    }
  };

  _renderForm = () => {
    const {
      cardData,
      creditValue,
      valid,
      buCreditType,
      periodType,
      transportType,
      quotaQty,
      // enableSmartPurchase,
      // paymentMethod,
      // hasSmartPurchase,
      smartPurchaseFlow,
      // editSmartPurchase,
      // onShowLastSmartPurchaseFireAlert,
      discountValue,
      cardDetails
    } = this.props;
    const creditValueFieldLabel = getCreditValueFieldLabel(
      cardData,
      buCreditType,
      periodType,
      transportType,
      quotaQty
    );
    const isTemporal =
      buCreditType === buCreditTypeLabels.TEMPORAL_MENSAL ||
      buCreditType === buCreditTypeLabels.TEMPORAL_DIARIO;

    const selectedTemporalProduct = isTemporal
      ? findBUTemporalProduct(
          cardData.wallets,
          buCreditType,
          transportType,
          cardDetails.activeMonth
        )
      : null;

    return (
      <Fragment>
        <View style={styles.fields}>
          <View style={styles.creditSelectionContainer}>
            <Field
              name="buCreditType"
              props={{
                options: this._getCreditTypeOptions(),
                onChangeValidation: this._onChangeValidation
              }}
              onChange={this._onCreditTypeChange}
              component={SelectionButtonsField}
              validate={[required]}
            />
            {buCreditType && (
              <Fragment>
                {isTemporal ? (
                  <BUTemporalProductFieldGroup
                    style={styles.temporalFieldGroup}
                    reduxFormName={reduxFormName}
                    periodType={periodType}
                    transportType={transportType}
                    quotaQty={quotaQty}
                    selectedTemporalProduct={selectedTemporalProduct}
                    creditValue={creditValue}
                    buCreditType={buCreditType}
                    cardDetails={cardDetails}
                    isTemporal={isTemporal}
                  />
                ) : (
                  <CreditValueField
                    name="creditValue"
                    buCreditType={buCreditType}
                    reduxFormName={reduxFormName}
                    cardData={cardData}
                  />
                )}
              </Fragment>
            )}
          </View>
          {this._renderContentPayment()}
        </View>
        {!this._isTemporalActiveMonth() && (
          <BuySummary
            rechargeValue={creditValue}
            creditValueLabel={creditValueFieldLabel}
            discountValue={discountValue}
            discountLabel={discountLabel}
            valid={valid}
            productType={productTypes.BU}
            showSubmitButton={valid}
            smartPurchaseFlow={smartPurchaseFlow}
            submit={this._submit}
          />
        )}
      </Fragment>
    );
  };

  render() {
    const { style, buSupportedCreditTypes } = this.props;
    return (
      <View style={style}>
        {buSupportedCreditTypes.length === 0
          ? this._renderErrorState()
          : this._renderForm()}
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  fields: {
    flexGrow: 1
  },
  addCreditBtnContainer: {
    flexDirection: "row"
  },
  addCreditBtn: {
    flex: 1,
    marginRight: 8
  },
  setCreditBtn: {
    flex: 1,
    marginBottom: 8
  },
  setCreditInfo: {
    fontSize: 14,
    color: colors.GRAY
  },
  temporalFieldGroup: {
    marginTop: 16
  },
  creditSelectionContainer: {
    paddingTop: 8,
    paddingHorizontal: 16,
    marginBottom: 16
  },
  scheduledDayField: {
    marginTop: 16
  },
  scheduledDayFieldWithBorder: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: colors.GRAY_LIGHTER
  },
  errorTextContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: colors.GRAY_LIGHTER
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.GRAY
  },
  errorMessage: {
    marginTop: 16
  },
  removeBtn: {
    marginTop: 24
  }
});

// Redux
const mapStateToProps = (state, ownProps) => {
  const { editSmartPurchase, smartPurchaseFlow } = ownProps;
  const buProduct =
    editSmartPurchase &&
    editSmartPurchase.cardData &&
    editSmartPurchase.cardData.wallets
      ? editSmartPurchase.cardData.wallets.find(
          el => el.id === editSmartPurchase.idTransportCardWallet
        )
      : null;
  const buCreditType = formValueSelector(reduxFormName)(state, "buCreditType");

  const buSupportedCreditTypes = getBUSupportedCreditTypesSelector(state);

  const buSupportedCreditTypesFiltered = smartPurchaseFlow
    ? buSupportedCreditTypes.filter(el => el !== buCreditTypeLabels.ESCOLAR)
    : buSupportedCreditTypes;
  const initialCreditType =
    buSupportedCreditTypesFiltered.length > 0
      ? buSupportedCreditTypesFiltered[0]
      : null;

  return {
    initialValues: {
      buCreditType: buProduct
        ? getBUCreditTypeLabel(buProduct.applicationId)
        : initialCreditType,
      creditValue: editSmartPurchase
        ? editSmartPurchase.rechargeValue * 100
        : 0,
      paymentMethod: null,
      scheduledDay: editSmartPurchase ? editSmartPurchase.scheduledDay : null,
      enableSmartPurchase: smartPurchaseFlow ? true : false,
      periodType: buProduct
        ? getBUPeriodTypeLabel(buProduct.applicationId)
        : "",
      transportType: buProduct
        ? getBUTransportTypeLabel(buProduct.applicationId)
        : "",
      quotaQty: editSmartPurchase ? editSmartPurchase.productQuantity : 0
    },
    buCreditType,
    creditValue: formValueSelector(reduxFormName)(state, "creditValue"),
    enableSmartPurchase: formValueSelector(reduxFormName)(
      state,
      "enableSmartPurchase"
    ),
    paymentMethod: formValueSelector(reduxFormName)(state, "paymentMethod"),
    periodType: formValueSelector(reduxFormName)(state, "periodType"),
    transportType: formValueSelector(reduxFormName)(state, "transportType"),
    quotaQty: formValueSelector(reduxFormName)(state, "quotaQty"),
    hasSmartPurchase: getHasCurrentTransportCardActiveSmartPurchase(state),
    removeUi: getEditTransportCardUI(state),
    buSupportedCreditTypes,
    paymentMethodSelected: getSelectedPaymentMethod(state),
    promocodeResponse: getPromocodeResponse(state),
    loggedUser: getLoggedUser(state),
    discountValue: formValueSelector(reduxFormName)(state, "discountValue")
  };
};

export default connect(mapStateToProps)(
  reduxForm({ form: reduxFormName, destroyOnUnmount: false })(BUPurchaseForm)
);
