// NPM imports
import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field, formValueSelector } from "redux-form";
import { Keyboard, StyleSheet, View } from "react-native";
import { pipe } from "ramda";

// VouD imports
import BrandText from "../../components/BrandText";
import FadeInView from "../../components/FadeInView";
import Button from "../../components/Button";
import MessageBox from "../../components/MessageBox";
import TextField from "../../components/TextField";
import { colors } from "../../styles";
import {
  required,
  bomCardNumberValidator,
  legalCardNumberValidator
} from "../../utils/validators";
import {
  formatBomCardNumber,
  parseBomCardNumber,
  formatAlphanumeric,
  parseAlphanumeric
} from "../../utils/parsers-formaters";
import { routeNames } from "../../shared/route-names";
import { navigateToRoute } from "../../redux/nav";
import { appendIf } from "../../utils/fp-util";

// Component imports
import TransportCardTypeSelectField, {
  transportCardTypeValues
} from "./TransportCardTypeSelectField";
import { clearReduxForm } from "../../utils/redux-form-util";

const BOM_CARD_NUMBER_LENGTH = 16;
const BU_CARD_NUMBER_LENGTH = 9;
const LEGAL_CARD_NUMBER_LENGTH = 16;
const reduxFormName = "addCard";

// Component
class AddCardForm extends Component {
  componentWillUnmount() {
    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  _submit = () => {
    const { handleSubmit, onSubmit, ui, valid } = this.props;

    Keyboard.dismiss();

    if (valid && !ui.isFetching) handleSubmit(onSubmit)();
  };

  _viewHelp = () => {
    const { issuerType } = this.props;
    this.props.dispatch(
      navigateToRoute(routeNames.ADD_CARD_HELPER_DIALOG, { issuerType })
    );
  };

  cardLabel = type => {
    switch (type) {
      case transportCardTypeValues.BU:
        return "Bilhete Único";
      case transportCardTypeValues.LEGAL:
        return "Cartão Legal";
      default:
        return "Cartão BOM";
    }
  };

  cardHelpText = type => {
    switch (type) {
      case transportCardTypeValues.BU:
        return "Bilhete Único";
      case transportCardTypeValues.LEGAL:
        return "Cartão Legal";
      default:
        return "BOM";
    }
  };

  cardMaxLength = type => {
    switch (type) {
      case transportCardTypeValues.BU:
        return BU_CARD_NUMBER_LENGTH;
      case transportCardTypeValues.LEGAL:
        return LEGAL_CARD_NUMBER_LENGTH;

      default:
        return BOM_CARD_NUMBER_LENGTH;
    }
  };

  render() {
    const { style, ui, valid, issuerType } = this.props;
    const isBU = issuerType === transportCardTypeValues.BU;
    const isLegal = issuerType === transportCardTypeValues.LEGAL;
    const carNumberValidate = isLegal
      ? legalCardNumberValidator
      : bomCardNumberValidator;

    const cardNumberValidators = pipe(
      baseValidator => [baseValidator],
      appendIf(carNumberValidate, !isBU)
    )(required);

    return (
      <View style={StyleSheet.flatten([styles.container, style])}>
        <BrandText style={styles.text}>
          Selecione o tipo do cartão de transporte
        </BrandText>
        <Field
          name="issuerType"
          style={styles.cardTypes}
          component={TransportCardTypeSelectField}
          validate={[required]}
        />
        {!!issuerType && (
          <FadeInView>
            <Field
              name="cardNumber"
              props={{
                label: `Número do ${this.cardLabel(issuerType)}`,
                keyboardType: "numeric",
                maxLength: this.cardMaxLength(issuerType),
                returnKeyType: "next",
                onSubmitEditing: () => {
                  this.NickField.focus();
                }
              }}
              format={isBU ? null : formatBomCardNumber}
              parse={parseBomCardNumber}
              helperText={`Como encontrar o número do ${this.cardHelpText(
                issuerType
              )}?`}
              onHelperPress={this._viewHelp}
              component={TextField}
              validate={cardNumberValidators}
            />
            <Field
              name="nick"
              props={{
                textFieldRef: el => (this.NickField = el),
                label: "Apelido do cartão",
                onSubmitEditing: () => {
                  Keyboard.dismiss();
                },
                maxLength: 40
              }}
              format={formatAlphanumeric}
              parse={parseAlphanumeric}
              helperText="Escolha um nome que lhe ajude na identificação deste cartão."
              component={TextField}
              validate={[required]}
            />
            {ui.error ? (
              <MessageBox message={ui.error} style={styles.errorMessage} />
            ) : null}
            <Button
              onPress={this._submit}
              style={styles.button}
              disabled={!valid || ui.isFetching}
            >
              Incluir cartão
            </Button>
          </FadeInView>
        )}
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch"
  },
  text: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    color: colors.GRAY
  },
  cardTypes: {
    marginBottom: 16
  },
  errorMessage: {
    marginTop: 16
  },
  button: {
    paddingVertical: 24
  }
});

// Redux
const mapStateToProps = (state, ownProps) => ({
  initialValues: {
    issuerType: ownProps.issuerType || "",
    cardNumber: "",
    nick: ""
  },
  issuerType: formValueSelector(reduxFormName)(state, "issuerType")
});

export default connect(mapStateToProps)(
  reduxForm({ form: reduxFormName, destroyOnUnmount: false })(AddCardForm)
);
