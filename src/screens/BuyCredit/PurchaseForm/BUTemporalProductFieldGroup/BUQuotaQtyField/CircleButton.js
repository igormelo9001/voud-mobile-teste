// NPM imports
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

// VouD imports
import { colors } from '../../../../../styles';
import Icon from '../../../../../components/Icon';
import TouchableNative from '../../../../../components/TouchableNative';

// component

const propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  iconName: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

const defaultProps = {
  style: {},
};

class CircleButton extends Component {

  render() {
    const { style, iconName, disabled, onPress } = this.props;
    const TouchableComponent = disabled ? View : TouchableNative;

    return (
      <View style={styles.circleButtonContainer}>
        <TouchableComponent
          style={StyleSheet.flatten([styles.circleButton, style])}
          borderless
          onPress={() => !disabled && onPress()}
        >
          <Icon 
            name={iconName}
            size={24}
            color={disabled ? colors.GRAY_LIGHT : colors.BRAND_PRIMARY}   
          />
        </TouchableComponent>
      </View>
    );
  }
}

CircleButton.propTypes = propTypes;
CircleButton.defaultProps = defaultProps;

// styles
const styles = StyleSheet.create({
  circleButtonContainer: {
    height: 48,
    width: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.GRAY_LIGHT2,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  circleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default CircleButton;
