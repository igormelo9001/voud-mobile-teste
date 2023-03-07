// NPM imports
import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';

// VouD imports
import BrandText from '../../components/BrandText';
import { colors } from '../../styles';
import { getStatusBarHeight } from '../../styles/util';

// images TODO: remove static images
// const onboardingVoudImg = require('../../images/onboarding-voud.png');
// const onboardingMobilityServices = require('../../images/onboarding-mobility-services.png');
// const onboardingPhoneRecharge = require('../../images/onboarding-phone-recharge.png');

const onboardingVoudImg = require('../../images/onboarding-voud-new.png');
const onboardingTransportImg = require('../../images/onboarding-transport.png');
const onboardingPatineteImg = require('../../images/onboarding-patinete.png');
const onboardingMobilityServices = require('../../images/onboarding-mobility-services-new.png');

const images = {
  voud: onboardingVoudImg,
  transport: onboardingTransportImg,
  patinete: onboardingPatineteImg,
  mobilityServices: onboardingMobilityServices,
};

class OnboardingSlide extends Component {
  render() {
    const { content, image } = this.props;

    return (
      <View style={styles.container}>
        <Image source={images[image]} style={styles.image} resizeMode="contain" />
        <BrandText style={styles.text}>{content}</BrandText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: getStatusBarHeight() + 56,
    paddingHorizontal: 40,
    backgroundColor: colors.BRAND_PRIMARY,
  },
  image: {
    height: 240,
    marginBottom: 32,
  },
  text: {
    alignSelf: 'stretch',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: 'white',
  },
});

export default OnboardingSlide;
