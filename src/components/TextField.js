// NPM imports
import React, { Component } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import PropTypes from "prop-types";

// VouD imports
import BrandText from "./BrandText";
import Icon from "./Icon";
import TextInput from "./TextInput";
import { colors } from "../styles";
import VoudTouchableOpacity from "./TouchableOpacity";

// Component
const propTypes = {
  helperText: PropTypes.string,
  onHelperPress: PropTypes.func,
  isPrimary: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  onPressOverlay: PropTypes.func
};

const defaultProps = {
  helperText: "",
  onHelperPress: null,
  isPrimary: false,
  style: {},
  onPressOverlay: null
};

class VoudTextField extends Component {
  _renderHelper = () => {
    const { helperText, onHelperPress, isPrimary } = this.props;

    const helperIconStyle = isPrimary
      ? StyleSheet.flatten([styles.messageIcon, styles.light])
      : StyleSheet.flatten([
          styles.messageIcon,
          onHelperPress ? styles.actionable : {}
        ]);
    const helperTextStyle = isPrimary
      ? StyleSheet.flatten([styles.messageText, styles.light])
      : StyleSheet.flatten([
          styles.messageText,
          onHelperPress ? styles.actionable : {}
        ]);

    if (helperText && onHelperPress) {
      return (
        <VoudTouchableOpacity onPress={onHelperPress}>
          <View style={styles.messageContainer}>
            <Icon name="help-outline" style={helperIconStyle} />
            <BrandText style={helperTextStyle}>{helperText}</BrandText>
          </View>
        </VoudTouchableOpacity>
      );
    }

    if (helperText) {
      return (
        <View style={styles.messageContainer}>
          <BrandText style={helperTextStyle}>{helperText}</BrandText>
        </View>
      );
    }

    return null;
  };

  _renderError = () => {
    const {
      meta,
      helperText,
      isPrimary,
      input,
      minLength,
      maxLength,
      customShowError,
      isRequestCard
    } = this.props;
    const { error, touched } = meta;

    let errorIconStyle = isPrimary
      ? StyleSheet.flatten([styles.messageIcon, styles.light])
      : StyleSheet.flatten([styles.messageIcon, styles.error]);
    let errorTextStyle = isPrimary
      ? StyleSheet.flatten([styles.messageText, styles.light])
      : StyleSheet.flatten([styles.messageText, styles.error]);
    const inputValue = input.value ? input.value.toString() : "";
    const minLengthReached = minLength ? inputValue.length >= minLength : false;
    const maxLengthReached = maxLength ? inputValue.length >= maxLength : false;
    const showError = customShowError
      ? customShowError(meta)
      : (touched || minLengthReached || maxLengthReached) && error;

    if (isRequestCard) {
      (errorIconStyle = StyleSheet.flatten([
        styles.messageIcon,
        styles.lightRequestCard
      ])),
        (errorTextStyle = StyleSheet.flatten([
          styles.messageText,
          styles.lightRequestCard
        ]));
    }

    if (showError) {
      return (
        <View
          style={StyleSheet.flatten([
            styles.messageContainer,
            helperText ? { marginTop: 4 } : {}
          ])}
        >
          <Icon name="error-outline" style={errorIconStyle} />
          <BrandText style={errorTextStyle}>{meta.error}</BrandText>
        </View>
      );
    }

    return null;
  };

  render() {
    const {
      input,
      isPrimary,
      isRequestCard,
      textFieldRef,
      style,
      onPressOverlay,
      ...props
    } = this.props;

    let styleProps = isPrimary ? formPrimaryProps : formDefaultProps;
    if (isRequestCard) styleProps = formRequestCardProps;

    return (
      <View style={style}>
        <TextInput
          {...props}
          {...styleProps}
          textFieldRef={textFieldRef || null}
          onChangeText={input.onChange}
          onBlur={input.onBlur}
          onFocus={input.onFocus}
          value={input.value}
        />
        {this._renderHelper()}
        {this._renderError()}
        {onPressOverlay && (
          <TouchableWithoutFeedback onPress={onPressOverlay}>
            <View style={styles.actionOverlay} />
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}

VoudTextField.propTypes = propTypes;
VoudTextField.defaultProps = defaultProps;

// Styles

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  messageIcon: {
    width: 16,
    marginRight: 8,
    fontSize: 16,
    textAlign: "center",
    color: colors.GRAY,
    backgroundColor: "transparent"
  },
  messageText: {
    flex: 1,
    fontSize: 12,
    color: colors.GRAY
  },
  actionOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  // error modifier
  error: {
    color: colors.BRAND_ERROR
  },
  // light modifier
  light: {
    color: "white"
  },
  // actionable modifier
  actionable: {
    color: colors.BRAND_PRIMARY_LIGHTER
  },
  lightRequestCard: {
    color: colors.GRAY
  }
});

const formDefaultProps = {
  textColor: colors.GRAY_DARKER,
  tintColor: colors.BRAND_PRIMARY_LIGHTER,
  baseColor: colors.GRAY
};

const formPrimaryProps = {
  textColor: "white",
  tintColor: colors.BRAND_SECONDARY,
  baseColor: "rgba(255,255,255,0.5)"
};

const formRequestCardProps = {
  textColor: "#1D1D1D",
  tintColor: colors.GRAY,
  baseColor: colors.GRAY
};

export default VoudTextField;
