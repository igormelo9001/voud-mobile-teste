// NPM imports
import React from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  View
} from 'react-native';
import { pipe, append } from 'ramda';

// VouD imports
import SystemText from '../SystemText';
import { colors } from '../../styles';
import { appendIf } from '../../utils/fp-util';

// constants
const TRANSPORT_CARD_FOOTER_HEIGHT = 40;

// images
const bomLogo = require('../../images/transport-cards/bom.png');

// component
const TransportCardFooter = ({ data, collapse, onHelp, small }) => {

  const opacity = collapse ?
    collapse.interpolate({
      inputRange: [0, 0.5],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    }) :
    1

  const height = collapse ?
    collapse.interpolate({
      inputRange: [0, 1],
      outputRange: [TRANSPORT_CARD_FOOTER_HEIGHT, 0]
    }) :
    TRANSPORT_CARD_FOOTER_HEIGHT;

  const animStyles = {
    opacity,
    height
  };

  const _getFooterContainerStyle = pipe(
    () => [styles.container],
    append(animStyles),
    appendIf(styles.containerSmall, small),
    StyleSheet.flatten
  );

  return (
    <Animated.View style={_getFooterContainerStyle()}>
      <View style={styles.footerTextContainer}>
        <SystemText style={styles.footerText}>
          {/* O saldo pode demorar até 48h para ser atualizado. Após a compra não se esqueça de validar os créditos. */}
          O saldo é atualizado em até 48h.
        </SystemText>
      </View>
      <Image
        source={bomLogo}
        style={styles.logo}
        resizeMode="contain"
      />
    </Animated.View>
  )
}

// styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  containerSmall: {
    paddingHorizontal: 10
  },
  footerTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    color: colors.GRAY_DARKER,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  helpButton: {
    backgroundColor: 'transparent'
  },
  helpIcon: {
    color: colors.BRAND_PRIMARY_LIGHTER,
    fontSize: 16
  },
  logo: {
    width: 48,
    marginLeft: 8
  }
});

export default TransportCardFooter;
