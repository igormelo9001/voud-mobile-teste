// NPM imports
import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// VouD imports
import TouchableNative from './TouchableNative';
import SystemText from './SystemText';
import { colors } from '../styles';
import Icon from './Icon';

// Component
const propTypes = {
  onPress: PropTypes.func,
  mainText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

const defaultProps = {
  onPress: () => {},
  secondaryText: '',
  style: {},
};

class PredictionItem extends React.Component {
  render() {
    const { mainText, secondaryText, onPress, style } = this.props;

    return (
      <TouchableNative
        onPress={onPress}
        style={style}
      >
        <SystemText style={styles.mainText}>{mainText}</SystemText>
        {(typeof secondaryText === 'string' && secondaryText.length > 0) && (
          <SystemText style={styles.secondaryText}>{secondaryText}</SystemText>
        )}
        <Icon name="pin" />
      </TouchableNative>
    );
  }
}

PredictionItem.propTypes = propTypes;
PredictionItem.defaultProps = defaultProps;

const styles = StyleSheet.create({
  mainText: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.GRAY_DARKER,
  },
  secondaryText: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 16,
    color: colors.GRAY,
  },
});

export default PredictionItem;
