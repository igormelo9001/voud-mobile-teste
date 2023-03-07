// NPM imports
import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";

import { Keyboard, View, StyleSheet } from "react-native";

// VouD imports
import Button from "../../../components/Button";
import BrandText from "../../../components/BrandText";
import MessageBox from "../../../components/MessageBox";
import TextField from "../../../components/TextField";
import Icon from "../../../components/Icon";
import TouchableText from "../../../components/TouchableText";
import FadeInView from "../../../components/FadeInView";
import { colors } from "../../../styles";
import { confirmEmailClear } from "../../../redux/register";
import { required } from "../../../utils/validators";
import { formatNumeric, parseNumeric } from "../../../utils/parsers-formaters";
import { clearReduxForm } from "../../../utils/redux-form-util";

const reduxFormName = "emailConfirmation";

// Screen component
class ConfirmationForm extends Component {
  componentWillUnmount() {
    this.props.dispatch(confirmEmailClear());
    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  _submit = () => {
    const { valid, ui, onSubmit, handleSubmit } = this.props;

    Keyboard.dismiss();

    if (valid && !ui.isFetching) handleSubmit(onSubmit)();
  };

  render() {
    const { style, ui, email, valid, onResend, onEdit } = this.props;

    return (
      <FadeInView style={style}>
        <View style={styles.warningBox}>
          <Icon style={styles.icon} name="waiting" />
          <BrandText style={styles.email}>{email}</BrandText>
          <BrandText style={styles.warningText}>
            Informe o código enviado para o e-mail acima
          </BrandText>
        </View>
        <Field
          name="verificationCode"
          props={{
            textFieldRef: el => (this.EmailConfirmationField = el),
            label: "Código de verificação",
            keyboardType: "numeric",
            maxLength: 6,
            fixedValue: "V-",
            onSubmitEditing: () => {
              Keyboard.dismiss();
            }
          }}
          format={formatNumeric}
          parse={parseNumeric}
          component={TextField}
          validate={[required]}
          // validate={() => {
          //   return "Campo obrigatório";
          // }}
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
          onPress={onResend}
          style={styles.touchableText}
          color={colors.BRAND_PRIMARY_LIGHTER}
        >
          Reenviar código
        </TouchableText>
        <TouchableText
          onPress={onEdit}
          style={styles.touchableText}
          color={colors.BRAND_PRIMARY_LIGHTER}
        >
          Corrigir endereço de email
        </TouchableText>
      </FadeInView>
    );
  }
}

const styles = StyleSheet.create({
  warningBox: {
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: colors.BRAND_SECONDARY
  },
  icon: {
    fontSize: 48,
    color: colors.BRAND_SECONDARY
  },
  email: {
    marginVertical: 8,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.GRAY_DARKER
  },
  warningText: {
    fontSize: 14,
    textAlign: "center",
    color: colors.GRAY
  },
  errorMessage: {
    marginTop: 16
  },
  button: {
    marginTop: 24
  },
  touchableText: {
    marginTop: 16
  }
});

// Redux
const mapStateToProps = state => {
  return {
    initialValues: {
      verificationCode: ""
    }
  };
};

export default connect(mapStateToProps)(
  reduxForm({ form: reduxFormName, destroyOnUnmount: false })(ConfirmationForm)
);
