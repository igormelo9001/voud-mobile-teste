// NPM imports
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';

import { reduxForm, Field, formValueSelector } from 'redux-form';

import { StyleSheet, View, Keyboard } from 'react-native';

// VouD imports
import { colors } from '../../../styles';
import { required } from '../../../utils/validators';
import { calculateTaxClear, productTypes } from '../../../redux/financial';
import {
  getCreditValueRange,
  getHasCurrentTransportCardActiveSmartPurchase,
  getPromocodeResponse,
} from '../../../redux/selectors';

import { fetchPromocodeClear } from '../../../redux/promo-code';

import BuySummary from '../../PaymentCheckout/BuySummary';

import { getDefaultCreditValueFieldLabel } from '../../../utils/transport-card';
import CreditValueField from './CreditValueField';
import PaymentMethodField from './PaymentMethodField';
import ScheduledDayField from './ScheduledDayField';
import SmartPurchaseCheckboxField from './SmartPurchaseCheckboxField';
import { routeNames } from '../../../shared/route-names';
import { clearReduxForm } from '../../../utils/redux-form-util';

import { navigateToRoute } from '../../../redux/nav';

import { showToast, toastStyles } from '../../../redux/toast';

import PromocodeField from './PromocodeField';

// consts
const reduxFormName = 'bomPurchaseForm';
const discountLabel = 'Desconto';
const TOASTED_MUST_HAVE_CREDIT = 'Favor selecionar o valor da recarga.';
const TOASTED_MUST_HAVE_PAYMENT_METHOD = 'Favor selecionar forma de pagamento.';

// Component
class BOMPurchaseForm extends Component {
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
      dispatch(change('discountValue', discountValue));
    } else {
      dispatch(change('discountValue', null));
    }
  }

  _onPaymentMethodChange = paymentMethod => {
    if (paymentMethod && paymentMethod.isTemporaryCard && !paymentMethod.saveCreditCard) {
      this.props.dispatch(change(reduxFormName, 'enableSmartPurchase', false));
    }
  };

  _submit = () => {
    const { handleSubmit, onSubmit, valid } = this.props;
    Keyboard.dismiss();

    if (valid) {
      handleSubmit(onSubmit)();
    }
  };

  _onPressDiscountValue = () => {
    const { dispatch, creditValue, discountValue, paymentMethod, change } = this.props;
    dispatch(change('enableSmartPurchase', false));

    if (discountValue) {
      dispatch(fetchPromocodeClear());
      return;
    } if (!creditValue) {
      dispatch(showToast(TOASTED_MUST_HAVE_CREDIT, toastStyles.DEFAULT));
      return;
    } if (!paymentMethod) {
      dispatch(showToast(TOASTED_MUST_HAVE_PAYMENT_METHOD, toastStyles.DEFAULT));
      return;
    }

    dispatch(navigateToRoute(routeNames.PROMOCODE_MODAL));
  };

  render() {
    const {
      cardData,
      creditValue,
      valid,
      style,
      enableSmartPurchase,
      paymentMethod,
      hasSmartPurchase,
      smartPurchaseFlow,
      editSmartPurchase,
      onShowLastSmartPurchaseFireAlert,
      discountValue,
    } = this.props;

    const creditValueFieldLabel = getDefaultCreditValueFieldLabel(cardData.layoutType);

    return (
      <View style={style}>
        <View style={styles.fields}>
          <View style={styles.creditSelectionContainer}>
            <CreditValueField
              name="creditValue"
              reduxFormName={reduxFormName}
              cardData={cardData}
            />
          </View>
          <Field
            name="discountValue"
            props={{
              reduxFormName,
              discountValue,
              onPress: this._onPressDiscountValue,
            }}
            component={PromocodeField}
          />
          {smartPurchaseFlow && (
            <Field
              name="scheduledDay"
              props={{
                style: styles.scheduledDayFieldWithBorder,
                onShowLastSmartPurchaseFireAlert,
                editSmartPurchase,
              }}
              component={ScheduledDayField}
              validate={[required]}
            />
          )}
          <Field
            name="paymentMethod"
            props={{
              reduxFormName,
              purchaseFlow: !smartPurchaseFlow,
              backRouteName: routeNames.BUY_CREDIT,
            }}
            onChange={this._onPaymentMethodChange}
            component={PaymentMethodField}
            validate={[required]}
          />
          {!smartPurchaseFlow && !hasSmartPurchase && !discountValue && paymentMethod && (
            <Fragment>
              <Field
                name="enableSmartPurchase"
                props={{
                  cardData,
                }}
                component={SmartPurchaseCheckboxField}
              />
              {enableSmartPurchase && (
                <Field
                  name="scheduledDay"
                  props={{
                    style: styles.scheduledDayField,
                  }}
                  component={ScheduledDayField}
                />
              )}
            </Fragment>
          )}
        </View>
        <BuySummary
          rechargeValue={creditValue}
          creditValueLabel={creditValueFieldLabel}
          discountValue={discountValue}
          discountLabel={discountLabel}
          valid={valid}
          productType={productTypes.BOM}
          showSubmitButton={valid}
          smartPurchaseFlow={smartPurchaseFlow}
          submit={this._submit}
        />
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  fields: {
    flexGrow: 1,
  },
  addCreditBtnContainer: {
    flexDirection: 'row',
  },
  addCreditBtn: {
    flex: 1,
    marginRight: 8,
  },
  setCreditBtn: {
    flex: 1,
    marginBottom: 8,
  },
  setCreditInfo: {
    fontSize: 14,
    color: colors.GRAY,
  },
  temporalFieldGroup: {
    marginTop: 16,
  },
  creditSelectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  scheduledDayField: {
    marginTop: 16,
  },
  scheduledDayFieldWithBorder: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: colors.GRAY_LIGHTER,
  },
});

// Redux
const mapStateToProps = (state, ownProps) => {
  const { editSmartPurchase, smartPurchaseFlow } = ownProps;
  return {
    initialValues: {
      creditValue: editSmartPurchase ? editSmartPurchase.rechargeValue * 100 : 0,
      paymentMethod: null,
      scheduledDay: editSmartPurchase ? editSmartPurchase.scheduledDay : null,
      enableSmartPurchase: !!smartPurchaseFlow,
    },
    creditValue: formValueSelector(reduxFormName)(state, 'creditValue'),
    discountValue: formValueSelector(reduxFormName)(state, 'discountValue'),
    enableSmartPurchase: formValueSelector(reduxFormName)(state, 'enableSmartPurchase'),
    paymentMethod: formValueSelector(reduxFormName)(state, 'paymentMethod'),
    creditValueRange: getCreditValueRange(state),
    hasSmartPurchase: getHasCurrentTransportCardActiveSmartPurchase(state),
    promocodeResponse: getPromocodeResponse(state),
  };
};

export default connect(mapStateToProps)(
  reduxForm({ form: reduxFormName, destroyOnUnmount: false })(BOMPurchaseForm)
);
