import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { logout } from '../../../redux/login';
import { openSupportEmail } from '../../../utils/mailto-util';
import { GATrackEvent, GAEventParams } from '../../../shared/analytics';

import styles from './style';
import BrandText from '../../../components/BrandText';
import Button from '../../../components/Button';

const imageCardVerify = require('../image/cardVerify.png');

class UserBlockedView extends Component {
  handlerClose = () => {
    const { dispatch } = this.props;
    dispatch(logout());
  };

  openSupportEmailUrl = () => {
    // Open mailto
    openSupportEmail({
      name: '',
      lastName: '',
      email: '',
    });

    // Dispatch GATrackEvent for support
    const {
      categories: { BUTTON },
      actions: { CLICK },
      labels: { USER_BLOCKED_SUPORT },
    } = GAEventParams;
    GATrackEvent(BUTTON, CLICK, USER_BLOCKED_SUPORT);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <BrandText style={styles.title}>Bloqueio preventivo</BrandText>
          <View style={styles.image}>
            <Image source={imageCardVerify} />
          </View>
        </View>
        <View style={styles.contianerDescription}>
          <BrandText style={styles.description}>Sua conta foi bloqueada temporariamente</BrandText>
          <BrandText style={styles.description}>
            por segurança. Para mais informações entre
          </BrandText>
          <BrandText style={styles.description}>em contato através do nosso suporte.</BrandText>
        </View>
        <View style={styles.containerButton}>
          <Button buttonStyle={styles.button} onPress={this.handlerClose}>
            FECHAR
          </Button>
          <TouchableOpacity onPress={this.openSupportEmailUrl}>
            <View style={styles.containerSupport}>
              <BrandText style={styles.textSupport}>FALE CONOSCO</BrandText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export const UserBlocked = connect(null)(UserBlockedView);
