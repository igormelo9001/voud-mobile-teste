// NPM imports
import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// VouD imports
import { colors } from '../styles';

// Component
const propTypes = {
  renderMask: PropTypes.func,
  duration: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

const defaultProps = {
  renderMask: null,
  duration: 1000,
  style: {},
};

class ContentPlaceholder extends React.Component {
  constructor(props) {
    super(props);

    const { duration } = props;

    const animValue = new Animated.Value(0);

    this.state = {
      gradientAnimStyle: {
        transform: [
          {
            translateX: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['-50%', '50%'],
            }),
          },
        ],
        opacity: animValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 1, 0],
        }),
      },
    };

    Animated.loop(
      Animated.timing(animValue, {
        toValue: 1,
        easing: Easing.out(Easing.sin),
        duration,
        useNativeDriver: true,
      })
    ).start();
  }

  render() {
    const { renderMask, style } = this.props;
    const { gradientAnimStyle } = this.state;

    return (
      <View style={StyleSheet.flatten([styles.container, style])}>
        <Animated.View style={StyleSheet.flatten([styles.gradientContainer, gradientAnimStyle])}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            locations={[0.1, 0.5, 0.9]}
            colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.15)', 'rgba(0, 0, 0, 0)']}
            style={styles.gradientElement}
          />
        </Animated.View>
        {
          /*
          renderMask will place a view absolute positioned over the placeholder box
          use this function to draw some shapes over the placeholder
          (reference https://cloudcannon.com/deconstructions/2014/11/15/facebook-content-placeholder-deconstruction.html)
          */
          renderMask && (
            <View style={styles.maskContainer}>
              {renderMask()}
            </View>
          )
        }
      </View>
    );
  }
}

ContentPlaceholder.propTypes = propTypes;
ContentPlaceholder.defaultProps = defaultProps;

// styles
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.GRAY_LIGHTER,
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  gradientElement: {
    flex: 1,
    alignSelf: 'stretch',
  },
  maskContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});

export default ContentPlaceholder;
