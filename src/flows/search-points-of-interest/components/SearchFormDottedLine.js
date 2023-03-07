import React, { Component } from 'react';
import {
  Animated,
  Easing,
  StyleSheet
} from 'react-native';
import { colors } from '../../../styles';
import { TYPES } from './SwitchTypeSearch';

class SearchFormDottedLine extends Component {
  // TODO: Improve repetition
  constructor(props) {
    super(props);

    this.circleOpacity1 = new Animated.Value(0);
    this.circleOpacity2 = new Animated.Value(0);
    this.circleOpacity3 = new Animated.Value(0);
    this.circleOpacity4 = new Animated.Value(0);
    this.circleOpacity5 = new Animated.Value(0);

    this.circleDuration = 50;
  }

  componentDidMount() {
    if (this.props.startOnMount) {
      this.start();
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.selectedSearchType === TYPES.ROUTES) {
      this.start();
      return;
    }

    if (!this.props.startOnMount) {
      this.end();
    }
  }

  start() {
    Animated.sequence([
      Animated.timing(this.circleOpacity1, { toValue: 1, duration: this.circleDuration, easing: Easing.inOut(Easing.ease) }),
      Animated.timing(this.circleOpacity2, { toValue: 1, duration: this.circleDuration, easing: Easing.inOut(Easing.ease) }),
      Animated.timing(this.circleOpacity3, { toValue: 1, duration: this.circleDuration, easing: Easing.inOut(Easing.ease) }),
      Animated.timing(this.circleOpacity4, { toValue: 1, duration: this.circleDuration, easing: Easing.inOut(Easing.ease) }),
      Animated.timing(this.circleOpacity5, { toValue: 1, duration: this.circleDuration, easing: Easing.inOut(Easing.ease) }),
    ]).start();
  }

  end() {
    Animated.sequence([
      Animated.timing(this.circleOpacity5, { toValue: 0, duration: this.circleDuration, easing: Easing.inOut(Easing.ease) }),
      Animated.timing(this.circleOpacity4, { toValue: 0, duration: this.circleDuration, easing: Easing.inOut(Easing.ease) }),
      Animated.timing(this.circleOpacity3, { toValue: 0, duration: this.circleDuration, easing: Easing.inOut(Easing.ease) }),
      Animated.timing(this.circleOpacity2, { toValue: 0, duration: this.circleDuration, easing: Easing.inOut(Easing.ease) }),
      Animated.timing(this.circleOpacity1, { toValue: 0, duration: this.circleDuration, easing: Easing.inOut(Easing.ease) }),
    ]).start();
  }

  getCircleStyle = (animatedValue) => {
    return StyleSheet.flatten([
      styles.hrCircle,
      { opacity: animatedValue }
    ])
  }

  render() {
    return (
      <Animated.View style={StyleSheet.flatten([styles.hr, this.props.style])}>
        <Animated.View
          style={this.getCircleStyle(this.circleOpacity1)}
        />
        <Animated.View
          style={this.getCircleStyle(this.circleOpacity2)}
        />
        <Animated.View
          style={this.getCircleStyle(this.circleOpacity3)}
        />
        <Animated.View
          style={this.getCircleStyle(this.circleOpacity4)}
        />
        <Animated.View
          style={this.getCircleStyle(this.circleOpacity5)}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  hrCircle: {
    width: 2,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.BRAND_PRIMARY_LIGHTER,
    marginBottom: 4,
    opacity: 0,
  }
});

export default SearchFormDottedLine;
