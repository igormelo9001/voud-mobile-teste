// NPM imports
import React, { Component } from 'react';
import {
    Animated,
    Easing,
    Image,
    StyleSheet
} from 'react-native';

// Image
const loaderImg = require('../images/load-spinner.png');
const loaderImgLight = require('../images/load-spinner-white.png');

// Component
class Spinner extends Component {

    constructor(props) {
        super(props);

        this._animValue = new Animated.Value(0);

        this._rotateValue = this._animValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });
    }

    componentWillMount() {
        Animated.loop(
            Animated.timing(this._animValue, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            })
        ).start();
    }

    _getLoaderImage() {
        return this.props.isLight ? loaderImgLight : loaderImg;
    }

    _getIconSize() {
        let size = this.props.iconSize;
        if (size) {
            return {
                height: size,
                width: size
            };
        } else {
            return {};
        }
    }

    render() {
        const animStyle = {
            transform: [
                { rotate: this._rotateValue }
            ]
        };

        return (
            <Animated.View style={StyleSheet.flatten([this.props.style, styles.loaderWrapper, animStyle])}>
                <Image source={this._getLoaderImage()} style={this._getIconSize()} />
            </Animated.View>
        );
    }
}

// Styles
const styles = StyleSheet.create({
    loaderWrapper: {
        alignSelf: 'center'
    }
});

export default Spinner;