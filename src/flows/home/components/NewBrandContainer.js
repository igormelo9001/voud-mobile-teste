// NPM imports
import React from 'react';
import {
    Image,
    StyleSheet,
    View,
} from 'react-native';

// VouD imports
import { colors } from '../../../styles';

// image
const bgImg = require('../../../images/bg.png');

import { getPaddingForNotch } from '../../../utils/is-iphone-with-notch';
import LinearGradient from 'react-native-linear-gradient';

// component
const NewBrandContainer = ({ bottomPos, style, children, shouldShowBgMountains = true, shouldBeGradient }) => {
  return (
    shouldBeGradient
    ? (
      <LinearGradient
        style={styles.container}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[ colors.BRAND_PRIMARY_DARKER, colors.BRAND_PRIMARY_LIGHT ]}
      >
        {
          shouldShowBgMountains
          && (
            <Image
              source={bgImg}
              style={StyleSheet.flatten([styles.brandBg, { bottom: bottomPos || 0 }])}
              resizeMode="stretch"
            />
          )
        }
        <View style={StyleSheet.flatten([styles.children, style])}>
            {children}
        </View>
      </LinearGradient>
    )
    : (
      <View style={
        StyleSheet.flatten([
          styles.container,
          styles.bgColor,
        ])
      }>
        {
          shouldShowBgMountains
          && (
            <Image
              source={bgImg}
              style={StyleSheet.flatten([styles.brandBg, { bottom: bottomPos || 0 }])}
              resizeMode="stretch"
            />
          )

        }
        <View style={StyleSheet.flatten([styles.children, style])}>
            {children}
        </View>
      </View>
    )
  )
};

// styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'flex-end',
    },
    bgColor: {
      backgroundColor: colors.BRAND_PRIMARY
    },
    contentContainer: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'flex-end'
    },
    brandBg: {
        width: null
    },
    children: {
      paddingTop: getPaddingForNotch(),
      paddingBottom: getPaddingForNotch(),
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
});

export default NewBrandContainer;
