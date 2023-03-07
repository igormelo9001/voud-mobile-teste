// NPM imports
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { change, Field } from "redux-form";

// VouD imports
// import SelectionButtonsField from '../../../../components/SelectionButtonsField';
import SelectionButtonsFieldOptions from "../../../../components/SelectionButtonsFieldOptions";

import BUQuotaQtyField from "./BUQuotaQtyField";
import { required } from "../../../../utils/validators";
import {
  findBUTemporalProduct,
  filterBUTransportTypeOptionsByPeriod
} from "../../../../utils/transport-card";
import {
  getPurchaseTransportCard,
  getBUSupportedPeriodTypesSelector
} from "../../../../redux/selectors";
import SystemText from "../../../../components/SystemText";
import { colors } from "../../../../styles";

// component

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  cardData: PropTypes.object.isRequired,
  reduxFormName: PropTypes.string.isRequired,
  periodType: PropTypes.string,
  transportType: PropTypes.string,
  quotaQty: PropTypes.number,
  selectedTemporalProduct: PropTypes.object,
  buSupportedPeriodTypes: PropTypes.arrayOf(PropTypes.string).isRequired
};

const defaultProps = {
  style: {},
  periodType: "",
  transportType: "",
  quotaQty: 0,
  selectedTemporalProduct: null
};

class BUTemporalProductFieldGroup extends Component {
  _getPeriodTypeOptions = () =>
    this.props.buSupportedPeriodTypes &&
    this.props.buSupportedPeriodTypes.map(periodType => ({
      label: periodType,
      value: periodType
    }));

  // _getTransportPeriodTypeOptions = () => {
  //   const { cardData : { wallets }, periodType } = this.props;
  //   const supportedTransportTypes = filterBUTransportTypeOptionsByPeriod(wallets, periodType);
  //   return supportedTransportTypes.map(transportType => ({ label: transportType, value: transportType }));
  // }

  _getTransportPeriodTypeOptions = periodType => {
    const {
      cardData: { wallets, activeMonth }
    } = this.props;

    const supportedTransportTypes = filterBUTransportTypeOptionsByPeriod(
      wallets,
      periodType,
      activeMonth
    );
    return supportedTransportTypes.map(transportType => ({
      label: transportType,
      value: transportType
    }));
  };

  _buTemporalUpdateCreditValue = (quotaQty, selectedTemporalProduct) => {
    const { dispatch, reduxFormName } = this.props;
    const { productValue } = selectedTemporalProduct;
    const creditValue = quotaQty * productValue * 100;

    dispatch(change(reduxFormName, "creditValue", creditValue));
  };

  _onPeriodTypeChange = periodType => {
    const {
      dispatch,
      reduxFormName,
      transportType,
      cardData: { wallets, activeMonth }
    } = this.props;
    const selectedTemporalProduct = findBUTemporalProduct(
      wallets,
      periodType,
      transportType,
      activeMonth
    );

    if (selectedTemporalProduct) {
      const { productMinimalQuantity } = selectedTemporalProduct;
      dispatch(change(reduxFormName, "quotaQty", productMinimalQuantity));
      this._buTemporalUpdateCreditValue(
        productMinimalQuantity,
        selectedTemporalProduct
      );
    }
  };

  _onTransportTypeChange = transportType => {
    const {
      dispatch,
      reduxFormName,
      quotaQty,
      periodType,
      cardData: { wallets, activeMonth },
      buCreditType
    } = this.props;
    const selectedTemporalProduct = findBUTemporalProduct(
      wallets,
      buCreditType,
      transportType,
      activeMonth
    );

    if (selectedTemporalProduct) {
      const {
        productMaximalQuantity,
        productMinimalQuantity
      } = selectedTemporalProduct;
      const resetQuotaQty = quotaQty > productMaximalQuantity || quotaQty === 0;
      const nextQuotaQty = resetQuotaQty ? productMinimalQuantity : quotaQty;

      if (resetQuotaQty) {
        dispatch(change(reduxFormName, "quotaQty", nextQuotaQty));
      }
      this._buTemporalUpdateCreditValue(nextQuotaQty, selectedTemporalProduct);
    }
  };

  _onQuotaQtyChange = quotaQty => {
    const {
      periodType,
      transportType,
      cardData: { wallets, activeMonth }
    } = this.props;
    const selectedTemporalProduct = findBUTemporalProduct(
      wallets,
      periodType,
      transportType,
      activeMonth
    );
    if (selectedTemporalProduct) {
      this._buTemporalUpdateCreditValue(quotaQty, selectedTemporalProduct);
    }
  };

  _renderDescriptionModal = () => {
    const { cardDetails, buCreditType } = this.props;
    if (!cardDetails.activeMonth && buCreditType === "Mensal") {
      return (
        <View style={styles.descriptionModalBU}>
          <SystemText
            style={styles.titleDescriptionModal}
          >{`Você já efetuou uma compra mensal.`}</SystemText>
        </View>
      );
    } else {
      return (
        <View style={styles.descriptionModal}>
          <SystemText
            style={styles.titleDescriptionModal}
          >{`Dá direito a realizar até 10 viagens por dia em`}</SystemText>
          <SystemText
            style={styles.titleDescriptionModal}
          >{`até 24h, a partir da primeira utilização.`}</SystemText>
        </View>
      );
    }
  };

  render() {
    const {
      style,
      periodType,
      selectedTemporalProduct,
      buCreditType
    } = this.props;

    return (
      <View style={style}>
        {this._renderDescriptionModal()}
        <Field
          name="transportType"
          props={{
            style: styles.temporalSelectionButtonsField,
            options: this._getTransportPeriodTypeOptions(buCreditType),
            buCreditType: buCreditType
          }}
          onChange={this._onTransportTypeChange}
          component={SelectionButtonsFieldOptions}
          validate={[required]}
        />

        {/* <Field
          name="periodType"
          props={{
            style: styles.temporalSelectionButtonsField,
            label: 'Período:',
            options: this._getPeriodTypeOptions(),
          }}
          onChange={this._onPeriodTypeChange}
          component={SelectionButtonsField}
          validate={[required]}
        />
        { periodType !== '' &&
          <Field
            name="transportType"
            props={{
              style: styles.temporalSelectionButtonsField,
              label: 'Modelo:',
              options: this._getTransportPeriodTypeOptions(periodType)
            }}
            onChange={this._onTransportTypeChange}
            component={SelectionButtonsField}
            validate={[required]}
          />
        } */}
        {/* { selectedTemporalProduct &&
          <Field
            name="quotaQty"
            props={{
              style: styles.temporalQuotaQtyField,
              minQuotaQty: selectedTemporalProduct.productMinimalQuantity,
              maxQuotaQty: selectedTemporalProduct.productMaximalQuantity
            }}
            onChange={this._onQuotaQtyChange}
            component={BUQuotaQtyField}
            validate={[required]}
          />
        } */}
      </View>
    );
  }
}

BUTemporalProductFieldGroup.propTypes = propTypes;
BUTemporalProductFieldGroup.defaultProps = defaultProps;

// styles
const styles = StyleSheet.create({
  temporalSelectionButtonsField: {
    marginBottom: 16
  },
  temporalQuotaQtyField: {
    marginBottom: 16
  },
  descriptionModalBU: {
    height: 72,
    flex: 1,
    backgroundColor: colors.BU_COLOR,
    marginBottom: 16,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  descriptionModal: {
    height: 72,
    flex: 1,
    backgroundColor: "#A84D97",
    marginBottom: 16,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  titleDescriptionModal: {
    color: "#FFF",
    fontSize: 15
  }
});

// redux connect and export
const mapStateToProps = state => {
  return {
    cardData: getPurchaseTransportCard(state),
    buSupportedPeriodTypes: getBUSupportedPeriodTypesSelector(state)
  };
};

export default connect(mapStateToProps)(BUTemporalProductFieldGroup);
