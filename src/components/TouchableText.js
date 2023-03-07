// NPM imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pipe, append } from 'ramda';
import {
  StyleSheet,
} from 'react-native';

// VouD imports
import BrandText from './BrandText';
import { colors } from '../styles';
import SystemText from './SystemText';
import VoudTouchableOpacity from './TouchableOpacity';
import { appendIf } from '../utils/fp-util';

// component
const propTypes = {
  onPress: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  disablePreventDoubleTap: PropTypes.bool,
  useSysFont: PropTypes.bool,
  minHeightAuto: PropTypes.bool,
};

const defaultProps = {
  color: colors.BRAND_PRIMARY,
  style: {},
  textStyle: {},
  disablePreventDoubleTap: false,
  useSysFont: false,
  minHeightAuto: false
};

class TouchableText extends Component {

  _getContainerStyle = () => {
    return pipe(
      () => [styles.container],
      append(this.props.style),
      appendIf(styles.minHeightAuto, this.props.minHeightAuto),
      StyleSheet.flatten
    )();
  }

  _getTextStyle = () => {
    const { color, textStyle } = this.props;

    return pipe(
      () => [styles.text],
      append({ color }),
      append(textStyle),
      StyleSheet.flatten
    )();
  };

  render() {
    const { onPress, children, disablePreventDoubleTap, useSysFont, onLayout } = this.props;
    const TextComponent = useSysFont ? SystemText : BrandText;
    return (
      <VoudTouchableOpacity
        onPress={onPress}
        style={this._getContainerStyle()}
        disablePreventDoubleTap={disablePreventDoubleTap}
        onLayout={onLayout}>
        <TextComponent style={this._getTextStyle()}>
          {children}
        </TextComponent>
      </VoudTouchableOpacity>
    );
  }
}

TouchableText.propTypes = propTypes;
TouchableText.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
  container: {
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minHeightAuto: {
    minHeight: 'auto'
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  }
});

export default TouchableText;
