import React          from 'react';
import { 
    View,
    StyleSheet
} from 'react-native';

// VouD imports
import BrandText from './BrandText';
import SystemText from './SystemText';
import { colors } from '../styles/constants';

// Component
const KeyValueItem = ({ keyContent, valueContent, style, useSysFontOnKey }) => {

    const _renderValue = () => {
        return <SystemText style={styles.text}>{valueContent}</SystemText>
    }

    const _renderKey = () => {
        let TextFont = useSysFontOnKey ? SystemText : BrandText;
        return <View style={styles.keyContainer}>
                    <TextFont style={styles.text}>{keyContent}</TextFont>
               </View>
    }

    return (
        <View
            style={StyleSheet.flatten([style, styles.mainContainer])}
        >
            { keyContent && keyContent.toString() ? _renderKey() : null }
            { valueContent && valueContent.toString() ? _renderValue() : null }
        </View>
    )
}

// Styles
const styles = {
    mainContainer: {
        flex: 1,
        flexDirection: 'row',
		paddingHorizontal: 16,
		paddingVertical: 14
    },
    keyContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    text: {
        color: colors.GRAY_DARKER,
        fontSize: 16,
        lineHeight: 20
    },
}

export default KeyValueItem;