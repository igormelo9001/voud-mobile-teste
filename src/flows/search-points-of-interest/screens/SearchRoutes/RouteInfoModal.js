import React, { Component } from 'react';
import { StyleSheet, Linking, Image } from 'react-native';
import PropTypes from 'prop-types';

import VoudText from '../../../../components/VoudText';
import { colors } from '../../../../styles';
import { GAEventParams, GATrackEvent } from '../../../../shared/analytics';
import GradientButton from '../../../../components/GradientButton';
import InfoModal from '../../../../components/InfoModal';

const googleMapsImg = require('../../../../images/google-maps.png');

const propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

class RouteInfoModal extends Component {
  constructor(props) {
    super(props);
  }

  _openRouteOnMaps = async () => {
    const { origin, destination, onDismiss } = this.props;
    const queryUrl = `https://www.google.com/maps/dir/?api=1&travelmode=transit&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;

    Linking.canOpenURL(queryUrl).then(async (supported) => {
      if (!supported) {
        if (__DEV__) console.tron.log('Can\'t handle url: ' + queryUrl, true);
      } else {
        const { categories: { BUTTON }, actions: { CLICK }, labels: { OPEN_GOOGLE_MAPS_ROUTE } } = GAEventParams;
        GATrackEvent(BUTTON, CLICK, `${OPEN_GOOGLE_MAPS_ROUTE} ${origin} ${destination}`);
        await Linking.openURL(queryUrl);

        onDismiss && onDismiss();
      }
    }).catch(err => {
      if (__DEV__) console.tron.log('An error occurred: ' + err.message, true);
    });
  };

  render() {
    const { isVisible, onDismiss } = this.props;

    return (
      <InfoModal
        isVisible={isVisible}
        onDismiss={onDismiss}
      >
        <Image 
          style={styles.googleMapsImg}
          source={googleMapsImg}
          resizeMode="contain"
        />
        <VoudText style={styles.infoTitle}>Inicie sua navegação</VoudText>
        <VoudText style={styles.infoText}>
          Ao clicar em prosseguir, você será direcionado para o Google Maps, onde você poderá escolher e navegar ao vivo pela sua rota escolhida.
        </VoudText>
        <GradientButton
          large
          text="Prosseguir"
          onPress={this._openRouteOnMaps}
        />
      </InfoModal>
    );
  }
}

RouteInfoModal.propTypes = propTypes;

// Styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 40,
    paddingTop: 8,
    paddingBottom: 16, 
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: {
      height: -2,
      width: 0,
    },
    elevation: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.GRAY_LIGHT,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 42,
  },
  infoTitle: {
    color: colors.BRAND_PRIMARY_DARKER,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoText: {
    color: colors.GRAY_DARK,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 32,
  },
  googleMapsImg: {
    height: 192,
  }
});

export default RouteInfoModal;
