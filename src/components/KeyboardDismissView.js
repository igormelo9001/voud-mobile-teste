// NPM imports
import React from 'react';
import {
    Keyboard,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';

// component
const KeyboardDismissView = ({ style, children }) => {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={StyleSheet.flatten([styles.container, style])}>
                {children}
            </View>
        </TouchableWithoutFeedback>
    );
};

// styles
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default KeyboardDismissView;
