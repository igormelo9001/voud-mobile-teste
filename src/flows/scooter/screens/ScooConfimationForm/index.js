// NPM imports
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';

import {
  Keyboard,
  StyleSheet,
  View,
  Image
} from 'react-native';

// VouD imports
import TextField from '../../../../components/TextField';
import { colors } from '../../../../styles';
import { required } from '../../../../utils/validators';
import SystemText from '../../../../components/SystemText';
import Button from '../../../../components/Button';
import BuySummary from '../../../../screens/PaymentCheckout/BuySummary';
import TouchableNative from '../../../../components/TouchableNative';
import BrandText from '../../../../components/BrandText';

// Component const
const reduxFormName = 'scooConfirmation';
const securityCodeHelper = require('../../../../images/security-code-helper.png');

const priceInitial = 100;

  class ScooConfirmationForm extends PureComponent {

    _submit = () => {
        Keyboard.dismiss();

        const { handleSubmit, onSubmit, valid } = this.props;
        if (valid) {
          handleSubmit(onSubmit)();
        }
      }

      _handlerBack = () => {
            this.props.onPressBack();
      }

      render() {
        const { valid } = this.props;
        return (
          <View style={styles.mainContainer}>
                <View style={styles.securityCodeFieldContainer}>
                  <SystemText style={styles.title}>
                    Código de segurança
                  </SystemText>
                  <SystemText style={styles.confirmationText}>
                      Confirme o código de segurança (CVV) escrito no verso do cartão para realizar o pagamento.
                  </SystemText>
                  <Field
                    name='creditCardSecurityCode'
                    props={{
                      label: 'Cód. Segurança',
                      isPrimary: false,
                      maxLength: 4,
                      keyboardType: 'numeric',
                      returnKeyType: 'default',
                      onSubmitEditing: () => {
                        Keyboard.dismiss();
                      },
                      right: () => <Image style={styles.securityCodeHelper} source={securityCodeHelper} />
                    }}
                    component={TextField}
                    validate={[required]}
                  />
                </View>

            <Button
              style={styles.finishButton}
              disabled={!valid}
              onPress={this._submit}
            >
                Finalizar
            </Button>
            <View style={[styles.containerButtonBack,{backgroundColor:"transparent"}]}>
              <TouchableNative
              onPress={this._handlerBack}
              >
                <BrandText style={styles.changeText}>Voltar</BrandText>
              </TouchableNative>
            </View>
          </View>
        );
      }
    }

    // Styles
    const styles = StyleSheet.create({
      mainContainer: {

      },
      securityCodeFieldContainer: {
        paddingHorizontal: 24,
        paddingTop: 16,
      },
      title: {
        fontSize: 20,
        lineHeight: 28,
        fontWeight: 'bold',
        color: colors.GRAY_DARKER,
        marginBottom: 16,
      },
      confirmationText: {
        fontSize: 16,
        lineHeight: 24,
        color: colors.GRAY
      },
      securityCodeHelper: {
        alignSelf: 'center',
        marginTop: -8
      },
      finishButton: {
        marginTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 5,
      },
      finishButtonBack: {
        marginTop: 0,
        paddingHorizontal: 24,
        paddingBottom: 24
      },
      errorMessage: {
        marginBottom: 16,
        marginHorizontal: 24
      },
      changeText: {
        color: colors.BRAND_PRIMARY,
        fontSize: 16,
        lineHeight: 20
      },
      containerButtonBack:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 15,
        marginBottom: 10,
      }
    });

    // Redux
    const mapStateToProps = state => {
      return {
        initialValues: {
          creditCardSecurityCode: '',
        },
      };
    };

    export default connect(mapStateToProps)(reduxForm({ form: reduxFormName })(ScooConfirmationForm));
