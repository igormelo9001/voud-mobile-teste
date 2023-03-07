// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  View,
  Keyboard
} from 'react-native';

// VouD imports
import BrandText from './BrandText';
import { colors } from '../styles/constants';
import { getLogoForBrand, getSupportedPaymentCardBrands, getSupportedPaymentCardBrandsScoo } from '../utils/payment-card';
import TouchableText from './TouchableText';
import { navigateToRoute } from '../redux/nav';
import { routeNames } from '../shared/route-names';
import { paymentCardTypes } from '../redux/financial';


// Component
const propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  cardType: PropTypes.string,
  right: PropTypes.func
};

const defaultProps = {
  style: {},
  cardType: '',
  right: null
};

class SupportedPaymentCardBrands extends Component {

  _goToSupportedBanksHelper = () => {
    const { dispatch } = this.props;
    Keyboard.dismiss();
    dispatch(navigateToRoute(routeNames.DEBIT_CARD_SUPPORTED_BANKS_HELPER_DIALOG));
  }

  _renderSupportedBanksButton = () => {
    return (
      <TouchableText
        onPress={this._goToSupportedBanksHelper}
        textStyle={styles.viewBanksText}
        minHeightAuto
      >
        Ver bancos
      </TouchableText>
    )
  }

  render() {
    const { cardType , paymentScoo} = this.props;
    const isDebit = cardType === paymentCardTypes.DEBIT;
    const paymentCardBrands = getSupportedPaymentCardBrands(isDebit);
    const paymentCardBrandsScoo = getSupportedPaymentCardBrandsScoo();

    return (
      <View style={styles.mainContainer}>
        <View style={isDebit ? styles.supportedDebitCardBrands : styles.supportedCreditCardBrands }>
          <BrandText style={styles.supportedCardBrandsLabel}>
            Bandeiras aceitas:
          </BrandText>
          {paymentScoo &&
           paymentCardBrandsScoo.map(brand => (
            <Image
              key={brand}
              source={getLogoForBrand(brand)}
              style={styles.supportedCardBrandImg}
            />
          ))
          }
          {!paymentScoo &&
            paymentCardBrands.map(brand => (
              <Image
                key={brand}
                source={getLogoForBrand(brand)}
                style={styles.supportedCardBrandImg}
              />
            ))
          }
        </View>
        { isDebit && this._renderSupportedBanksButton() }
      </View>
    );
  }
}

SupportedPaymentCardBrands.propTypes = propTypes;
SupportedPaymentCardBrands.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.GRAY_LIGHTER,
    alignItems: 'center'
  },
  supportedCreditCardBrands: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  supportedDebitCardBrands: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  supportedCardBrandsLabel: {
    color: colors.GRAY,
    fontSize: 12,
    lineHeight: 20
  },
  supportedCardBrandImg: {
    height: 24,
    width: 24,
    marginLeft: 8
  },
  viewBanksText: {
    fontSize: 12,
    lineHeight: 20,
    fontWeight: 'bold',
    color: colors.BRAND_PRIMARY,
  }
});



export default connect()(SupportedPaymentCardBrands);



