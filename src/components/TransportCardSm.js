// NPM imports
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Image, Platform, StyleSheet, View } from "react-native";

// VouD imports
import BrandText from "./BrandText";
import SystemText from "./SystemText";
import TouchableNative from "./TouchableNative";
import { colors } from "../styles/constants";
import { formatBomCardNumber } from "../utils/parsers-formaters";
import {
  getColorForLayoutType,
  getLogoSmForLayoutType
} from "../utils/transport-card";
import { transportCardTypes } from "../redux/transport-card";
import Icon from "./Icon";

// Component
const propTypes = {
  cardName: PropTypes.string.isRequired,
  cardNumber: PropTypes.string.isRequired,
  layoutType: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number])
};

const defaultProps = {
  style: {},
  onPress: null
};

class TransportCardSm extends Component {
  _renderContent() {
    const { cardName, cardNumber, layoutType } = this.props;
    const isBu = layoutType === transportCardTypes.BU;
    const isLegal = layoutType === transportCardTypes.LEGAL;

    return (
      <Fragment>
        <Image
          style={styles.logo}
          source={getLogoSmForLayoutType(layoutType)}
        />
        <BrandText
          style={StyleSheet.flatten([
            styles.nameText,
            { color: getColorForLayoutType(layoutType) }
          ])}
          numberOfLines={1}
          ellipsizeMode={"tail"}
        >
          {cardName}
        </BrandText>
        <SystemText style={styles.numberText}>
          {isBu || isLegal ? cardNumber : formatBomCardNumber(cardNumber)}
        </SystemText>
      </Fragment>
    );
  }

  render() {
    const { style, onPress } = this.props;

    if (onPress)
      return (
        <TouchableNative
          style={StyleSheet.flatten([styles.container, style])}
          onPress={onPress}
        >
          {this._renderContent()}
        </TouchableNative>
      );
    else
      return (
        <View style={StyleSheet.flatten([styles.container, style])}>
          {this._renderContent()}
        </View>
      );
  }
}

TransportCardSm.propTypes = propTypes;
TransportCardSm.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    borderRadius: 4,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    padding: 16,
    backgroundColor: "white",
    borderColor:
      Platform.OS === "android" && Platform.Version < 21
        ? colors.OVERLAY_LIGHT
        : "transparent",
    borderWidth: Platform.OS === "android" && Platform.Version < 21 ? 1 : 0,
    margin: 5
  },
  logo: {
    width: 24,
    height: 24
  },
  nameText: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "bold"
  },
  numberText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "bold",
    color: colors.GRAY_DARKER
  }
});

export default TransportCardSm;
