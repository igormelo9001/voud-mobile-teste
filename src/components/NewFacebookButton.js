// NPM imports
import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

// VouD imports
import Icon from './Icon';
import VoudText from './VoudText';
import VoudTouchableOpacity from './TouchableOpacity';

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

class NewFacebookButton extends Component {
  render() {
    const { buttonText, disabled, onPress, style, isRound } = this.props;
    return (
      <View style={StyleSheet.flatten([style, disabled ? styles.disabledContainer : {}])}>
        <VoudTouchableOpacity
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
          <VoudText style={styles.text}>
            { buttonText }
          </VoudText>
        </VoudTouchableOpacity>
      </View>
    );
  }
}

NewFacebookButton.propTypes = propTypes;
NewFacebookButton.defaultProps = defaultProps;

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
    fontSize: 14,
    fontWeight: 'bold',
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
  // isRoundIconPosition: {
  //   position: 'absolute',
  //   top: 8,
  //   left: 16,
  // },
});

export default NewFacebookButton;
