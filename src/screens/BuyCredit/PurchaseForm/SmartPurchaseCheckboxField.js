// NPM imports
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { StyleSheet, Alert } from "react-native";

// VouD imports
import { colors } from "../../../styles";
import CheckBoxField from "../../../components/CheckBoxField";
import TouchableNative from "../../../components/TouchableNative";
import Icon from "../../../components/Icon";
import { getSelectedPaymentMethod } from "../../../redux/selectors";
import { navigateToRoute } from "../../../redux/nav";
import { routeNames } from "../../../shared/route-names";
import {
  buCreditTypeLabels,
  isBOMEscolar
} from "../../../utils/transport-card";
import { showSmartPurchaseUnavailableForEscolar } from "../../../utils/smart-purchase-util";

// Component
const propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number])
};

const defaultProps = {
  style: {}
};

class SmartPurchaseCheckboxField extends Component {
  _uncheckedSaveCreditCard = () =>
    this.props.selectedPaymentMethod &&
    this.props.selectedPaymentMethod.isTemporaryCard &&
    !this.props.selectedPaymentMethod.saveCreditCard;

  _isEscolarCreditType = () =>
    isBOMEscolar(this.props.cardData.layoutType) ||
    this.props.buCreditType === buCreditTypeLabels.ESCOLAR;

  _isDisabled = () =>
    this._uncheckedSaveCreditCard() || this._isEscolarCreditType();

  _goToEditCard = () => {
    const { dispatch, selectedPaymentMethod } = this.props;
    dispatch(
      navigateToRoute(routeNames.ADD_PAYMENT_METHOD, {
        purchaseFlow: true,
        editPaymentMethod: selectedPaymentMethod
      })
    );
  };

  _onPressDisabled = () => {
    if (this._uncheckedSaveCreditCard()) {
      return Alert.alert(
        "Salve seu cartão de crédito no aplicativo",
        "Para fazermos a próxima recarga, nosso aplicativo precisa do seu cartão salvo. Volte na opção de pagamento e clique em “salvar cartão”. Não se preocupe, é fácil e muito seguro.",
        [{ text: "Ver cartão", onPress: this._goToEditCard }, { text: "OK" }]
      );
    }

    if (this._isEscolarCreditType()) {
      showSmartPurchaseUnavailableForEscolar();
    }
  };

  render() {
    return (
      <CheckBoxField
        {...this.props}
        text={"Repetir esta compra mensalmente"}
        style={styles.smartPurchaseCheckbox}
        styleContainer={styles.smartPurchaseCheckboxContainer}
        disabled={this._isDisabled()}
        onPressDisabled={this._onPressDisabled}
        right={() => (
          <TouchableNative
            borderless
            onPress={() => {
              Alert.alert(
                "Programar compra",
                this.props.cardData.issuerType === "LEGAL"
                  ? "Agilize a sua vida e programe a compra dos seus créditos todos os meses."
                  : "Agilize a sua vida e programe a compra dos seus créditos todos os meses. Daí é só validar em um dos nossos postos de recarga e pronto!\n\nExperimente!",
                [{ text: "OK" }]
              );
            }}
          >
            <Icon name="help-outline" size={20} color={colors.BRAND_PRIMARY} />
          </TouchableNative>
        )}
      />
    );
  }
}

SmartPurchaseCheckboxField.propTypes = propTypes;
SmartPurchaseCheckboxField.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16
  },
  smartPurchaseCheckboxContainer: {
    padding: 16
  },
  smartPurchaseCheckbox: {
    flex: 1
  }
});

// Redux
const mapStateToProps = state => {
  return {
    selectedPaymentMethod: getSelectedPaymentMethod(state)
  };
};

export default connect(mapStateToProps)(SmartPurchaseCheckboxField);
