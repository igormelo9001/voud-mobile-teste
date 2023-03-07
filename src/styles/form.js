// NPM imports
import { StyleSheet } from 'react-native';

// VouD imports
import { colors } from './constants';

// export const formDefaultStyles = {
//     textColor: colors.GRAY_DARKER,
//     tintColor: colors.BRAND_PRIMARY,
//     baseColor: colors.GRAY
// };

// export const formPrimaryStyles = {
//     textColor: 'white',
//     tintColor: colors.BRAND_SECONDARY,
//     baseColor: 'rgba(255,255,255,0.5)'
// };

const styles = StyleSheet.create({
    defaultTextStyles: {
        color: colors.GRAY_DARKER,
    },
    primaryTextStyles: {
        color: 'white'
    }
});

export const formDefaultStyles = {
    textColor: colors.GRAY_DARKER,
    highlightColor: colors.BRAND_PRIMARY,
    tintColor: colors.GRAY,
    textInputStyle: styles.defaultTextStyles,
    placeholderTextColor: colors.GRAY
};

export const formPrimaryStyles = {
    textColor: 'white',
    highlightColor: colors.BRAND_SECONDARY,
    tintColor: 'rgba(255,255,255,0.5)',
    textInputStyle: styles.primaryTextStyles,
    placeholderTextColor: 'rgba(255,255,255,0.5)'
};