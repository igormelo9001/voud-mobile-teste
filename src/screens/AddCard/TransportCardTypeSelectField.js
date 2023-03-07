// NPM imports
import React, { Component } from "react";
import { Image, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { pipe } from "ramda";

// VouD imports
import TouchableNative from "../../components/TouchableNative";
import { colors } from "../../styles";
import { appendIf } from "../../utils/fp-util";

// component
const bomLogoImg = require("../../images/transport-cards/bom.png");
const buLogoImg = require("../../images/transport-cards/bu.png");
const legalImg = require("../../images/transport-cards/legal.png");

export const transportCardTypeValues = {
  BOM: "BOM",
  BU: "BU",
  LEGAL: "LEGAL"
};

const buttons = [
  { value: transportCardTypeValues.BU, img: buLogoImg, styleName: "buImg" },
  { value: transportCardTypeValues.BOM, img: bomLogoImg, styleName: "bomImg" },
  { value: transportCardTypeValues.LEGAL, img: legalImg, styleName: "legalImg" }
];

const propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number])
};

const defaultProps = {
  style: {}
};

class TransportCardTypeSelect extends Component {
  _renderButtons = () => {
    const { input } = this.props;

    return buttons.map((button, i) => {
      // separating touchable and button (View) styles
      // to avoid opacity problems with iOS

      const touchableStyle = pipe(
        baseStyle => [baseStyle],
        appendIf(styles.first, i === 0),
        StyleSheet.flatten
      )(styles.touchable);

      const buttonStyle = pipe(
        baseStyle => [baseStyle],
        appendIf(styles.selected, input.value === button.value),
        appendIf(
          styles.notSelected,
          input.value && input.value !== button.value
        ),
        StyleSheet.flatten
      )(styles.button);

      return (
        <TouchableNative
          key={i}
          onPress={() => {
            input.onChange(button.value);
          }}
          style={touchableStyle}
        >
          <View style={buttonStyle}>
            <Image
              source={button.img}
              style={styles[button.styleName]}
              resizeMode="contain"
            />
          </View>
        </TouchableNative>
      );
    });
  };

  render() {
    const { style } = this.props;

    return (
      <View style={StyleSheet.flatten([styles.container, style])}>
        {this._renderButtons()}
      </View>
    );
  }
}

TransportCardTypeSelect.propTypes = propTypes;
TransportCardTypeSelect.defaultProps = defaultProps;

// styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  touchable: {
    flex: 1,
    alignItems: "stretch",
    height: 72,
    marginLeft: 16
  },
  first: {
    marginLeft: 0
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.GRAY_LIGHT2,
    backgroundColor: "transparent"
  },
  selected: {
    borderColor: colors.BRAND_PRIMARY_LIGHTER
  },
  notSelected: {
    opacity: 0.3
  },
  // image styles
  bomImg: {
    height: 32
  },
  buImg: {
    height: 48
  },
  legalImg: {
    height: 48
  }
});

export default TransportCardTypeSelect;
