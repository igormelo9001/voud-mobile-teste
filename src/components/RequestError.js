import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import VoudText from './VoudText';
import VoudTouchableOpacity from './TouchableOpacity';
import { colors } from '../styles';

class RequestError extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { error, onRetry, style } = this.props;
    return (
      <View style={StyleSheet.flatten([styles.error, style])}>
        <VoudText style={styles.errorMessage}>{error}</VoudText>
        <VoudTouchableOpacity
          onPress={onRetry}
        >
          <VoudText style={styles.errorRetry}>Tentar novamente.</VoudText>
        </VoudTouchableOpacity>
      </View>
    );
  }
}

// styles
const styles = StyleSheet.create({
  // error state
  error: {
    flex: 1,
    alignItems: 'stretch',
  },
  errorMessage: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    color: colors.GRAY_DARK,
  },
  errorRetry: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.BRAND_PRIMARY_DARKER,
  },
});

export default RequestError;
