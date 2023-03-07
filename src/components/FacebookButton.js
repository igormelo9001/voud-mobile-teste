// NPM imports
import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

// VouD imports
import TouchableNative from './TouchableNative';
import BrandText from './BrandText';
import Icon from './Icon';

// Component
const propTypes = {
  onPress: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  buttonText: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

const defaultProps = {
  style: {},
  disabled: false,
};

class FacebookButton extends Component {
  render() {
    const { buttonText, disabled, onPress, style, isRound } = this.props;
    return (
      <View style={StyleSheet.flatten([style, disabled ? styles.disabledContainer : {}])}>
        <TouchableNative
          onPress={() => { if (!disabled) onPress() }}
          style={
            StyleSheet.flatten([
              styles.button,
              disabled ? styles.disabled : {},
              isRound ? styles.isRoundBorderRadius : {}
            ])
            }
        >
          <Icon
            style={
              StyleSheet.flatten([
                styles.icon,
                isRound ? {} : styles.defaultIconMarginRight,
              ])
            }
            name="facebook"
          />
          <BrandText style={styles.text}>
            { Platform.OS === 'ios' ? buttonText : buttonText.toUpperCase() }
          </BrandText>
        </TouchableNative>
      </View>
    );
  }
}

FacebookButton.propTypes = propTypes;
FacebookButton.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    height: 40,
    backgroundColor: '#4267B2',
    ...Platform.select({
      ios: {
        borderRadius: 4,
      },
      android: {
        borderRadius: 2,
        elevation: 2,
      }
    })
  },
  icon: {
    fontSize: 24,
    color: 'white',
  },
  defaultIconMarginRight: {
    marginRight: 8,
  },
  text: {
    flex: 1,
    color: 'white',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontSize: 17,
      },
      android: {
        fontSize: 14,
        fontWeight: 'bold',
      }
    })
  },
  // disabled styles
  disabledContainer: {
    opacity: 0.3
  },
  disabled: {
    elevation: 0
  },
  // isRound styles
  isRoundBorderRadius: {
    borderRadius: 27,
  },
  isRoundIconPosition: {
    position: 'absolute',
    top: 8,
    left: 16,
  },
});

export default FacebookButton;
