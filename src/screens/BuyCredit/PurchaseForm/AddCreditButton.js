// NPM imports
import React from 'react';

import {
    StyleSheet,
} from 'react-native';

// VouD imports
import SystemText from '../../../components/SystemText';
import TouchableNative from '../../../components/TouchableNative';
import { colors } from '../../../styles';

// component
const AddCreditButton = ({ onPress, children, style, styleText }) => {

    const getButtonStyle = () => {
        return StyleSheet.flatten([style, styles.button]);
    };

    return (
        <TouchableNative
            onPress={onPress}
            style={getButtonStyle()}
            disablePreventDoubleTap
        >
            <SystemText style={StyleSheet.flatten([styles.text, styleText]) }>
                {children}
            </SystemText>
        </TouchableNative>
    )
}

export default AddCreditButton;

// styles
const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 4,
        minHeight: 48,
        borderWidth: 1,
        // borderColor: colors.GRAY_LIGHT2,
        backgroundColor: 'transparent',
        elevation: 0
    },
    text: {
        textAlign: 'center',
        // color: colors.BRAND_PRIMARY_LIGHTER,
        color: "#C0C0C0",
        fontSize: 18
    }
});
