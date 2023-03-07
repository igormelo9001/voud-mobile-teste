// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import {
  Keyboard,
  StyleSheet,
} from 'react-native';

// VouD imports
import Button from '../../components/Button';
import BrandText from '../../components/BrandText';
import TextField from '../../components/TextField';
import MessageBox from '../../components/MessageBox';
import TouchableText from '../../components/TouchableText';
import { colors } from '../../styles';
import FadeInView from '../../components/FadeInView';
import { changePasswordClear } from '../../redux/login';
import { formatNumeric, parseNumeric } from '../../utils/parsers-formaters';
import {
  required,
  minPasswordLength,
  maxPasswordLength,
  confirmPassword,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH
} from '../../utils/validators';
import { clearReduxForm } from '../../utils/redux-form-util';

const reduxFormName = 'changePassword';

// Component
class ChangePasswordForm extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(changePasswordClear());
    clearReduxForm(dispatch, reduxFormName);
  }

  _submit = () => {
    const { handleSubmit, onSubmit, ui, valid } = this.props;

    Keyboard.dismiss();

    if (valid && !ui.isFetching)
      handleSubmit(onSubmit)();
  };

  render() {
    const { style, onCancel, ui, valid } = this.props;

    return (
      <FadeInView style={style}>
        <BrandText style={styles.title}>
          Redefinir senha
        </BrandText>
        <BrandText style={styles.text}>
          Informe sua nova senha abaixo:
        </BrandText>
        <Field
          name="verificationCode"
          props={{
            textFieldRef: el => this.VerificationCode = el,
            isPrimary: true,
            label: 'Código recebido',
            keyboardType: 'numeric',
            maxLength: 6,
            returnKeyType: 'next',
            fixedValue: 'V-',
            onSubmitEditing: (e) => {
              this.PasswordField.focus();
            }
          }}
          format={formatNumeric}
          parse={parseNumeric}
          component={TextField}
          validate={required}
        />
        <Field
          name="password"
          props={{
            textFieldRef: el => this.PasswordField = el,
            isPrimary: true,
            label: 'Nova senha',
            secureTextEntry: true,
            returnKeyType: 'next',
            minLength: MIN_PASSWORD_LENGTH,
            maxLength: MAX_PASSWORD_LENGTH,
            onSubmitEditing: (e) => {
              this.PasswordConfirmationField.focus();
            }
          }}
          component={TextField}
          validate={[required, minPasswordLength, maxPasswordLength]}
        />
        <Field
          name="passwordConfirmation"
          props={{
            textFieldRef: el => this.PasswordConfirmationField = el,
            isPrimary: true,
            label: 'Confirmação de senha',
            secureTextEntry: true,
            minLength: MIN_PASSWORD_LENGTH,
            maxLength: MAX_PASSWORD_LENGTH,
            onSubmitEditing: () => { Keyboard.dismiss(); },
          }}
          component={TextField}
          validate={[required, confirmPassword]}
        />
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
          Enviar
        </Button>
        <TouchableText
          onPress={onCancel}
          color={colors.BRAND_SECONDARY}
        >
          Cancelar
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
    color: 'white'
  },
  text: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: 'white'
  },
  touchableText: {
    marginBottom: 8
  },
  errorMessage: {
    marginTop: 16
  },
  button: {
    marginTop: 24,
    marginBottom: 16
  }
});

// Redux
const mapStateToProps = (state) => {
  return {
    initialValues: {
      cpf: state.profile.data.cpf,
      verificationCode: '',
      password: '',
      passwordConfirmation: ''
    }
  };
};

export default connect(mapStateToProps)(reduxForm({ form: reduxFormName, destroyOnUnmount: false })(ChangePasswordForm));
