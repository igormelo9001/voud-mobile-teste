// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import {
  Keyboard,
  StyleSheet,
  View
} from 'react-native';

// VouD imports
import Button from '../../components/Button';
import BrandText from '../../components/BrandText';
import TextField from '../../components/TextField';
import MessageBox from '../../components/MessageBox';
import SystemText from '../../components/SystemText';
import TouchableText from '../../components/TouchableText';
import { colors } from '../../styles';
import FadeInView from '../../components/FadeInView';
import { confirmEmailClear, fetchResendEmailConfirmation } from '../../redux/register';
import { formatNumeric, parseNumeric } from '../../utils/parsers-formaters';
import { required } from '../../utils/validators';
import { GAEventParams, GATrackEvent } from '../../shared/analytics';
import { changeStep, authSteps } from '../../redux/auth';
import { showToast, toastStyles } from '../../redux/toast';
import { clearReduxForm } from '../../utils/redux-form-util';

// consts
const reduxFormName = 'confirmEmail';

// Component
class ConfirmEmailForm extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.dispatch(confirmEmailClear());
    
    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  _submit = () => {
    const { handleSubmit, onSubmit, ui, valid } = this.props;

    Keyboard.dismiss();

    if (valid && !ui.isFetching)
      handleSubmit(onSubmit)();
  };

  _editEmail = () => {
    const { categories: { BUTTON }, actions: { CLICK }, labels: { REGISTER_EDIT_EMAIL } } = GAEventParams;
    GATrackEvent(BUTTON, CLICK, REGISTER_EDIT_EMAIL);
    this.props.dispatch(changeStep(authSteps.EDIT_EMAIL));
  };

  _renderMain = () => {
    const { valid, ui } = this.props;

    return (
      <View>
        <Field
          name="verificationCode"
          props={{
            isPrimary: true,
            label: 'Código de verificação',
            keyboardType: 'numeric',
            maxLength: 6,
            fixedValue: 'V-',
            onSubmitEditing: () => { Keyboard.dismiss(); },
          }}
          format={formatNumeric}
          parse={parseNumeric}
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
          Enviar
        </Button>
      </View>
    );
  };

  _resendEmail = () => {
    const { dispatch } = this.props;
    this.props.dispatch(fetchResendEmailConfirmation())
      .catch((error) => { dispatch(showToast(error.message, toastStyles.ERROR )); });
  }

  render() {
    const { style, email } = this.props;

    return (
      <FadeInView style={style}>
        <BrandText style={styles.title}>
          Mais um passo…
        </BrandText>
        <BrandText style={styles.text}>
          Confirme seu e-mail informando abaixo o código enviado para:
        </BrandText>
        <SystemText style={styles.emailText}>
          {email}
        </SystemText>
        <TouchableText
          onPress={this._editEmail}
          style={styles.touchableText}
          color="white"
        >
          Este não é o seu e-mail?{' '}
          <BrandText style={styles.hyperlink}>
            Editar e-mail
          </BrandText>
        </TouchableText>
        {this._renderMain()}
        <TouchableText
          onPress={this._resendEmail}
          style={styles.touchableText}
          color="white"
        >
          Não recebeu o código?{' '}
          <BrandText style={styles.hyperlink}>
            Reenviar
          </BrandText>
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
  text: {
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
  },
  emailText: {
    marginBottom: 24,
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
  },
  loader: {
    marginBottom: 32,
  },
  touchableText: {
    marginTop: 24,
  },
  hyperlink: {
    color: colors.BRAND_SECONDARY,
  },
  errorMessage: {
    marginTop: 16,
  },
  button: {
    marginTop: 24,
  },
});

// Redux
const mapStateToProps = state => ({
  initialValues: {
    verificationCode: ''
  },
  email: state.profile.data.email,
});

export default connect(mapStateToProps)(reduxForm({ form: reduxFormName, destroyOnUnmount: false })(ConfirmEmailForm));
