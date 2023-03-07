// NPM imports
import React, { Component } from 'react';
import {
    Animated,
    StyleSheet
} from 'react-native';

// Component
class FadeInView extends Component {
    
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

        this._animStyle = {
            opacity: this._animOpacity,
            transform: [
                { translateY: this._animTop }
            ]
        };
    }

    componentWillMount() {
        Animated.timing(this._animValue, {
            toValue: 1,
            duration: 300
        }).start();
    }

    render() {
        const { style, children } = this.props;

        return (
            <Animated.View style={StyleSheet.flatten([style, this._animStyle])}>
                {children}
            </Animated.View>
        );
    }
}

export default FadeInView;
