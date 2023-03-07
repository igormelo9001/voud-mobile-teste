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
import { confirmMobileClear } from '../../redux/register';
import { formatMobileNoIntl, formatNumeric, parseNumeric } from '../../utils/parsers-formaters';
import { required } from '../../utils/validators';
import { clearReduxForm } from '../../utils/redux-form-util';
import { GAEventParams, GATrackEvent } from '../../shared/analytics';
import { changeStep, authSteps } from '../../redux/auth';

// consts
const reduxFormName = 'confirmMobile';

// Component
class ConfirmMobileForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canResend: false,
      canEdit: false,
      canCancel: false,
    };
  }

  componentDidMount() {
    // allow resend after 8s
    setTimeout(() => {
      this.setState({ canResend: true });
    }, 8000);
  }

  componentWillUnmount() {
    this.props.dispatch(confirmMobileClear());
    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  _submit = () => {
    const { handleSubmit, onSubmit, ui, valid } = this.props;

    Keyboard.dismiss();

    if (valid && !ui.isFetching)
      handleSubmit(onSubmit)();
  };

  _editPhone = () => {
    const { categories: { BUTTON }, actions: { CLICK }, labels: { REGISTER_EDIT_MOBILE } } = GAEventParams;
    GATrackEvent(BUTTON, CLICK, REGISTER_EDIT_MOBILE);
    this.props.dispatch(changeStep(authSteps.EDIT_MOBILE));
  };

  _renderMain = () => {
    const { valid, ui } = this.props;

    return (
      <View>
        <Field
          name="verificationCode"
          props={{
            isPrimary: true,
            label: 'Código recebido',
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

  render() {
    const { style, onResendSMS, mobile } = this.props;

    return (
      <FadeInView style={style}>
        <BrandText style={styles.title}>
          Quase lá...
        </BrandText>
        <BrandText style={styles.text}>
          Confime seu telefone informando abaixo o código  enviado para:
        </BrandText>
        <SystemText style={styles.mobileNumber}>
          {formatMobileNoIntl(mobile)}
        </SystemText>
        <FadeInView>
          <TouchableText
            onPress={this._editPhone}
            style={styles.touchableTextEdit}
            color="white"
          >
            Este não é o seu número?{' '}
            <BrandText style={styles.hyperlink}>
              Editar telefone
            </BrandText>
          </TouchableText>
        </FadeInView>
        {this._renderMain()}
        <FadeInView>
          <TouchableText
            onPress={onResendSMS}
            style={styles.touchableTextResend}
            color="white"
          >
            Não recebeu o código?{' '}
            <BrandText style={styles.hyperlink}>
              Reenviar
            </BrandText>
          </TouchableText>
        </FadeInView>
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
  mobileNumber: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
  },
  loader: {
    marginBottom: 32,
  },
  touchableTextEdit: {
    marginTop: 16,
  },
  touchableTextResend: {
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
const mapStateToProps = () => ({
  initialValues: {
    verificationCode: ''
  }
});

export default connect(mapStateToProps)(reduxForm({ form: reduxFormName, destroyOnUnmount: false })(ConfirmMobileForm));