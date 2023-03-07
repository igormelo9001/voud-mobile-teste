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
import TouchableText from '../../../components/TouchableText';
import { colors } from '../../../styles';
import { editMobileClear } from '../../../redux/profile-edit';
import { formatMobile, parseMobile } from '../../../utils/parsers-formaters';
import { required, mobileValidator, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '../../../utils/validators';
import { clearReduxForm } from '../../../utils/redux-form-util';

const reduxFormName = 'editMobile';

// component
class EditMobileForm extends Component {

  componentWillUnmount() {
    this.props.dispatch(editMobileClear());
    clearReduxForm(this.props.dispatch, reduxFormName);
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
        <BrandText style={styles.text}>
          Utilize os campos abaixo para atualizar seu número de celular. Um código de verificação será enviado para o novo número.
                </BrandText>
        <Field
          name="mobile"
          props={{
            label: 'Novo número de celular',
            placeholder: '(00) 9999 9999',
            maxLength: 16,
            keyboardType: 'phone-pad',
            returnKeyType: 'next',
            onSubmitEditing: (e) => {
              this.PasswordField.focus();
            }
          }}
          format={formatMobile}
          parse={parseMobile}
          component={TextField}
          validate={[required, mobileValidator]}
        />
        <Field
          name="password"
          props={{
            textFieldRef: el => this.PasswordField = el,
            label: 'Senha',
            secureTextEntry: true,
            minLength: MIN_PASSWORD_LENGTH,
            maxLength: MAX_PASSWORD_LENGTH,
            onSubmitEditing: () => { Keyboard.dismiss(); },
          }}
          helperText="Informe sua senha para confirmar a alteração"
          component={TextField}
          validate={[required]}
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
          Atualizar
                </Button>
        <TouchableText
          onPress={onCancel}
          style={styles.cancel}
          color={colors.BRAND_PRIMARY_LIGHTER}
        >
          Cancelar
                </TouchableText>
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
  },
  cancel: {
    marginTop: 16
  }
});

// Redux
const mapStateToProps = (state) => {
  return {
    initialValues: {
      name: state.profile.data.name,
      mobile: '',
      email: state.profile.data.email,
      password: ''
    }
  };
};

export default connect(mapStateToProps)(reduxForm({ form: reduxFormName, destroyOnUnmount: false })(EditMobileForm));
