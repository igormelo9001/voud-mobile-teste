// NPM imports
import React from "react";
import PropTypes from "prop-types";
import { Animated, StyleSheet, View } from "react-native";

// VouD imports
import { colors } from "../../styles";
import TouchableNative from "../TouchableNative";

// Component
const propTypes = {
  active: PropTypes.bool,
  onDotPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  styleDot: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  styleDotExternal: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
};

const defaultProps = {
  active: false,
  onDotPress: () => {},
  style: {},
  styleDot: {},
  styleDotExternal: {}
};

class Dot extends React.Component {
  constructor(props) {
    super(props);

    this.activeAnimValue = new Animated.Value(props.active ? 1 : 0);

    const animBorderRadius = this.activeAnimValue.interpolate({
      inputRange: [0, 1],
      outputRange: [3, 8]
    });

    const animPosition = this.activeAnimValue.interpolate({
      inputRange: [0, 1],
      outputRange: [5, 0]
    });

    const animSize = this.activeAnimValue.interpolate({
      inputRange: [0, 1],
      outputRange: [6, 16]
    });

    this.animatedStyle = {
      top: animPosition,
      left: animPosition,
      width: animSize,
      height: animSize,
      borderRadius: animBorderRadius
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.active !== this.props.active) {
      Animated.timing(this.activeAnimValue, {
        toValue: this.props.active ? 1 : 0,
        duration: 250
      }).start();
    }
  }

  render() {
    const { style, onDotPress, styleDot, styleDotExternal } = this.props;

    return (
      <TouchableNative
        onPress={onDotPress}
        style={StyleSheet.flatten([styles.dotContainer, style])}
      >
        <Animated.View
          style={StyleSheet.flatten([styleDotExternal, this.animatedStyle])}
        />
        <View style={StyleSheet.flatten([styles.dot, styleDot])} />
      </TouchableNative>
    );
  }
}

Dot.propTypes = propTypes;
Dot.defaultProps = defaultProps;

// styles
const styles = StyleSheet.create({
  dotContainer: {
    width: 16,
    height: 16
  },
  dotExternal: {
    // position: "absolute",
    // backgroundColor: colors.BRAND_SECONDARY
  },
  dot: {
    position: "absolute",
    top: 4,
    left: 4,
    width: 8,
    height: 8,
    borderRadius: 4
    // backgroundColor: "white"
  }
});

export default Dot;
