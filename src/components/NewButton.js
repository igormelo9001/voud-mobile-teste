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
import SystemText from './SystemText';
import { colors } from '../styles';
import { appendIf } from '../utils/fp-util';
import LinearGradient from 'react-native-linear-gradient';
import VoudText from './VoudText';
import VoudTouchableOpacity from './TouchableOpacity';

// component
const NewButton = ({ onPress, children, icon, outline, outlineText, gray, systemFont, sm, align, disabled, style, buttonStyle }) => {
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
            // appendIf(styles.textIOS, Platform.OS === 'ios'),
            appendIf(styles.textMD, Platform.OS === 'android' || Platform.OS === 'ios'),
            appendIf(styles.alignLeftText, align === 'left'),
            appendIf(styles.outlineText, outline),
            appendIf(styles.outlineTextPrimary, outline && outlineText === 'primary'),
            appendIf(styles.outlineTextGray, outline && outline === 'gray'),
            appendIf(styles.textSmIOS, sm && Platform.OS === 'ios'),
            appendIf(styles.textSmMD, sm && Platform.OS === 'android'),
            appendIf(styles.textGray, gray),
            StyleSheet.flatten
        );

        const TextComponent = systemFont? SystemText : VoudText;

        return <TextComponent style={getTextStyle(styles.text)}>{children}</TextComponent>;        
    };

    const TouchableContainer  = disabled ? View : VoudTouchableOpacity;

    return (
        <View style={getContainerStyle(styles.container)}>
          <TouchableContainer
            onPress={() => { if (!disabled) onPress() }}
          >
            <LinearGradient
              style={getButtonStyle(styles.button)}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={[ colors.CARD_E, colors.BRAND_SECONDARY_DARKER ]}
            >
              {renderIcon()}
              {renderText()}
            </LinearGradient>
          </TouchableContainer>
        </View>
    )
}

export default NewButton;

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
    },
    icon: {
        fontSize: 24,
        color: colors.BRAND_PRIMARY,
        marginRight: 16
    },
    text: {
        textAlign: 'center',
        color: colors.BRAND_PRIMARY
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
