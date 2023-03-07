// NPM imports
import React from 'react';
import {
  Animated,
  Platform,
  StyleSheet
} from 'react-native';

// component
class SystemText extends React.Component {
  render() {
    const { style, children, ...props } = this.props;

    const getFontStyle = () => {
      return Platform.OS === 'ios' ? styles.iOS : styles.MD
    };
  
    return (
      <Animated.Text
        style={StyleSheet.flatten([getFontStyle(), style])}
        allowFontScaling={false}
        {...props}
      >
        {children}
      </Animated.Text>
    );
  }
}

// styles
const styles = {
  iOS: {
    // fontFamily: 'Helvetica Neue',
    fontFamily: 'Roboto',
    backgroundColor: 'transparent'
  },
  MD: {
    // fontFamily: 'sans-serif',
    fontFamily: 'Roboto',
    backgroundColor: 'transparent'
  }
};

export default SystemText;
