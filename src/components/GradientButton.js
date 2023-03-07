import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { colors } from '../styles';
import VoudTouchableOpacity from './TouchableOpacity';
import VoudText from './VoudText';

class GradientButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { large, text, onPress } = this.props; 
    return (
      <View style={StyleSheet.flatten([styles.buttonTouchable, large ? styles.largeButton : {}])}>
        <VoudTouchableOpacity
          onPress={onPress}
          borderless
        >
          <LinearGradient
            start={{x: 0, y: 1}}
            end={{x: 1, y: 0}}
            colors={[colors.BRAND_PRIMARY_DARKER, colors.BRAND_PRIMARY_LIGHTER]}
            style={StyleSheet.flatten([styles.button, large ? styles.largeButton : {}])}
          >
            <VoudText style={styles.buttonText}>{text}</VoudText>
          </LinearGradient>
        </VoudTouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonTouchable: {
    borderRadius: 18,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowRadius: 4,
    shadowOffset: {
      height: 0,
      width: 2,
    },
    elevation: 2,
  },
  button: {
    padding: 8,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  largeButton: {
    height: 48,
    borderRadius: 27,
  }
});

export default GradientButton;
