// NPM imports
import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  View
} from 'react-native';
import { pipe } from 'ramda';

// Component
const legalLogoImg = require('../../images/transport-cards/legal-lg.png');
import { appendIf } from '../../utils/fp-util';

class CartaoLegalContent extends Component {
  _getImageStyle = () => {
    const { small } = this.props;

    return pipe(
      () => styles.image,
      appendIf(styles.imageSmall, small),
      StyleSheet.flatten,
    )();
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={legalLogoImg}
          resizeMode="contain"
          style={this._getImageStyle()}
        />
      </View>
    );
  }
}

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 16,
  },
  image: {
    flex: 1,
  },
  imageSmall: {
    width: 84,
  }
});

export default CartaoLegalContent;
