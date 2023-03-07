// NPM imports
import React from 'react';
import {
    Platform,
    StyleSheet,
    Text
} from 'react-native';

// component
const BrandText = ({ style, children, ...props }) => {
    /**
     * React Native lacks support for custom fonts in Android.
     * in order to light weight fonts work on Android, we need to change the font family (and not the fontWeight prop)
     * and pass the light font name, as it was a different font family than the one we are using
     */
    const getFontStyle = () => {
        if (style && style.fontWeight) {
            const { fontWeight } = style;
            if (Platform.OS === 'android' && (fontWeight === 'light' || fontWeight === '100' || fontWeight === '200')) {
                return styles.light;
            }
        }

        return styles.default;
    };

    return (
        <Text
            style={StyleSheet.flatten([ getFontStyle(), style ])}
            allowFontScaling={false}
            {...props}
        >
            {children}
        </Text>
    )
};

// styles
const styles = {
    default: {
        fontFamily: 'Raleway',
        backgroundColor: 'transparent'
    },
    light: {
        fontFamily: 'Raleway_light',
        backgroundColor: 'transparent'
    }
};

export default BrandText;
