// NPM imports
import React, { Component } from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";

// Group imports
import Action from "./Action";
import Dots from "../Dots";
import { hasNotch } from "../../utils/has-notch";
import { dimensions } from "../../styles";

// component
class SwiperPagination extends Component {
  render() {
    const {
      index,
      total,
      prev,
      next,
      end,
      navByIndex,
      styleAction,
      styleDot,
      styleDotExternal
    } = this.props;

    const renderPrevAction = () => {
      if (total > 1 && index > 0) {
        return (
          <Action
            onPress={prev.action}
            text={prev.text}
            styleAction={styleAction}
          />
        );
      }

      return <View style={styles.prevAction} />;
    };

    const renderNextAction = () => {
      if (index + 1 === total) {
        return (
          <Action
            onPress={end.action}
            text={end.text}
            styleAction={styleAction}
          />
        );
      }

      return (
        <Action
          onPress={next.action}
          text={next.text}
          styleAction={styleAction}
        />
      );
    };

    return (
      <View style={styles.container}>
        <View style={styles.prevAction}>{renderPrevAction()}</View>
        <View style={styles.dotsContainer}>
          <Dots
            index={index}
            total={total}
            onDotPress={navByIndex}
            styleDot={styleDot}
            styleDotExternal={styleDotExternal}
          />
        </View>
        <View style={styles.nextAction}>{renderNextAction()}</View>
      </View>
    );
  }
}

// styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom:
      Platform.OS === "ios" || Platform.Version >= 21
        ? 0
        : StatusBar.currentHeight,
    left: 0,
    right: 0,
    height: 64,
    paddingHorizontal: 8,
    width: "100%",
    marginBottom: hasNotch() ? dimensions.notchSpace.top : 0
  },
  dotsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  prevAction: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  nextAction: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end"
  }
});

export default SwiperPagination;
