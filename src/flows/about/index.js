// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';

import {
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native';
import { colors } from '../../styles';

// VouD imports
import Header, { headerActionTypes } from '../../components/Header';
import VoudText from '../../components/VoudText';
const voudLogo = require('../../images/logo-voud-icon.png');

// Screen component
class AboutView extends Component {

    _back = () => {
        this.props.dispatch(NavigationActions.back());
    };

    render() {

        return (
            <View style={styles.container}>
                <Header
                    title="Voud"
                    left={{
                        type: headerActionTypes.CLOSE,
                        onPress: this._back
                    }}
                />
                <View
                    style={styles.scrollView}
                    keyboardShouldPersistTaps="always">
                    
                        <Image source={voudLogo}/>
                        <VoudText style={[styles.title, styles.titleCenter]}>{`Voud para ${DeviceInfo.getSystemName()}`}</VoudText>
                        <VoudText style={styles.description}>{`Versão ${DeviceInfo.getVersion()}`}</VoudText>
                        <VoudText style={styles.footer}>{`Todos os direitos reservados | AUTOPASS - 2019`}</VoudText>                    
                
                    
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        color: colors.BRAND_PRIMARY_LIGHT,
        fontWeight: 'bold',
        paddingLeft: 16
    },
    titleCenter: {
        textAlign: 'center',
        paddingLeft: 0
    },
    description :{
        fontSize: 23,
        color: colors.GRAY,
        textAlign: 'center',
    }, 
    footer :{
        fontSize: 14,
        color: colors.GRAY,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 16,
    },
});

// Redux
const mapStateToProps = (state) => {
    return {
    }
};

export const About = connect(mapStateToProps)(AboutView);
