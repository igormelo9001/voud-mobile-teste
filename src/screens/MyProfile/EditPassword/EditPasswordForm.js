// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import {
  Keyboard,
  StyleSheet,
} from 'react-native';

// VouD imports
import Button from '../../../components/Button';
import BrandText from '../../../components/BrandText';
import FadeInView from '../../../components/FadeInView';
import TextField from '../../../components/TextField';
import MessageBox from '../../../components/MessageBox';
import { colors } from '../../../styles';
import {
  required,
  minPasswordLength,
  maxPasswordLength,
  confirmNewPassword,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH
} from '../../../utils/validators';
import { clearReduxForm } from '../../../utils/redux-form-util';

const reduxFormName = 'editPassword';

// component
class EditPasswordForm extends Component {

  componentWillUnmount() {
    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  _submit = () => {
    const { handleSubmit, onSubmit, ui, valid } = this.props;
    Keyboard.dismiss();

    if (valid && !ui.isFetching)
      handleSubmit(onSubmit)();
  }

  render() {
    const { style, ui, valid } = this.props;
    return (
      <FadeInView style={style}>
        <BrandText style={styles.text}>
          Utilize os campos abaixo para alterar sua senha:
        </BrandText>
        <Field
          name="password"
          props={{
            label: 'Senha atual',
            returnKeyType: 'next',
            secureTextEntry: true,
            minLength: MIN_PASSWORD_LENGTH,
            maxLength: MAX_PASSWORD_LENGTH,
            onSubmitEditing: (e) => {
              this.NewPasswordField.focus();
            }
          }}
          component={TextField}
          validate={[required]}
        />
        <Field
          name="newPassword"
          props={{
            textFieldRef: el => this.NewPasswordField = el,
            label: 'Nova senha',
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
            label: 'Confirmação da nova senha',
            secureTextEntry: true,
            minLength: MIN_PASSWORD_LENGTH,
            maxLength: MAX_PASSWORD_LENGTH,
            onSubmitEditing: () => { Keyboard.dismiss(); },
          }}
          component={TextField}
          validate={[required, confirmNewPassword]}
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
          Alterar
        </Button>
      </FadeInView>
    );
  }
}

// styles
const styles = StyleSheet.create({
  text: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    color: colors.GRAY
  },
  errorMessage: {
    marginTop: 16
  },
  button: {
    marginTop: 24
  }
});

// Redux
const mapStateToProps = (state) => {
  return {
    initialValues: {
      password: '',
      passwordConfirmation: '',
      newPassword: ''
    }
  };
};

export default connect(mapStateToProps)(reduxForm({ form: reduxFormName, destroyOnUnmount: false })(EditPasswordForm));
