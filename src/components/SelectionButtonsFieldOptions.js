// NPM imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";

// VouD imports
import SelectionButton from "./SelectionButtonOptions";
import BrandText from "./BrandText";
import { colors } from "../styles";
import { formatCurrencyFromCents } from '../utils/parsers-formaters';

import {
  findBUTemporalProduct,
  filterBUTransportTypeOptionsByPeriod
} from "../utils/transport-card";
import {
  getPurchaseTransportCard,
  getBUSupportedPeriodTypesSelector
} from "../redux/selectors";

// Component
const propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number])
};

const defaultProps = {
  style: {}
};



class SelectionButtonsFieldOptions extends Component {

  _renderValue = transportType => {
    const {
      cardData: { wallets, activeMonth },
      buCreditType
    } = this.props;

    const selectedTemporalProduct = findBUTemporalProduct(
      wallets,
      buCreditType,
      transportType,
      activeMonth,
    );

    const { productValue } = selectedTemporalProduct;
    const creditValue = productValue * 100;

    return formatCurrencyFromCents(creditValue);
  };

  render() {
    const { style, input, options, onChangeValidation } = this.props;

    return (
      <View style={StyleSheet.flatten([styles.container, style])}>
        <View style={styles.brandsListColumn}>
          {options &&
            options.map((option, i) => (
              <SelectionButton
                key={i}
                style={StyleSheet.flatten([
                  styles.buttonColumn,
                  styles.firstButtonColumn
                ])}
                outline
                gray
                pristine={input.value === ""}
                selected={option.value === input.value}
                onPress={() => {
                  if (onChangeValidation && !onChangeValidation(option.value))
                    return;

                  input.onChange(option.value);
                }}
                title={option.label}
                value={this._renderValue(option.value)}
              />
            ))}
        </View>
      </View>
    );
  }
}

SelectionButtonsFieldOptions.propTypes = propTypes;
SelectionButtonsFieldOptions.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
  container: {
    // backgroundColor:"red",
    padding: 5
  },
  brandsListRow: {
    flexDirection: "row"
    // marginTop:16,
  },
  brandsListColumn: {
    // flexDirection: 'column',
    // padding:5,
  },
  buttonRow: {
    flex: 1,
    marginLeft: 8
  },
  firstButtonRow: {
    marginLeft: 0
  },
  buttonColumn: {
    // flex: 1,
    // marginTop: 10,
    // margin:16,
  },
  firstButtonColumn: {
    marginTop: 16
  },
  fieldLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.GRAY,
    marginBottom: 8
  }
});

// redux connect and export
const mapStateToProps = state => {
  return {
    cardData: getPurchaseTransportCard(state),
    buSupportedPeriodTypes: getBUSupportedPeriodTypesSelector(state),
  };
};

export default connect(mapStateToProps)(SelectionButtonsFieldOptions);
