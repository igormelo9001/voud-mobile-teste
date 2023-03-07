// NPM imports
import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Keyboard, StyleSheet } from "react-native";

// VouD imports
import Button from "../../components/Button";
import BrandText from "../../components/BrandText";
import TextField from "../../components/TextField";
import MessageBox from "../../components/MessageBox";
import TouchableText from "../../components/TouchableText";
import { colors } from "../../styles";
import FadeInView from "../../components/FadeInView";
import { recoverPasswordClear } from "../../redux/login";
import { formatMobile } from "../../utils/parsers-formaters";
import { required, exactLength3 } from "../../utils/validators";
import { clearReduxForm } from "../../utils/redux-form-util";

const reduxFormName = "recoverPassword";

// component
class RecoverPasswordForm extends Component {
  componentWillUnmount() {
    this.props.dispatch(recoverPasswordClear());
    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  _submit = () => {
    const { handleSubmit, onSubmit, ui, valid } = this.props;

    Keyboard.dismiss();

    if (valid && !ui.isFetching) handleSubmit(onSubmit)();
  };

  _generateMobileFirstNumbers = () => {
    const { mobile } = this.props;
    return (
      formatMobile(
        mobile
          .replace(/\D/g, "") // remove any non digit
          .slice(2, -6)
      ) + "xxx" // remove international code and last 6 digits
    ); // include xxx representing 3 digits before the last 3
  };

  render() {
    const { style, ui, valid } = this.props;

    return (
      <FadeInView style={style}>
        <BrandText style={styles.title}>Esqueci minha senha</BrandText>
        <BrandText style={styles.text}>
          Confirme os últimos 3 dígitos do seu número de celular. Nós enviaremos
          um código para você redefinir sua senha.
        </BrandText>
        <Field
          name="last3Digits"
          props={{
            isPrimary: true,
            label: "Celular (com ddd)",
            placeholder: "999",
            keyboardType: "phone-pad",
            onSubmitEditing: () => {
              Keyboard.dismiss();
            },
            maxLength: 3,
            fixedValue: this._generateMobileFirstNumbers()
          }}
          component={TextField}
          validate={[required, exactLength3]}
        />
        {ui.error ? (
          <MessageBox message={ui.error} style={styles.errorMessage} />
        ) : null}
        <Button
          onPress={this._submit}
          style={styles.button}
          disabled={!valid || ui.isFetching}
        >
          Enviar
        </Button>
        <TouchableText
          onPress={this.props.onCancel}
          style={styles.button}
          color={colors.BRAND_SECONDARY}
        >
          Voltar
        </TouchableText>
      </FadeInView>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  title: {
    marginTop: 40,
    marginBottom: 24,
    fontSize: 24,
    lineHeight: 32,
    textAlign: "center",
    color: "white"
  },
  text: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "white"
  },
  button: {
    marginTop: 16
  }
});

// Redux
const mapStateToProps = state => {
  return {
    initialValues: {
      mobile: state.profile.data.mobile,
      last3Digits: "",
      cpf: state.profile.data.cpf
    }
  };
};

export default connect(mapStateToProps)(
  reduxForm({ form: reduxFormName, destroyOnUnmount: false })(
    RecoverPasswordForm
  )
);
