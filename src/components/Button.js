// NPM imports
import React from 'react';
import { pipe } from 'ramda';

import {
    Platform,
    StyleSheet,
    View
} from 'react-native';

// VouD imports
import Icon from './Icon';
import BrandText from './BrandText';
import SystemText from './SystemText';
import TouchableNative from './TouchableNative';
import { colors } from '../styles';
import { appendIf } from '../utils/fp-util';

// component
const Button = ({ onPress, children, icon, outline, outlineText, gray, systemFont, sm, align, disabled, style, buttonStyle, textStyle }) => {
    const getContainerStyle = pipe(
        baseStyle => [baseStyle],
        appendIf(styles.disabledContainer, disabled),
        appendIf(style, style), // append style prop at the end, to override other styles
        StyleSheet.flatten
    );

    const getButtonStyle = pipe(
        baseStyle => [baseStyle],
        appendIf(styles.buttonIOS, Platform.OS === 'ios'),
        appendIf(styles.buttonMD, Platform.OS === 'android'),
        appendIf(styles.alignLeft, align === 'left'),
        appendIf(styles.disabled, disabled),
        appendIf(styles.outline, outline),
        appendIf(styles.outlineWhite, outline === 'white'),
        appendIf(styles.outlineGray, outline === 'gray'),
        appendIf(styles.outlinePrimary, outline === 'primary'),
        appendIf(styles.buttonSm, sm),
        appendIf(styles.buttonSmIOS, sm && Platform.OS === 'ios'),
        appendIf(styles.buttonSmMD, sm && Platform.OS === 'android'),
        appendIf(styles.buttonGray, gray),
        appendIf(buttonStyle, buttonStyle), // append buttonStyle prop at the end, to override other styles
        StyleSheet.flatten
    );

    const renderIcon = () => {
        if (icon) {
            const getIconStyle = pipe(
                baseStyle => [baseStyle],
                appendIf(styles.outlineIcon, outline),
                appendIf(styles.iconSm, sm),
                appendIf(styles.iconGray, gray),
                StyleSheet.flatten
            );

            const iconName = Array.isArray(icon) ? (Platform.OS === 'ios' ? icon[0] : icon[1]) : icon;

            return (
                <Icon
                    name={iconName}
                    style={getIconStyle(styles.icon)}
                />
            );
        }
    };

    const renderText = () => {
        const getTextStyle = pipe(
            baseStyle => [baseStyle],
            appendIf(styles.textIOS, Platform.OS === 'ios'),
            appendIf(styles.textMD, Platform.OS === 'android'),
            appendIf(styles.alignLeftText, align === 'left'),
            appendIf(styles.outlineText, outline),
            appendIf(styles.outlineTextPrimary, outline && outlineText === 'primary'),
            appendIf(styles.outlineTextGray, outline && outline === 'gray'),
            appendIf(styles.textSmIOS, sm && Platform.OS === 'ios'),
            appendIf(styles.textSmMD, sm && Platform.OS === 'android'),
            appendIf(styles.textGray, gray),
            appendIf(textStyle, textStyle), // append textStyle prop at the end, to override other styles
            StyleSheet.flatten
        );

        const text = Platform.OS === 'ios' ? children : toUpperCase(children);

        const TextComponent = systemFont? SystemText : BrandText;

        return <TextComponent style={getTextStyle(styles.text)}>{text}</TextComponent>;
    };

    const toUpperCase = message => {
        // will receive array if children has line break {'\n'}
        if (Array.isArray(message)) {
            return message.map(line => line.toUpperCase());
        }
        return message.toUpperCase();
    };

    return (
        <View testID="container-button" style={getContainerStyle(styles.container)}>
            <TouchableNative
                testID="actual-button-touchablenative" 
                onPress={() => { if (!disabled) onPress() }}
                style={getButtonStyle(styles.button)}>
                {renderIcon()}
                {renderText()}
            </TouchableNative>
        </View>
    )
}

export default Button;

// styles
const styles = StyleSheet.create({
    container: {

    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.BRAND_SECONDARY
    },
    icon: {
        fontSize: 24,
        color: colors.BRAND_PRIMARY,
        marginRight: 16
    },
    text: {
        textAlign: 'center',
        color: colors.BRAND_PRIMARY,
    },
    // iOS styles
    buttonIOS: {
        minHeight: 48,
        borderRadius: 4
    },
    textIOS: {
        fontSize: 17
    },
    // MD styles
    buttonMD: {
        minHeight: 36,
        borderRadius: 2,
        elevation: 2
    },
    textMD: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    // align modifiers
    alignLeft: {
        justifyContent: 'flex-start'
    },
    alignLeftText: {
        textAlign: 'left'
    },
    // outline modifiers
    outline: {
        borderWidth: 1,
        borderColor: colors.BRAND_SECONDARY,
        backgroundColor: 'transparent',
        elevation: 0
    },
    outlineWhite: {
        borderColor: 'white'
    },
    outlineGray: {
        borderColor: colors.GRAY_LIGHT2
    },
    outlinePrimary: {
        borderColor: colors.BRAND_PRIMARY
    },
    outlineText: {
        color: 'white'
    },
    outlineTextPrimary: {
        color: colors.BRAND_PRIMARY
    },
    outlineTextGray: {
        color: colors.GRAY,
    },
    outlineIcon: {
        color: 'white'
    },
    // gray modifiers
    textGray: {
        color: colors.GRAY
    },
    buttonGray: {
        backgroundColor: colors.GRAY_LIGHTER,
    },
    iconGray: {
        color: colors.GRAY
    },
    // size modifiers (SM)
    buttonSm: {
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    iconSm: {
        fontSize: 16,
        marginRight: 4
    },
    buttonSmIOS: {
        minHeight: 32,
        borderRadius: 2
    },
    textSmIOS: {
        fontSize: 12
    },
    buttonSmMD: {
        minHeight: 32
    },
    textSmMD: {
        fontSize: 11
    },
    // disabled modifiers
    disabledContainer: {
        opacity: 0.3
    },
    disabled: {
        elevation: 0
    }
});
