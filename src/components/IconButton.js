// NPM imports
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform } from 'react-native';

// VouD imports
import Icon from './Icon';
import TouchableOpacity from './TouchableOpacity';
import { colors } from './../styles';
import VoudText from './VoudText';

// Component
const propTypes = {
  iconName: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  iconStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  children: PropTypes.string
};

const defaultProps = {
  onPress: () => {},
  style: {},
  iconStyle: {},
  textStyle: {},
  children: null
};

const toUpperCase = message => {
  if (!message)
    return message;

  // will receive array if children has line break {'\n'}
  if (Array.isArray(message)) {
      return message.map(line => line.toUpperCase());
  }
  return message.toUpperCase();
};

class IconButton extends React.Component {
  render() {
    const {
      iconName,
      onPress,
      style,
      iconStyle,
      textStyle,
      children
    } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={StyleSheet.flatten([styles.container, style])}>
          <Icon
            name={iconName}
            style={StyleSheet.flatten([styles.icon, iconStyle])}
          />
          {
            children &&
            <VoudText style={StyleSheet.flatten([styles.text, textStyle])}>{Platform.OS === 'ios' ? children : toUpperCase(children)}</VoudText>
          }
      </TouchableOpacity>
    );
  }
}

IconButton.propTypes = propTypes;
IconButton.defaultProps = defaultProps;

// styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  icon: {
    fontSize: 24,
    color: colors.BRAND_PRIMARY,
  },
  text: {
    fontSize: 12,
    color: colors.BRAND_PRIMARY,
    marginLeft: 10
  }
});

export default IconButton;
