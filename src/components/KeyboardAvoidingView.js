// NPM imports
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View
} from 'react-native';

// component
const VoudKeyboardAvoidingView = ({ children }) => {

    const Container = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
    const containerProps = Platform.OS === 'ios' ? { behavior: 'padding' } : {};

    return (
        <Container
            {...containerProps}
            style={styles.container}
        >
            {children}
        </Container>
    );
};

// styles
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default VoudKeyboardAvoidingView;
