// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import {
  Keyboard,
  StyleSheet,
  View,
} from 'react-native';

// VouD imports
import Button from '../../components/Button';
import BrandText from '../../components/BrandText';
import TextField from '../../components/TextField';
import MessageBox from '../../components/MessageBox';
import CheckBoxField from '../../components/CheckBoxField';
import TouchableText from '../../components/TouchableText';
import { colors } from '../../styles';
import FadeInView from '../../components/FadeInView';
import { registerClear } from '../../redux/register';
import {
  formatCpf,
  formatMobile,
  parseMobile,
  formatExcludeNumbers,
  parseExcludeNumbers,
  parseCep,
  formatCep,
  formatDate,
  parseDate,
  formatNumeric,
  parseNumeric,
} from '../../utils/parsers-formaters';

import fetchViaCepService from "../../utils/via_cpf";

import {
  required,
  mobileValidator,
  emailValidator,
  minPasswordLength,
  maxPasswordLength,
  confirmPassword,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  cepValidator,
  createBirthDateValidator
} from '../../utils/validators';
import UsageTerms from '../../components/UsageTerms';
import { navigateToRoute } from '../../redux/nav';
import { routeNames } from '../../shared/route-names';
import { clearReduxForm } from '../../utils/redux-form-util';


const reduxFormName = 'register';

// component
class RegisterForm extends Component {

  componentWillMount() {
    this._birthDateValidator = createBirthDateValidator('DDMMYYYY');
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(registerClear());
    clearReduxForm(dispatch, reduxFormName);
  }

  _submit = () => {
    const { handleSubmit, onSubmit, ui, valid } = this.props;

    Keyboard.dismiss();

    if (valid && !ui.isFetching)
      handleSubmit(formData => {
        const { main, number, state, city, zipCode, district, supplement } = formData;

        onSubmit({
          ...formData,
          addressFields: {
            main,
            number,
            state,
            city,
            zipCode,
            district,
            supplement
          }
        });
      })();
  };

  _onSubmitEditZipCode = () => {
    this.Address.focus();
  }

  _onChangeZipCode = (value) =>
  {
    const { change } = this.props;
    if (value.length == 9) {
      var promise = fetchViaCepService(value.replace('-',''));
      promise.then(data => {

        change('state', data.state)
        change('city', data.city)
        change('district', data.neighborhood)
        change('main', data.street)

      });

    }
  }

  render() {
    const { style, valid, ui, cpf, onChangeCpf } = this.props;

    return (
      <FadeInView style={style}>
        <BrandText style={styles.title}>
          Bem-vindo ao VouD!
        </BrandText>
        <BrandText style={styles.description}>
          Verificamos que esse é o seu primeiro acesso. Complete seu cadastro abaixo:
        </BrandText>
        <View style={styles.dualFieldRowContainer}>
          <Field
            name="name"
            props={{
              style: styles.dualFieldRowFirstField,
              isPrimary: true,
              label: 'Nome*',
              returnKeyType: 'next',
              maxLength: 20,
              onSubmitEditing: (e) => {
                this.LastNameField.focus();
              }
            }}
            format={formatExcludeNumbers}
            parse={parseExcludeNumbers}
            component={TextField}
            validate={required}
          />
          <Field
            name="lastName"
            props={{
              style: styles.dualFieldRowLastField,
              textFieldRef: el => this.LastNameField = el,
              isPrimary: true,
              label: 'Sobrenome*',
              returnKeyType: 'next',
              maxLength: 60,
              onSubmitEditing: (e) => {
                this.MotherName.focus();
              }
            }}
            format={formatExcludeNumbers}
            parse={parseExcludeNumbers}
            component={TextField}
            validate={required}
          />
        </View>
        {/* <Field
          name="motherName"
          props={{
            textFieldRef: el => this.MotherName = el,
            isPrimary: true,
            label: 'Nome da mãe',
            returnKeyType: 'next',
            onSubmitEditing: (e) => {
              this.BirthDateField.focus();
            }
          }}
          format={formatExcludeNumbers}
          parse={parseExcludeNumbers}
          component={TextField}
        /> */}
        <Field
          name="birthDate"
          props={{
            placeholder: 'dd/mm/aaaa',
            keyboardType: 'numeric',
            textFieldRef: el => this.BirthDateField = el,
            isPrimary: true,
            label: 'Data de nascimento*',
            returnKeyType: 'next',
            maxLength: 10,
            onSubmitEditing: () => {
              this.ZipCode.focus();
            },
          }}
          format={formatDate}
          parse={parseDate}
          component={TextField}
          validate={[required, this._birthDateValidator]}
        />
        <View style={styles.dualFieldRowContainer}>
          <Field
            name="zipCode"
            props={{
              textFieldRef: el => this.ZipCode = el,
              style: styles.dualFieldRowFirstField,
              isPrimary: true,
              label: 'CEP',
              keyboardType: 'numeric',
              returnKeyType: 'next',
              maxLength: 9,
              onSubmitEditing: this._onSubmitEditZipCode
            }}
            format={formatCep}
            onChange={this._onChangeZipCode}
            parse={parseCep}
            component={TextField}
            validate={[cepValidator]}
          />
          <View style={styles.dualFieldRowLastField} />
        </View>
        <Field
          name="main"
          props={{
            textFieldRef: el => this.Address = el,
            isPrimary: true,
            label: 'Endereço (sem número)',
            returnKeyType: 'next',
            onSubmitEditing: (e) => {
              this.AddressNumber.focus();
            }
          }}
          format={formatExcludeNumbers}
          parse={parseExcludeNumbers}
          component={TextField}
        />
        <View style={styles.dualFieldRowContainer}>
          <Field
            name="number"
            props={{
              textFieldRef: el => this.AddressNumber = el,
              style: styles.dualFieldRowFirstField,
              isPrimary: true,
              label: 'Número',
              keyboardType: 'numeric',
              returnKeyType: 'next',
              onSubmitEditing: (e) => {
                this.Supplement.focus();
              }
            }}
            format={formatNumeric}
            parse={parseNumeric}
            component={TextField}
          />
          <Field
            name="supplement"
            props={{
              textFieldRef: el => this.Supplement = el,
              style: styles.dualFieldRowLastField,
              isPrimary: true,
              label: 'Complemento',
              returnKeyType: 'next',
              onSubmitEditing: (e) => {
                this.DistrictField.focus();
              }
            }}
            component={TextField}
          />
        </View>
        <Field
          name="district"
          props={{
            textFieldRef: el => this.DistrictField = el,
            isPrimary: true,
            label: 'Bairro',
            returnKeyType: 'next',
            onSubmitEditing: (e) => {
              this.State.focus();
            }
          }}
          format={formatExcludeNumbers}
          parse={parseExcludeNumbers}
          component={TextField}
        />
        <View style={styles.dualFieldRowContainer}>
          <Field
            name="state"
            props={{
              textFieldRef: el => this.State = el,
              onPressOverlay: () => {
                this.props.dispatch(
                  navigateToRoute(routeNames.SELECT_STATE_DIALOG, { reduxFormName })
                );
              },
              style: styles.dualFieldRowFirstField,
              isPrimary: true,
              editable: false,
              label: 'Estado',
              keyboardType: 'numeric',
              returnKeyType: 'next',
              onSubmitEditing: (e) => {
                this.City.focus();
              }
            }}
            component={TextField}
          />
          <Field
            name="city"
            props={{
              textFieldRef: el => this.City = el,
              style: styles.dualFieldRowLastField,
              isPrimary: true,
              label: 'Cidade',
              returnKeyType: 'next',
              onSubmitEditing: (e) => {
                this.MobileField.focus();
              }
            }}
            format={formatExcludeNumbers}
            parse={parseExcludeNumbers}
            component={TextField}
          />
        </View>
        <Field
          name="mobile"
          props={{
            textFieldRef: el => this.MobileField = el,
            isPrimary: true,
            label: 'Celular (com ddd)*',
            placeholder: '(00) 9999 9999',
            keyboardType: 'phone-pad',
            returnKeyType: 'next',
            maxLength: 16,
            onSubmitEditing: (e) => {
              this.EmailField.focus();
            }
          }}
          component={TextField}
          parse={parseMobile}
          format={formatMobile}
          validate={[required, mobileValidator]}
        />
        <Field
          name="email"
          props={{
            textFieldRef: el => this.EmailField = el,
            isPrimary: true,
            label: 'E-mail*',
            returnKeyType: 'next',
            maxLength: 50,
            keyboardType: 'email-address',
            onSubmitEditing: (e) => {
              this.PasswordField.focus();
            }
          }}
          component={TextField}
          validate={[required, emailValidator]}
        />
        <Field
          name="password"
          props={{
            textFieldRef: el => this.PasswordField = el,
            isPrimary: true,
            label: 'Senha*',
            returnKeyType: 'next',
            secureTextEntry: true,
            minLength: MIN_PASSWORD_LENGTH,
            maxLength: MAX_PASSWORD_LENGTH,
            onSubmitEditing: (e) => {
              this.PasswordConfirmationField.focus();
            }
          }}
          helperText={`Escolha uma senha com no mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
          component={TextField}
          validate={[required, minPasswordLength, maxPasswordLength]}
        />
        <Field
          name="passwordConfirmation"
          props={{
            textFieldRef: el => this.PasswordConfirmationField = el,
            isPrimary: true,
            label: 'Confirmação de senha*',
            secureTextEntry: true,
            minLength: MIN_PASSWORD_LENGTH,
            maxLength: MAX_PASSWORD_LENGTH,
            onSubmitEditing: () => { Keyboard.dismiss(); },
          }}
          component={TextField}
          validate={[required, confirmPassword]}
        />
        <BrandText style={styles.requiredFieldsText}>
          (*) Campos com preenchimento obrigatório.
        </BrandText>
        <Field
          name="isAllowSendMail"
          props={{
            text: 'Desejo receber informações sobre as novidades do VouD por email',
            style: styles.checkbox,
            isLight: true
          }}
          component={CheckBoxField}
        />
        <UsageTerms />
        {ui.error ?
          <MessageBox
            message={ui.error}
            style={styles.errorMessage}
          /> :
          null
        }
        <Button
          onPress={this._submit}
          style={styles.button}
          disabled={!valid || ui.isFetching}
        >
          Cadastrar
        </Button>
        <TouchableText
          onPress={onChangeCpf}
          style={styles.wrongCPF}
          textStyle={styles.wrongCPFText}
          useSysFont
        >
          {`CPF ${formatCpf(cpf)}. `}
          <BrandText style={styles.hyperlink}>
            Alterar CPF?
          </BrandText>
        </TouchableText>
      </FadeInView>
    )
  }
}

// styles
const styles = StyleSheet.create({
  title: {
    marginTop: 40,
    marginBottom: 24,
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    color: 'white',
  },
  description: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: 'white',
  },
  hyperlink: {
    color: colors.BRAND_SECONDARY,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cpfInput: {
    flex: 1,
    marginRight: 16
  },
  changeCpfButton: {
    marginTop: 24
  },
  checkbox: {
    marginVertical: 24
  },
  errorMessage: {
    marginTop: 16
  },
  button: {
    marginTop: 24
  },
  wrongCPF: {
    marginTop: 24,
  },
  wrongCPFText: {
    textAlign: 'center',
    color: 'white',
  },
  dualFieldRowContainer: {
    flexDirection: 'row'
  },
  dualFieldRowFirstField: {
    flex: 1,
    marginRight: 8,
  },
  dualFieldRowLastField: {
    flex: 1,
    marginLeft: 8,
  },
  requiredFieldsText: {
    fontSize: 14,
    lineHeight: 20,
    color: 'white',
    marginTop: 16,
  }
});

// Redux
const mapStateToProps = (state) => {
  return {
    initialValues: {
      cpf: state.profile.data.cpf,
      name: '',
      password: '',
      passwordConfirmation: '',
      email: '',
      mobile: '',
      isAllowSendMail: false
    },
    cpf: state.profile.data.cpf,
  }
};

export default connect(mapStateToProps)(reduxForm({ form: reduxFormName, destroyOnUnmount: false })(RegisterForm));
