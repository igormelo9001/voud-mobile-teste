// NPM imports
import React                            from 'react';
import { StyleSheet } from 'react-native';

// VouD imports
import BrandText from '../../../components/BrandText';
import VoudTouchableOpacity from '../../../components/TouchableOpacity';

// component
const Action = ({ onPress, text, style }) => {
    return (
        <VoudTouchableOpacity
            onPress={onPress}
            style={StyleSheet.flatten([styles.button, style])}
        >
            <BrandText style={styles.text}>
                {text}
            </BrandText>
        </VoudTouchableOpacity>
    );
};

// styles
const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 32,
        paddingHorizontal: 8
    },
    text: {
        fontSize: 14,
        color: 'white'
    }
})

export default Action;
