// NPM imports

import React, { Component } from 'react';
import { pipe } from 'ramda';
import {
  Dimensions,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

// VouD imports

import FadeInView from './FadeInView';
import { colors } from '../styles/constants';
import { appendIf } from '../utils/fp-util';

// Component

class Dialog extends Component {

  _getDialogContainerStyle = (baseStyle) => {
    const { withOverlay } = this.props;

    return pipe(
      () => [baseStyle],
      appendIf(styles.overlay, withOverlay),
      StyleSheet.flatten
    )();
  };

  _getDialogCardStyle = (baseStyle) => {
    const { noPadding } = this.props;

    return pipe(
      () => [baseStyle],
      appendIf(styles.noPadding, noPadding),
      StyleSheet.flatten
    )();
  };

  render() {
    const { children, onDismiss } = this.props;

    return (
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={this._getDialogContainerStyle(styles.mainContainer)}>
          <FadeInView>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={this._getDialogCardStyle(styles.dialogCard)}>
                {children}
              </View>
            </TouchableWithoutFeedback>
          </FadeInView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

// Styles
const styles = {
  mainContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 15,
  },
  overlay: {
    backgroundColor: colors.OVERLAY,
  },
  dialogCard: {
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 2,
    marginHorizontal: Dimensions.get('window').width >= 360 ? 40 : 24,
    maxHeight: Dimensions.get('window').height - 48,
    marginVertical: 24
  },
  touchableWrapper: {
    flex: 1,
  },
  noPadding: {
    padding: 0,
  }
}

export default Dialog;
