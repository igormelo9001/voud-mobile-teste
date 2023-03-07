// NPM imports
import React, { Component } from 'react';
import { Animated, StyleSheet } from 'react-native';

// VouD imports
import { colors } from '../styles';
import { TRANSPORT_CARD_COLLAPSED_HEIGHT, TRANSPORT_CARD_HEIGHT } from './TransportCard';

// Component
class ScreenWithCardHeader extends Component {

    constructor(props) {
        super(props);

        this._scrollDist = 200;
    }

    componentWillMount() {
        this._scrollY = new Animated.Value(0);

        this._collapse = this._scrollY.interpolate({
            inputRange: [0, this._scrollDist],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        });

        this._cardMargin = this._scrollY.interpolate({
            inputRange: [0, this._scrollDist],
            outputRange: [-TRANSPORT_CARD_HEIGHT/2, -TRANSPORT_CARD_COLLAPSED_HEIGHT/2],
            extrapolate: 'clamp'
        });

        this._extensionHeight = this._scrollY.interpolate({
            inputRange: [0, this._scrollDist],
            outputRange: [TRANSPORT_CARD_HEIGHT/2, TRANSPORT_CARD_COLLAPSED_HEIGHT/2],
            extrapolate: 'clamp'
        });
    }

    _renderExtension = () => {
        const animatedStyle = {
            height: this._extensionHeight
        };

        return <Animated.View style={StyleSheet.flatten([styles.headerExtension, animatedStyle])} />
    };
}

// Styles
const styles = StyleSheet.create({
    headerExtension: {
        backgroundColor: colors.BRAND_PRIMARY
    }
});

export default ScreenWithCardHeader;
