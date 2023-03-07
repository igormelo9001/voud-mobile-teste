// NPM imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";

import { Keyboard, StyleSheet, View, Image } from "react-native";

// VouD imports
import TextField from "../../../components/TextField";
import { colors } from "../../../styles";
import { required } from "../../../utils/validators";
import SystemText from "../../../components/SystemText";
import Button from "../../../components/Button";
import BuySummary from "../BuySummary";
import { getCreditValueFieldLabel } from "../../../utils/transport-card";
import {
  getPurchaseTransportCard,
  getPromocodeResponse
} from "../../../redux/selectors";
import { productTypes } from "../../../redux/financial";

// Component const
const reduxFormName = "purchaseConfirmation";
const securityCodeHelper = require("../../../images/security-code-helper.png");

// Component
const propTypes = {
  onSubmit: PropTypes.func.isRequired
};

class PurchaseConfirmationForm extends Component {
  _submit = () => {
    Keyboard.dismiss();

    const { handleSubmit, onSubmit, valid } = this.props;
    if (valid) {
      handleSubmit(onSubmit)();
    }
  };

  _getCreditValueLabel = () => {
    const {
      paymentData: { productType }
    } = this.props;

    switch (productType) {
      case productTypes.PHONE_RECHARGE:
        return "Valor da recarga de celular";
      case productTypes.BOM:
      case productTypes.LEGAL:
      case productTypes.BU: {
        const {
          cardData,
          paymentData: { buAdditionalData }
        } = this.props;
        const buCreditType = buAdditionalData
          ? buAdditionalData.buCreditType
          : null;
        const buPeriodType = buAdditionalData
          ? buAdditionalData.periodType
          : null;
        const buTransportType = buAdditionalData
          ? buAdditionalData.transportType
          : null;
        const buProductQuantity = buAdditionalData
          ? buAdditionalData.productQuantity
          : null;
        return getCreditValueFieldLabel(
          cardData,
          buCreditType,
          buPeriodType,
          buTransportType,
          buProductQuantity
        );
      }
      case productTypes.REQUEST_CARD:
        return "Taxa de entrega";
      case productTypes.TICKET_UNITY:
        return "Valor da compra";
      default:
        return "";
    }
  };

  render() {
    const {
      valid,
      paymentData: { productType, rechargeValue },
      promocodeResponse,
      smartPurchaseFlow
    } = this.props;
    const discountValue =
      promocodeResponse.data && promocodeResponse.data.discountValue;
    const titleButton =
      productType === productTypes.REQUEST_CARD
        ? "Confirmar Pagamento"
        : smartPurchaseFlow
        ? "Finalizar"
        : "Finalizar Compra";

    return (
      <View style={styles.mainContainer}>
        <BuySummary
          productType={productType}
          rechargeValue={rechargeValue}
          discountValue={discountValue}
          discountLabel="Desconto"
          creditValueLabel={this._getCreditValueLabel()}
          valid
          showSubmitButton={false}
        />
        {!smartPurchaseFlow && (
          <View style={styles.securityCodeFieldContainer}>
            <SystemText style={styles.title}>Código de segurança</SystemText>
            <SystemText style={styles.confirmationText}>
              Confirme o código de segurança (CVV) escrito no verso do cartão.
            </SystemText>
            <Field
              name="creditCardSecurityCode"
              props={{
                label: "Cód. Segurança",
                isPrimary: false,
                maxLength: 4,
                keyboardType: "numeric",
                returnKeyType: "default",
                onSubmitEditing: () => {
                  Keyboard.dismiss();
                },
                right: () => (
                  <Image
                    style={styles.securityCodeHelper}
                    source={securityCodeHelper}
                  />
                )
              }}
              component={TextField}
              validate={[required]}
            />
          </View>
        )}
        <Button
          style={styles.finishButton}
          disabled={!valid}
          onPress={this._submit}
        >
          {titleButton}
        </Button>
      </View>
    );
  }
}

PurchaseConfirmationForm.propTypes = propTypes;

// Styles
const styles = StyleSheet.create({
  mainContainer: {},
  securityCodeFieldContainer: {
    paddingHorizontal: 24,
    paddingTop: 16
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "bold",
    color: colors.GRAY_DARKER,
    marginBottom: 16
  },
  confirmationText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.GRAY
  },
  securityCodeHelper: {
    alignSelf: "center",
    marginTop: -8
  },
  finishButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24
  },
  errorMessage: {
    marginBottom: 16,
    marginHorizontal: 24
  }
});

// Redux
const mapStateToProps = state => {
  return {
    initialValues: {
      creditCardSecurityCode: ""
    },
    cardData: getPurchaseTransportCard(state),
    promocodeResponse: getPromocodeResponse(state)
  };
};

export default connect(mapStateToProps)(
  reduxForm({ form: reduxFormName })(PurchaseConfirmationForm)
);
