// NPM imports
import React, { Component } from 'react';
import {
    Animated,
    StyleSheet
} from 'react-native';

// VouD imports
import BrandText from './BrandText';
import { colors } from '../styles';

// Component
class MessageBox extends Component {
    constructor(props) {
        super(props);

        this._animValue = new Animated.Value(0);

        this._animOpacity = this._animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });

        this._animTop = this._animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [24, 0]
        });
    }

    componentWillMount() {
        Animated.timing(this._animValue, {
            toValue: 1,
            duration: 500
        }).start();
    }

    render() {
        const { message, style } = this.props;

        const animStyle = {
            opacity: this._animOpacity,
            transform: [
                { translateY: this._animTop }
            ]
        };

        return (
            <Animated.View style={StyleSheet.flatten([styles.container, style, animStyle])}>
                <BrandText style={styles.text}>
                    {message}
                </BrandText>
            </Animated.View>
        );
    }
}

// Styles
const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        padding: 8,
        borderRadius: 2,
        backgroundColor: colors.BRAND_ERROR
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        color: 'white'
    }
});

export default MessageBox;
