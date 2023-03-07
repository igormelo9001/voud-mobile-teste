// NPM imports
import React, { Component } from 'react';
import { StyleSheet, BackHandler } from 'react-native';

// VouD imports
import FadeInView from './FadeInView';
import Loader from './Loader';
import { colors } from '../styles';

// Component
class LoadMask extends Component {

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this._backHandler);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
    }

    _backHandler = () => true;

    _getContainerStyles = () => {
        const { noLoader } = this.props;
        const containerStyles = [styles.container];
        if (noLoader) containerStyles.push(styles.noLoaderContainer)
        return StyleSheet.flatten(containerStyles);
    }

    render() {
        const { message, noLoader } = this.props;
        return (
            <FadeInView style={this._getContainerStyles()}>
                { noLoader || <Loader isLight text={message || 'Aguarde'}/> }
            </FadeInView>
        );
    }
}

// Styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        elevation: 10,
        backgroundColor: colors.OVERLAY_DARK
    },
    noLoaderContainer: {
        backgroundColor: colors.OVERLAY
    }
});

export default LoadMask;
