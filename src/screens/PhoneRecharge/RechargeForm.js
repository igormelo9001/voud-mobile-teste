// NPM imports
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector, change, initialize } from 'redux-form';
import {
  View,
  StyleSheet,
  Keyboard,
  Text,
} from 'react-native';

// VouD Imports
import TextField from '../../components/TextField';
import RequestFeedbackSmall from '../../components/RequestFeedbackSmall';
import { required, mobileValidator } from '../../utils/validators';
import { parseMobile, formatMobile } from '../../utils/parsers-formaters';
import { colors } from '../../styles';
import Button from '../../components/Button';
import { routeNames } from '../../shared/route-names';
import { navigateToRoute } from '../../redux/nav';
import RechargeValueList from './RechargeValueList';
import { getCarrierListUi, getCarrierValuesUi, getUserPhoneRecharge, getUserPhoneValidRecharge} from '../../redux/selectors';
import { fetchCarriers, fetchCarrierValues } from '../../redux/phone-recharge';

import { clearReduxForm } from '../../utils/redux-form-util';
import BuySummary from '../PaymentCheckout/BuySummary';
import { productTypes } from '../../redux/financial';
import PaymentMethodField from '../BuyCredit/PurchaseForm/PaymentMethodField';
import Icon from '../../components/Icon';
import TouchableNative from '../../components/TouchableNative';

export const reduxFormName = 'rechargeForm';

// Components
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  phoneIsConfirmed: PropTypes.bool.isRequired,
  activePhoneCarrier: PropTypes.string,
  phoneNumber: PropTypes.string,
}

const formInitialValues = {
  phoneNumber: '',
  phoneCarrierName: '',
  selectedValue: null,
  phoneIsConfirmed: false,
};

class RechargeForm extends Component {
  componentWillUnmount() {

    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  componentWillMount() {
    const { phoneNumber, dispatch } = this.props;
    var tel = phoneNumber.substring(3, phoneNumber.length);
    dispatch(change(reduxFormName, 'phoneNumber', tel));
    dispatch(fetchCarriers(phoneNumber))
  }

  _submit = () => {
    const { onSubmit, handleSubmit } = this.props;
    if (this._isFormComplete()) handleSubmit(onSubmit)();
  }

  _goToConfirmPhoneDialog = () => {
    Keyboard.dismiss();
    const { dispatch } = this.props;

    dispatch(navigateToRoute(routeNames.CONFIRM_PHONE_DIALOG));
  }

  _retryGetCarrierList = () => {
    const { dispatch, phoneNumber } = this.props;

    dispatch(fetchCarriers(phoneNumber))
  }

  _retryGetValuesList = () => {
    const { dispatch, phoneNumber, activePhoneCarrier } = this.props;
    const ddd = phoneNumber.substring(0, 2);

    dispatch(fetchCarrierValues(ddd, activePhoneCarrier));
  }

  _selectRechargeValue = (valueObj) => {
    const { dispatch } = this.props;

    dispatch(change(reduxFormName, 'selectedValue', valueObj));
  }

  _resetFormValues = () => {
    const { dispatch } = this.props;

    dispatch(initialize(reduxFormName, formInitialValues));
  }

  _isFormComplete = () => {
    const {
      valid,
      activePhoneCarrier,
      activeValue,
      carrierValuesUi,
      carrierListUi,
    } = this.props;
    return valid && activePhoneCarrier !== '' && activeValue && !carrierListUi.isFetching && carrierListUi.error === '' &&
      !carrierValuesUi.isFetching && carrierValuesUi.error === '';
  }

  render() {
    const {
      valid,
      phoneIsConfirmed,
      phoneNumber,
      activePhoneCarrier,
      carrierValues,
      activeValue,
      carrierValuesUi,
      carrierListUi,
    } = this.props;
    return (
      <View style={styles.rechargeForm}>
        <View style={styles.fields}>
          <Field
            name="phoneNumber"
            props={{
              textFieldRef: el => this.PhoneNumber = el,
              label: 'Digite seu DDD + Telefone',
              keyboardType: 'phone-pad',
              maxLength: 16,
              right: () => {
                return (<TouchableNative
                        onPress={() => {
                        }}>
                        <Icon
                          style={styles.resetPhoneIcon}
                          name="lock"
                          size={24}
                          color="gray"
                        />
                      </TouchableNative>)
              },
              largeField: true,
            }}
            onChange={() => {
              if (this.props.phoneIsConfirmed) {
                this._resetFormValues();
              }
            }}
            editable={false}
            component={TextField}
            parse={parseMobile}
            format={formatMobile}
            validate={[required, mobileValidator]}
          />

          <Text>Recarga disponível somente para o numero de celular do cadastro</Text>

          {/* ====================== */}
          {/* CARRIER & RECHARGE VAL */}
          {/* ====================== */}
          {
            phoneIsConfirmed &&
            <Fragment>
              {
                (carrierListUi.isFetching || carrierListUi.error !== '') &&
                <RequestFeedbackSmall
                  style={styles.carrierListRequestFeedback}
                  isFetching={carrierListUi.isFetching}
                  loadingMessage="Carregando operadoras disponíveis..."
                  error={carrierListUi.error}
                  errorMessage="Ocorreu um erro ao carregar as operadoras disponíveis"
                  onRetry={this._retryGetCarrierList}
                  isEmpty={false}
                  emptyMessage="Não foram encontradas operadoras para este DDD."
                />
              }
              {
                (!carrierListUi.isFetching && carrierListUi.error === '') &&
                <Field
                  name="phoneCarrierName"
                  props={{
                    textFieldRef: el => this.PhoneCarrierName = el,
                    label: 'Escolha a sua operadora',
                    keyboardType: 'default',
                    returnKeyType: 'next',
                    maxLength: 50,
                    onPressOverlay: () => {
                      this.props.dispatch(navigateToRoute(routeNames.PHONE_CARRIERS_LIST_DIALOG));
                    },
                    right: () => {
                      return (
                        <Icon
                          style={styles.dropDownIcon}
                          name="arrow-drop-down"
                          size={24}
                          color="black"
                        />
                      )
                    }
                  }}
                  component={TextField}
                  validate={[required]}
                />
              }

              {
                activePhoneCarrier !== '' &&
                  <RechargeValueList
                    activeValue={activeValue}
                    onSelectRechargeValue={this._selectRechargeValue}
                    style={styles.rechargeValueList}
                    valueList={carrierValues}
                    isFetching={carrierValuesUi.isFetching}
                    error={carrierValuesUi.error}
                    retryGetValuesList={this._retryGetValuesList}
                  />
              }
            </Fragment>
          }
        </View>
        {
          phoneIsConfirmed &&
            <Fragment>
              <Field
                name="paymentMethod"
                props={{
                  reduxFormName,
                  purchaseFlow: true,
                  backRouteName: routeNames.PHONE_RECHARGE,
                  disabled: !activeValue
                }}
                component={PaymentMethodField}
                validate={[required]}
              />
              <View>
                <BuySummary
                  rechargeValue={activeValue ? activeValue.custRecharge * 100 : 0}
                  creditValueLabel={'Valor da recarga de celular'}
                  valid={this._isFormComplete()}
                  productType={productTypes.PHONE_RECHARGE}
                  showSubmitButton={this._isFormComplete()}
                  submit={this._submit}
                />
              </View>
           </Fragment>
        }
        {/* ======= */}
        {/* ACTIONS */}
        {/* ======= */}
        {!phoneIsConfirmed &&
          <View style={styles.actionBtnContainer}>
            {/* ==================== */}
            {/* CONFIRM PHONE BUTTON */}
            {/* ==================== */}
            <Button
              onPress={this._goToConfirmPhoneDialog}
              disabled={!valid}
            >
              OK
            </Button>
          </View>
        }
      </View>
    )
  }
}

RechargeForm.propTypes = propTypes;

// Styles
const styles = StyleSheet.create({
  rechargeForm: {
    flexGrow: 1,
  },
  fields: {
    flexGrow: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  carrierListRequestFeedback: {
    marginTop: 16,
  },
  actionBtnContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderColor: colors.GRAY_LIGHTER,
  },
  rechargeValueList: {
    marginTop: 16,
  },
  resetPhoneIcon: {
    alignSelf: 'center',
    marginTop: 16,
    marginRight: 8
  },
  dropDownIcon: {
    color: colors.GRAY
  },
});

function mapStateToProps(state) {
  return {
    initialValues: { ...formInitialValues },
    phoneNumber: getUserPhoneRecharge(state),
    activeValue: formValueSelector(reduxFormName)(state, 'selectedValue'),
    activePhoneCarrier: formValueSelector(reduxFormName)(state, 'phoneCarrierName'),
    phoneIsConfirmed: getUserPhoneValidRecharge(state),
    carrierValues: state.phoneRecharge.carrierValues.data,
    carrierValuesUi: getCarrierValuesUi(state),
    carrierListUi: getCarrierListUi(state),
  };
}

export default connect(mapStateToProps)(reduxForm({ form: reduxFormName, destroyOnUnmount: false })(RechargeForm));
