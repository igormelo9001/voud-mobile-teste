// NPM imports
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

// Group imports
import Dot from "./Dot";

// Component
class Dots extends Component {
  renderDots = () => {
    const { index, total, styleDot, styleDotExternal } = this.props;

    const dots = [];

    for (let i = 0; i < total; i++) {
      const dotStyle = i === 0 ? styles.firstDot : styles.dot;

      dots.push(
        <Dot
          key={i}
          active={index === i}
          onDotPress={() => {
            this.props.onDotPress && this.props.onDotPress(i);
          }}
          style={dotStyle}
          styleDot={styleDot}
          styleDotExternal={styleDotExternal}
        />
      );
    }
    return dots;
  };

  render() {
    const { style } = this.props;

    return (
      <View style={StyleSheet.flatten([styles.container, style])}>
        {this.renderDots()}
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 8
  },
  dot: {
    marginLeft: 8
  },
  firstDot: {
    marginLeft: 0
  }
});

export default Dots;
