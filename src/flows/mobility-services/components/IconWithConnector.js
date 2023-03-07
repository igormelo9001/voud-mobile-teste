// NPM imports
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

// VouD imports
import Icon from '../../../components/Icon';

// Images
const dashedLineImg = require('../images/dashed-line-v.png');

// Component
const propTypes = {
  iconName: PropTypes.string.isRequired,
  isDestination: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  iconStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

const defaultProps = {
  isDestination: false,
  style: {},
  iconStyle: {},
};

class IconWithConnector extends React.Component {
  render() {
    const { iconName, isDestination, style, iconStyle } = this.props;

    return (
      <View style={StyleSheet.flatten([styles.container, style])}>
        {
          isDestination ?
            <Image
              resizeMode="cover"
              source={dashedLineImg}
              style={styles.connector}
            /> :
            <View style={styles.connectorPlaceholder} />
        }
        <View style={styles.iconWrapper}>
          <Icon
            name={iconName}
            style={StyleSheet.flatten([styles.icon, iconStyle])}
          />
        </View>
        {
          isDestination ?
            <View style={styles.connectorPlaceholder} /> :
            <Image
              resizeMode="cover"
              source={dashedLineImg}
              style={styles.connector}
            />
        }
      </View>
    );
  }
}

IconWithConnector.propTypes = propTypes;
IconWithConnector.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
  },
  icon: {
    width: 24,
    height: 24,
    fontSize: 24,
    lineHeight: 24,
    textAlign: 'center',
  },
  connector: {
    flex: 1,
    width: 1,
  },
  connectorPlaceholder: {
    flex: 1,
  },
});

export default IconWithConnector;
