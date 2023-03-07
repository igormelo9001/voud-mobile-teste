// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Keyboard, StyleSheet } from 'react-native';

// VouD imports
import Button from '../../components/Button';
import BrandText from '../../components/BrandText';
import TextField from '../../components/TextField';
import MessageBox from '../../components/MessageBox';
import TouchableText from '../../components/TouchableText';
import FadeInView from '../../components/FadeInView';
import { loginClear } from '../../redux/login';
import { required, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '../../utils/validators';
import { colors } from '../../styles/constants';
import { clearReduxForm } from '../../utils/redux-form-util';

const reduxFormName = 'login';

// component
class LoginForm extends Component {
  componentWillUnmount() {
    this.props.dispatch(loginClear());
    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  componentDidMount() {
    this.password.focus();
  }

  _submit = () => {
    const { handleSubmit, onSubmit, ui, valid } = this.props;

    Keyboard.dismiss();

    if (valid && !ui.isFetching) handleSubmit(onSubmit)();
  };

  render() {
    const { style, name, ui, valid, onChangeCpf, onForget } = this.props;

    return (
      <FadeInView style={style}>
        <BrandText style={styles.text}>
          {name},{'\n'}bem-vindo de volta!
        </BrandText>
        <Field
          name="password"
          props={{
            textFieldRef: el => (this.password = el),
            isPrimary: true,
            label: 'Senha',
            secureTextEntry: true,
            minLength: MIN_PASSWORD_LENGTH,
            maxLength: MAX_PASSWORD_LENGTH,
            autoCapitalize: 'none',
            onSubmitEditing: () => {
              Keyboard.dismiss();
            },
          }}
          component={TextField}
          validate={[required]}
        />
        {ui.error ? <MessageBox message={ui.error} style={styles.errorMessage} /> : null}
        <Button onPress={this._submit} style={styles.button} disabled={!valid || ui.isFetching}>
          Entrar
        </Button>
        <TouchableText onPress={onForget} style={styles.textButton} color={colors.BRAND_SECONDARY}>
          Esqueci minha senha
        </TouchableText>
        <TouchableText
          onPress={onChangeCpf}
          style={styles.textButton}
          color={colors.BRAND_SECONDARY}
        >
          Não é {name}?
        </TouchableText>
      </FadeInView>
    );
  }
}

// styles
const styles = StyleSheet.create({
  text: {
    marginTop: 40,
    marginBottom: 16,
    fontSize: 24,
    lineHeight: 28,
    textAlign: 'center',
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  CPFInput: {
    flex: 1,
    marginRight: 16,
  },
  changeCpfButton: {
    marginTop: 24,
  },
  errorMessage: {
    marginTop: 16,
  },
  button: {
    marginTop: 24,
  },
  textButton: {
    marginTop: 16,
  },
});

// Redux
const mapStateToProps = state => {
  return {
    initialValues: {
      cpf: state.profile.data.cpf,
      password: '',
    },
  };
};

export default connect(mapStateToProps)(
  reduxForm({ form: reduxFormName, destroyOnUnmount: false })(LoginForm)
);
