// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import {
  Image,
  View,
  StyleSheet
} from 'react-native';

import VoudTextField from './TextField';
import { colors } from '../styles';
import { getLogoForBrand, identifyCardBrand, getPaymentCardFieldMaxLength } from '../utils/payment-card';
import { getPaymentCardBrandPattern } from '../redux/selectors';

//consts
const paymentCardPlaceholder = require('../images/payment-card-placeholder.png');
const paymentCardPlaceholderError = require('../images/payment-card-placeholder-error.png');

// component

class PaymentCardNumberField extends Component {

  componentDidUpdate(prevProps) {
    const { dispatch, input: { value }, paymentCardBrandPattern, reduxFormName, cardBrandFieldName, isDebit } = this.props;
    const prevCardBrand = prevProps.cardBrand;
    const cardBrand = identifyCardBrand(paymentCardBrandPattern, value, isDebit);

    if (prevCardBrand !== cardBrand) {
      dispatch(change(reduxFormName, cardBrandFieldName, cardBrand))
    }
  }

  _renderCardBrand = (maxLength) => {
    const { input: { value }, meta, cardBrand } = this.props;
    const inputValue = value ? value.toString() : '';
    const maxLengthReached = maxLength ? inputValue.length >= maxLength : false;

    if (cardBrand !== '') {
      return <Image style={styles.cardBrandImg} source={getLogoForBrand(cardBrand)} />;
    }

    const placeholderSource = (maxLengthReached || meta.touched) && !meta.valid ? paymentCardPlaceholderError : paymentCardPlaceholder;
    return <Image style={styles.cardBrandPlaceholder} source={placeholderSource} />;
  }

  _renderRight = (maxLength) => {
    return (
      <View style={styles.cardBrandContainer}>
        {this._renderCardBrand(maxLength)}
      </View>
    );
  }

  render() {
    const { paymentCardBrandPattern, cardBrand } = this.props;
    const maxLength = getPaymentCardFieldMaxLength(paymentCardBrandPattern, cardBrand);
    return (
      <VoudTextField
        {...this.props}
        right={() => this._renderRight(maxLength)}
        maxLength={maxLength}
      />
    );
  }

}

// Styles
const styles = StyleSheet.create({
  unsupportedCardBrand: {
    borderColor: colors.BRAND_ERROR
  },
  cardBrandContainer: {
    marginTop: -8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBrandImg: {
    width: 32,
    height: 32,
  },
  cardBrandPlaceholder: {
    width: 32,
    height: 24,
  }
});

// Redux
const mapStateToProps = (state) => {
  return {
    paymentCardBrandPattern: getPaymentCardBrandPattern(state),
  };
};

export default connect(mapStateToProps)(PaymentCardNumberField);