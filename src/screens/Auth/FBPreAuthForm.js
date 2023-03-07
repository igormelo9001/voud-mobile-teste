// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import {
  Keyboard,
  StyleSheet
} from 'react-native';

// VouD imports
import Button from '../../components/Button';
import BrandText from '../../components/BrandText';
import TextField from '../../components/TextField';
import MessageBox from '../../components/MessageBox';
import FBProfileBox from './FBProfileBox';
import { formatCpf, parseCpf } from '../../utils/parsers-formaters';
import FadeInView from '../../components/FadeInView';
import { preAuthClear } from '../../redux/login';
import { cpfValidator, required } from '../../utils/validators';
import { clearReduxForm } from '../../utils/redux-form-util';

const reduxFormName = 'fbPreAuth';

// component
class FBPreAuthForm extends Component {

  componentWillUnmount() {
    this.props.dispatch(preAuthClear());
    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  _submit = () => {
    const { handleSubmit, onSubmit, ui, valid } = this.props;

    Keyboard.dismiss();

    if (valid && !ui.isFetching)
      handleSubmit(onSubmit)();
  };

  render() {
    const { style, ui, valid, fbData: { name, lastName, email } } = this.props;

    return (
      <FadeInView style={style}>
        <BrandText style={styles.title}>
          Conectar Facebook
        </BrandText>
        <BrandText style={styles.infoText}>
          Precisamos de mais alguns dados para que você possa acessar o VouD.
        </BrandText>
        <FBProfileBox
          style={styles.profileBox}
          name={name}
          lastName={lastName}
          email={email}
        />
        <Field
          name="cpf"
          props={{
            isPrimary: true,
            label: 'CPF',
            maxLength: 14,
            keyboardType: 'numeric',
            onSubmitEditing: () => { Keyboard.dismiss(); },
          }}
          format={formatCpf}
          parse={parseCpf}
          component={TextField}
          validate={[required, cpfValidator]}
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
          Continuar
        </Button>
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
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: 16
  },
  button: {
    marginTop: 24
  },
  fbButton: {
    marginTop: 16
  },
  profileBox: {
    marginBottom: 16,
  }
});

// Redux
const mapStateToProps = state => {
  return {
    initialValues: {
      cpf: ''
    },
    fbData: state.facebook.login.data
  }
};

export default connect(mapStateToProps)(reduxForm({ form: reduxFormName, destroyOnUnmount: false })(FBPreAuthForm));
