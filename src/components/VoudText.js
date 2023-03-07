// NPM imports
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text
} from 'react-native';

// component
const VoudText = ({ style, children, ...props }) => {
  /**
   * React Native lacks support for custom fonts in Android.
   * in order to light weight fonts work on Android, we need to change the font family (and not the fontWeight prop)
   * and pass the light font name, as it was a different font family than the one we are using
   */
  const getFontStyle = () => {
    if (style && style.fontWeight) {
      const { fontWeight } = style;

      if (fontWeight === 'light' || fontWeight === '100' || fontWeight === '200') {
        return styles.light;
      }

      if (fontWeight === '600') {
        return styles.semibold;
      }

      if (fontWeight === 'bold') {
        return styles.bold;
      }
    }

    return styles.default;
  };

  return (
    <Text
      style={StyleSheet.flatten([getFontStyle(), style])}
      allowFontScaling={false}
      {...props}
    >
      {children}
    </Text>
  )
};

// styles
const styles = StyleSheet.create({
  default: {
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
    ...Platform.select({
      android: {
        fontFamily: 'opensans'
      }
    })
  },
  light: {
    fontFamily: 'OpenSans-Light',
    backgroundColor: 'transparent',
    ...Platform.select({
      android: {
        fontFamily: 'opensans_light'
      }
    })
  },
  bold: {
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
    ...Platform.select({
      android: {
        fontFamily: 'opensans_bold'
      }
    })
  },
  semibold: {
    fontFamily: 'OpenSans-SemiBold',
    backgroundColor: 'transparent',
    ...Platform.select({
      android: {
        fontFamily: 'opensans_semibold'
      }
    })
  }
});

export default VoudText;
