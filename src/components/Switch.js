// NPM imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';

// VouD imports
import TouchableNative from './TouchableNative';
import { colors } from '../styles/constants';

// Component
const propTypes = {
  checked: PropTypes.bool,
  onPress: PropTypes.func,
  viewOnly: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

const defaultProps = {
  checked: false,
  onPress: () => {},
  viewOnly: false,
  style: {},
};

class Switch extends Component {
  constructor(props) {
    super(props);

    this._animValue = new Animated.Value(props.checked ? 1 : 0);

    this._trackColor = this._animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.GRAY_LIGHTER, colors.BRAND_SUCCESS_LIGHT],
    });

    this._knobLeft = this._animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [4, 20],
    });

    this._knobColor = this._animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.GRAY_LIGHT, colors.BRAND_SUCCESS],
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.checked !== prevProps.checked) {
      this._anim();
    }
  }

  _anim = () => {
    Animated.timing(this._animValue, {
      toValue: this.props.checked ? 1 : 0,
      duration: 200
    }).start();
  };

  _renderSwitch = () => {
    const { style } = this.props;

    const knobAnimStyle = {
      backgroundColor: this._knobColor,
      left: this._knobLeft,
    };

    const trackAnimStyle = {
      backgroundColor: this._trackColor,
    };

    return (
      <View style={StyleSheet.flatten([styles.container, style])}>
        <Animated.View style={StyleSheet.flatten([styles.track, trackAnimStyle])} />
        <Animated.View style={StyleSheet.flatten([styles.knob, knobAnimStyle])} />
      </View>
    );
  };

  render() {
    const { viewOnly, onPress } = this.props;

    return viewOnly ?
      this._renderSwitch() :
      (
        <TouchableNative
          onPress={onPress}
          borderless
        >
          {this._renderSwitch()}
        </TouchableNative>
      );
  }
}

Switch.propTypes = propTypes;
Switch.defaultProps = defaultProps;

// Style
const styles = StyleSheet.flatten({
  container: {
    justifyContent: 'center',
    width: 40,
    height: 24,
    padding: 8,
  },
  track: {
    alignSelf: 'stretch',
    height: 8,
    borderRadius: 4,
    // backgroundColor: colors.GRAY_LIGHT, // background color set by anim value
  },
  knob: {
    position: 'absolute',
    top: 4,
    // left: 0, // left set by anim value
    width: 16,
    height: 16,
    borderRadius: 8,
    // backgroundColor: colors.GRAY_LIGHTER, // background color set by anim value
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});

export default Switch;
