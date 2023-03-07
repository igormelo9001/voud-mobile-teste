// NPM imports
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Image,
  Keyboard,
  View,
  StyleSheet
} from 'react-native';

import {
  reduxForm,
  formValueSelector,
  Field
} from 'redux-form';

// VouD imports
import Button from '../../../components/Button';
import MessageBox from '../../../components/MessageBox';
import TextField from '../../../components/TextField';
import { colors } from '../../../styles';
import {
  formatAlphabetic,
  formatExpirationDate,
  parseExpirationDate,
  createCreditCardNumberFormater,
  createCreditCardNumberParser,
  parseAlphabetic,
  formatNumeric,
  parseNumeric,
} from '../../../utils/parsers-formaters';
import {
  required,
  creditCardNumberValidator,
  creditCardExpirationDateValidator,
  createCardBrandValidator,
} from '../../../utils/validators';
import { getPaymentCardBrandPattern } from '../../../redux/selectors';
import PaymentCardNumberField from '../../../components/PaymentCardNumberField';
import BrandText from '../../../components/BrandText';
import CheckBoxField from '../../../components/CheckBoxField';


// Component const
export const reduxFormName = 'addPaymentMethod';
const cardBrandFieldName = 'creditCardBrand';
const securityCodeHelper = require('../../../images/security-code-helper.png');

// Screen component
const propTypes = {
  onSubmit: PropTypes.func.isRequired,
  ui: PropTypes.object.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

const defaultProps = {
  style: {},
};

export class AddPaymentMethodFormView extends Component {

  componentWillMount() {
    const { paymentCardBrandPattern } = this.props;
    this._cardBrandValidator = createCardBrandValidator(paymentCardBrandPattern);
    this._formatCreditCardNumber = createCreditCardNumberFormater(paymentCardBrandPattern);
    this._parseCreditCardNumber = createCreditCardNumberParser(paymentCardBrandPattern);
  }

  _submit = () => {
    const { valid, ui, handleSubmit, onSubmit } = this.props;

    Keyboard.dismiss();

    if (valid && !ui.isFetching)
      handleSubmit(onSubmit)();
  };

  render() {
    const { creditCardBrand, ui, valid, style, purchaseFlow, saveCreditCard, paymentScoo } = this.props;
    let isScooCardBrand = false;
    if(paymentScoo){
      if(creditCardBrand && creditCardBrand !== "master" && creditCardBrand !== "visa"){
         isScooCardBrand = true;
      }
    }

    return (
      <Fragment>
        <View style={StyleSheet.flatten([styles.container, style])}>
          <Field
            name='creditCardNumber'
            props={{
              textFieldRef: el => this.CreditPaymentCardNumberField = el,
              label: 'Número do cartão de crédito',
              isPrimary: false,
              keyboardType: 'numeric',
              returnKeyType: 'next',
              cardBrand: creditCardBrand,
              reduxFormName,
              cardBrandFieldName,
              onSubmitEditing: () => {
                this.CreditCardExpirationDateField.focus();
              }
            }}
            format={this._formatCreditCardNumber}
            parse={this._parseCreditCardNumber}
            component={PaymentCardNumberField}
            validate={[required, this._cardBrandValidator, creditCardNumberValidator]}
          />
          <View style={styles.securityInfoContainer}>
            <View style={styles.creditCardExpirationDateField}>
              <Field
                name='creditCardExpirationDate'
                props={{
                  textFieldRef: el => this.CreditCardExpirationDateField = el,
                  label: 'Validade',
                  isPrimary: false,
                  maxLength: 7,
                  keyboardType: 'numeric',
                  returnKeyType: 'next',
                  onSubmitEditing: () => {
                    this.CreditCardSecurityCode.focus();
                  }
                }}
                format={formatExpirationDate}
                parse={parseExpirationDate}
                component={TextField}
                validate={[required, creditCardExpirationDateValidator]}
              />
            </View>
            <View style={styles.creditCardSecurityCodeField}>
              <Field
                name='creditCardSecurityCode'
                props={{
                  textFieldRef: el => this.CreditCardSecurityCode = el,
                  label: 'Cód. Segurança',
                  helperText: 'Últimos dígitos no verso do cartão',
                  isPrimary: false,
                  maxLength: 4,
                  keyboardType: 'numeric',
                  returnKeyType:  saveCreditCard ? 'next' : 'default',
                  onSubmitEditing: () => {
                    this.CardHolderField && this.CardHolderField.focus();
                  },
                  right: () =>
                    <Image style={styles.securityCodeHelper} source={securityCodeHelper} />
                }}
                format={formatNumeric}
                parse={parseNumeric}
                component={TextField}
                validate={[required]}
              />
            </View>
          </View>
          <Field
            name='creditCardHolder'
            props={{
              textFieldRef: el => this.CardHolderField = el,
              label: 'Nome impresso no cartão',
              isPrimary: false,
              maxLength: 50,
              onSubmitEditing: () => { Keyboard.dismiss(); },
            }}
            format={formatAlphabetic}
            parse={parseAlphabetic}
            validate={required}
            component={TextField}
          />
          {
            purchaseFlow &&
              <Field
                name='saveCreditCard'
                props={{
                  text: 'Salvar seu cartão de crédito para facilitar pagamentos futuros',
                  style: styles.saveCreditCardCheckbox
                }}
                component={CheckBoxField}
              />
          }
          {
            ui.error ? (
              <MessageBox
                message={ui.error}
                style={styles.errorMessage}
              />
            ) : null
          }
          {isScooCardBrand &&
            <MessageBox
            message={`Bandeiras aceitas: Visa e Master`}
            style={styles.errorMessage}
          />
          }
          <Button
            style={styles.submitButton}
            disabled={
              !valid ||
              ui.isFetching ||
              isScooCardBrand
            }
            onPress={this._submit}
          >
            { purchaseFlow ?
                'Usar este cartão' : 'Salvar forma de pagamento'
            }
          </Button>
        </View>
        {
          (!purchaseFlow) &&
            <View style={styles.ghostTransaction}>
              <BrandText style={styles.ghostTransactionText}>Para sua segurança, poderá ser feita uma pré-autorização de R$ 1,00 e o estorno em seguida. O valor não será cobrado em sua fatura.</BrandText>
            </View>
        }
      </Fragment>
    );
  }
}

AddPaymentMethodFormView.propTypes = propTypes;
AddPaymentMethodFormView.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  creditCardBrandButtons: {
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  paymentMethodLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.GRAY,
    marginBottom: 16,
  },
  securityInfoContainer: {
    flexDirection: 'row'
  },
  creditCardExpirationDateField: {
    flex: 3
  },
  creditCardSecurityCodeField: {
    flex: 5,
    marginLeft: 16
  },
  securityCodeHelper: {
    alignSelf: 'center',
    marginTop: -8
  },
  errorMessage: {
    marginTop: 16
  },
  submitButton: {
    marginTop: 24
  },
  ghostTransaction: {
    paddingHorizontal: 16,
  },
  ghostTransactionImage: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  ghostTransactionText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.GRAY,
  },
  saveCreditCardCheckbox: {
    marginTop: 24
  }
});

const mapStateToProps = (state, { purchaseFlow, editPaymentMethod }) => ({
  initialValues: {
    [cardBrandFieldName]: editPaymentMethod ? editPaymentMethod.items.cardFlag : '',
    creditCardHolder: editPaymentMethod ? editPaymentMethod.items.cardHolder : '',
    creditCardNumber: editPaymentMethod ? editPaymentMethod.items.cardNumber : '',
    creditCardExpirationDate: editPaymentMethod ? editPaymentMethod.items.expirationDate : '',
    creditCardSecurityCode: editPaymentMethod ? editPaymentMethod.items.securityCode : '',
    saveCreditCard: purchaseFlow ? false : true
  },
  [cardBrandFieldName]: formValueSelector(reduxFormName)(state, cardBrandFieldName),
  saveCreditCard: formValueSelector(reduxFormName)(state, 'saveCreditCard'),
  paymentCardBrandPattern: getPaymentCardBrandPattern(state),
});

export const AddPaymentMethodForm = connect(mapStateToProps)(reduxForm({ form: reduxFormName })(AddPaymentMethodFormView));
