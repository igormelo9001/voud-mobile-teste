// NPM imports
import React from 'react';
import { StyleSheet } from 'react-native';

// VouD imports
import Icon from './Icon';
import BrandText from './BrandText';
import TouchableNative from './TouchableNative';
import { colors } from '../styles';

// Component
const CheckBox = ({ children, style, checked, isLight, onPress }) => {

    const iconName = checked ? 'md-checkbox-outline' : 'md-checkbox-outline-blank';
    const iconStyle = [styles.icon];
    const textStyle = [styles.text];

    if (checked) {
       iconStyle.push([isLight? styles.iconCheckedLight : styles.iconChecked]);
       textStyle.push([isLight? styles.textLight : styles.textChecked]);
    } else {
        if (isLight) {
            iconStyle.push([styles.iconLight]);
            textStyle.push([styles.textLight]);
        }
    }

    return (
        <TouchableNative
            onPress={onPress}
            style={StyleSheet.flatten([styles.container, style])}
        >
            <Icon
                name={iconName}
                style={StyleSheet.flatten(iconStyle)}
            />
            <BrandText style={StyleSheet.flatten(textStyle)}>
                { children }
            </BrandText>
        </TouchableNative>
    )
};

// Styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    icon: {
        width: 24,
        fontSize: 24,
        textAlign: 'center',
        backgroundColor: 'transparent',
        color: colors.GRAY_DARKER,
        opacity: 0.5        
    },
    text: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: colors.GRAY_DARKER,
        opacity: 0.5        
    },
    textChecked: {
        color: colors.GRAY_DARKER,
        opacity: 1
    },
    iconChecked: {
        color: colors.BRAND_PRIMARY,
        opacity: 1
    },
    iconLight: {
        color: 'white',
        opacity: 1
    },
    textLight: {
        color: 'white',
        opacity: 1
    },      
    iconCheckedLight: {
        color: colors.BRAND_SECONDARY,
        opacity: 1
    }
});

export default CheckBox;
