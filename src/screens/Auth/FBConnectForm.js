// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import {
  Keyboard,
  StyleSheet,
} from 'react-native';

// VouD imports
import Button from '../../components/Button';
import BrandText from '../../components/BrandText';
import TextField from '../../components/TextField';
import MessageBox from '../../components/MessageBox';
import FadeInView from '../../components/FadeInView';
import TouchableText from '../../components/TouchableText';
import { loginClear } from '../../redux/login';
import {
  required,
  minPasswordLength,
  maxPasswordLength,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../../utils/validators';
import { colors } from '../../styles/constants';
import { formatCpf } from '../../utils/parsers-formaters';
import { clearReduxForm } from '../../utils/redux-form-util';

const reduxFormName = 'fbConnect';

// component
class FBConnectForm extends Component {

  componentWillUnmount() {
    this.props.dispatch(loginClear());
    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  _submit = () => {
    const { handleSubmit, onSubmit, ui, valid } = this.props;

    Keyboard.dismiss();

    if (valid && !ui.isFetching)
      handleSubmit(onSubmit)();
  };

  render() {
    const { style, ui, valid, cpf, onForget, onChangeCpf } = this.props;

    return (
      <FadeInView style={style}>
        <BrandText style={styles.title}>
          Conectar Facebook
        </BrandText>
        <BrandText style={styles.infoText}>
          O CPF informado já está cadastrado.
          Informe sua senha do VouD para confirmar o vínculo com o Facebook:
        </BrandText>
        <Field
          name="password"
          props={{
            textFieldRef: el => this.PasswordField = el,
            isPrimary: true,
            label: 'Senha',
            secureTextEntry: true,
            minLength: MIN_PASSWORD_LENGTH,
            maxLength: MAX_PASSWORD_LENGTH,
            onSubmitEditing: () => { Keyboard.dismiss(); },
          }}
          component={TextField}
          validate={[required, minPasswordLength, maxPasswordLength]}
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
          Conectar Facebook
        </Button>
        <TouchableText
          onPress={onForget}
          style={styles.button}
          color={colors.BRAND_SECONDARY}
        >
          Esqueci minha senha
        </TouchableText>
        <TouchableText
          onPress={onChangeCpf}
          style={styles.wrongCPF}
          textStyle={styles.wrongCPFText}
        >
          CPF {formatCpf(cpf)}.{' '}
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
  infoText: {
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 20,
    color: 'white',
    textAlign: 'center'
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
  hyperlink: {
    color: colors.BRAND_SECONDARY,
  },
});

// Redux
const mapStateToProps = state => {
  return {
    initialValues: {
      cpf: state.profile.data.cpf,
      password: ''
    },
    cpf: formValueSelector(reduxFormName)(state, 'cpf'),
  }
};

export default connect(mapStateToProps)(reduxForm({ form: reduxFormName, destroyOnUnmount: false })(FBConnectForm));
