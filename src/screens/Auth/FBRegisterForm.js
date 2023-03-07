// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { Keyboard, StyleSheet, View } from 'react-native';

// VouD imports
import Button from '../../components/Button';
import BrandText from '../../components/BrandText';
import TextField from '../../components/TextField';
import MessageBox from '../../components/MessageBox';
import CheckBoxField from '../../components/CheckBoxField';
import TouchableText from '../../components/TouchableText';
import FBProfileBox from './FBProfileBox';
import {
  formatCpf,
  parseMobile,
  formatMobile,
  formatExcludeNumbers,
  parseExcludeNumbers,
  formatCep,
  parseCep,
  formatDate,
  parseDate,
  formatNumeric,
  parseNumeric,
} from '../../utils/parsers-formaters';
import FadeInView from '../../components/FadeInView';
import { registerClear } from '../../redux/register';

import fetchViaCepService from '../../utils/via_cpf';

import {
  required,
  mobileValidator,
  minPasswordLength,
  maxPasswordLength,
  confirmPassword,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  cepValidator,
  createBirthDateValidator,
} from '../../utils/validators';
import { colors } from '../../styles/constants';
import UsageTerms from '../../components/UsageTerms';
import { navigateToRoute } from '../../redux/nav';
import { routeNames } from '../../shared/route-names';
import { clearReduxForm } from '../../utils/redux-form-util';

const reduxFormName = 'fbRegister';

// component
class FBRegisterForm extends Component {
  componentWillMount() {
    this._birthDateValidator = createBirthDateValidator('DDMMYYYY');
  }

  componentWillUnmount() {
    this.props.dispatch(registerClear());
    clearReduxForm(this.props.dispatch, reduxFormName);
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
            supplement,
          },
        });
      })();
  };

  _onSubmitEditZipCode = () => {
    this.Address.focus();
  };

  _onChangeZipCode = value => {
    const { change } = this.props;
    if (value.length == 9) {
      const promise = fetchViaCepService(value.replace('-', ''));
      promise.then(data => {
        change('state', data.state);
        change('city', data.city);
        change('district', data.neighborhood);
        change('main', data.street);
      });
    }
  };

  render() {
    const {
      style,
      ui,
      valid,
      fbData: { name, lastName, email },
      cpf,
      onChangeCpf,
    } = this.props;

    return (
      <FadeInView style={style}>
        <BrandText style={styles.title}>Conectar Facebook</BrandText>
        <BrandText style={styles.infoText}>
          Precisamos de mais alguns dados para que você possa acessar o VouD.
        </BrandText>
        <FBProfileBox style={styles.profileBox} name={name} lastName={lastName} email={email} />

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
            textFieldRef: el => (this.BirthDateField = el),
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
              textFieldRef: el => (this.ZipCode = el),
              style: styles.dualFieldRowFirstField,
              isPrimary: true,
              label: 'CEP',
              keyboardType: 'numeric',
              returnKeyType: 'next',
              maxLength: 9,
              onSubmitEditing: this._onSubmitEditZipCode,
            }}
            onChange={this._onChangeZipCode}
            format={formatCep}
            parse={parseCep}
            component={TextField}
            validate={[cepValidator]}
          />
          <View style={styles.dualFieldRowLastField} />
        </View>

        <Field
          name="main"
          props={{
            textFieldRef: el => (this.Address = el),
            isPrimary: true,
            label: 'Endereço (sem número)',
            returnKeyType: 'next',
            onSubmitEditing: e => {
              this.AddressNumber.focus();
            },
          }}
          format={formatExcludeNumbers}
          parse={parseExcludeNumbers}
          component={TextField}
        />

        <View style={styles.dualFieldRowContainer}>
          <Field
            name="number"
            props={{
              textFieldRef: el => (this.AddressNumber = el),
              style: styles.dualFieldRowFirstField,
              isPrimary: true,
              label: 'Número',
              keyboardType: 'numeric',
              returnKeyType: 'next',
              onSubmitEditing: e => {
                this.Supplement.focus();
              },
            }}
            format={formatNumeric}
            parse={parseNumeric}
            component={TextField}
          />

          <Field
            name="supplement"
            props={{
              textFieldRef: el => (this.Supplement = el),
              style: styles.dualFieldRowLastField,
              isPrimary: true,
              label: 'Complemento',
              returnKeyType: 'next',
              onSubmitEditing: e => {
                this.DistrictField.focus();
              },
            }}
            component={TextField}
          />
        </View>

        <Field
          name="district"
          props={{
            textFieldRef: el => (this.DistrictField = el),
            isPrimary: true,
            label: 'Bairro',
            returnKeyType: 'next',
            onSubmitEditing: e => {
              this.State.focus();
            },
          }}
          component={TextField}
        />

        <View style={styles.dualFieldRowContainer}>
          <Field
            name="state"
            props={{
              textFieldRef: el => (this.State = el),
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
              onSubmitEditing: e => {
                this.City.focus();
              },
            }}
            component={TextField}
          />

          <Field
            name="city"
            props={{
              textFieldRef: el => (this.City = el),
              style: styles.dualFieldRowLastField,
              isPrimary: true,
              label: 'Cidade',
              returnKeyType: 'next',
              onSubmitEditing: e => {
                this.MobileField.focus();
              },
            }}
            format={formatExcludeNumbers}
            parse={parseExcludeNumbers}
            component={TextField}
          />
        </View>

        <Field
          name="mobile"
          props={{
            textFieldRef: el => (this.MobileField = el),
            isPrimary: true,
            label: 'Celular (com ddd)*',
            placeholder: '(00) 9999 9999',
            keyboardType: 'phone-pad',
            returnKeyType: 'next',
            maxLength: 16,
            onSubmitEditing: e => this.PasswordField.focus(),
          }}
          component={TextField}
          parse={parseMobile}
          format={formatMobile}
          validate={[required, mobileValidator]}
        />
        <Field
          name="password"
          props={{
            textFieldRef: el => (this.PasswordField = el),
            isPrimary: true,
            label: 'Senha*',
            returnKeyType: 'next',
            secureTextEntry: true,
            minLength: MIN_PASSWORD_LENGTH,
            maxLength: MAX_PASSWORD_LENGTH,
            onSubmitEditing: e => this.PasswordConfirmationField.focus(),
          }}
          helperText={`Escolha uma senha com no mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
          component={TextField}
          validate={[required, minPasswordLength, maxPasswordLength]}
        />
        <Field
          name="passwordConfirmation"
          props={{
            textFieldRef: el => (this.PasswordConfirmationField = el),
            isPrimary: true,
            label: 'Confirmação de senha*',
            secureTextEntry: true,
            minLength: MIN_PASSWORD_LENGTH,
            maxLength: MAX_PASSWORD_LENGTH,
            onSubmitEditing: () => Keyboard.dismiss(),
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
            isLight: true,
          }}
          component={CheckBoxField}
        />
        <UsageTerms />
        {ui.error ? <MessageBox message={ui.error} style={styles.errorMessage} /> : null}
        <Button onPress={this._submit} style={styles.button} disabled={!valid || ui.isFetching}>
          Cadastrar
        </Button>
        <TouchableText
          onPress={onChangeCpf}
          style={styles.wrongCPF}
          textStyle={styles.wrongCPFText}
          useSysFont
        >
          CPF {formatCpf(cpf)}. <BrandText style={styles.hyperlink}>Alterar CPF?</BrandText>
        </TouchableText>
      </FadeInView>
    );
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
  infoText: {
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 20,
    color: 'white',
  },
  errorMessage: {
    marginTop: 16,
  },
  button: {
    marginTop: 24,
  },
  profileBox: {
    marginBottom: 16,
  },
  hyperlink: {
    color: colors.BRAND_SECONDARY,
  },
  checkCPFContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  cpfText: {
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 20,
    color: 'white',
  },
  checkbox: {
    marginVertical: 24,
  },
  wrongCPF: {
    marginTop: 24,
  },
  wrongCPFText: {
    textAlign: 'center',
    color: 'white',
  },
  dualFieldRowContainer: {
    flexDirection: 'row',
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
  },
});

// Redux
const mapStateToProps = state => {
  return {
    initialValues: {
      cpf: state.profile.data.cpf,
    },
    fbData: state.facebook.login.data,
    cpf: formValueSelector(reduxFormName)(state, 'cpf'),
  };
};

export default connect(mapStateToProps)(
  reduxForm({ form: reduxFormName, destroyOnUnmount: false })(FBRegisterForm)
);
