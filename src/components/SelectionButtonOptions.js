// NPM imports
import React, { Component } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { pipe } from 'ramda';

// VouD imports
import TouchableNative from './TouchableNative';
import { colors } from '../styles';
import BrandText from './BrandText';
import SystemText from './SystemText';
import { appendIf } from '../utils/fp-util';

// component
const propTypes = {
  selected: PropTypes.bool,
  onPress: PropTypes.func,
  // children: PropTypes.node.isRequired,
  selectionValue: PropTypes.any,
  useSysFont: PropTypes.bool,
  pristine: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

const defaultProps = {
  selected: false,
  onPress: null,
  selectionValue: '',
  useSysFont: false,
  pristine: false,
  style: {},
};

class SelectionButtonOptions extends Component {

  _getButtonStyle = (baseStyle) => (
    pipe(
      () => [baseStyle],
      appendIf(this.props.style, this.props.style),
      appendIf(styles.selectedStyle, this.props.selected),
      appendIf(styles.disabledStyle, this.props.disabled),
      StyleSheet.flatten
    )()
  );

  _getTextStyle = (baseStyle) => {
    return pipe(
      () => [baseStyle],
      appendIf(styles.selectedTextStyle, this.props.selected),
      appendIf(styles.unseledctedTextStyle, !this.props.pristine && !this.props.selected),
      StyleSheet.flatten
    )();
  };

  _renderChildren = () => {
    const { children, useSysFont } = this.props;

    if (typeof children === 'string' || typeof children === 'number') {
      const TextComponent =  SystemText;

      return (
        <TextComponent style={this._getTextStyle(styles.textStyle)}>
          {children}
        </TextComponent>
      );
    }

    return children;
  };

  render() {
    const { onPress, selectionValue, disabled, title, value } = this.props;
    const Container = disabled ? View : TouchableNative;

    return (
      <Container
        onPress={() => {
          if (disabled) return;
          Keyboard.dismiss();
          onPress(selectionValue);
        }}
        style={this._getButtonStyle(styles.button)}>
        {/* {this._renderChildren()} */}
        <SystemText style={this._getTextStyle(styles.textStyle)}>
          {title}
        </SystemText>
        <SystemText style={this._getTextStyle(styles.textStyle)}>
        {`R$ ${value}`}
        </SystemText>

      </Container>
    );
  }
}

SelectionButtonOptions.propTypes = propTypes;
SelectionButtonOptions.defaultProps = defaultProps;

export default SelectionButtonOptions;

// styles
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.GRAY_LIGHT2,
    backgroundColor: 'transparent',
    elevation: 0,
    // flex:1,
  },
  selectedStyle: {
    borderColor: colors.BRAND_PRIMARY_LIGHTER,
  },
  disabledStyle: {
    opacity: 0.3
  },
  textStyle: {
    // color: colors.GRAY_DARKER,
    color:"#CACACA",
    fontSize: 18,
    lineHeight: 21,
    // textAlign: 'center'
  },
  selectedTextStyle: {
    color: colors.BRAND_PRIMARY_LIGHTER,
  },
  unseledctedTextStyle: {
    color: colors.GRAY_LIGHT,
  }
});
