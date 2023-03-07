import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

// VouD Imports
import DiscountItem from './DiscountItem';
import BrandText from '../BrandText';
import Loader from '../Loader';
import { colors } from '../../styles';
import TouchableText from '../TouchableText';

// propTypes
const propTypes = {
  activeDiscounts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
}

class DiscountItemList extends Component {
  render() {
    const { activeDiscounts, isFetching, error, onRetry } = this.props;

    return (
      <View>
        {/* =========================== */}
        {/* ====== LOADING STATE ====== */}
        {/* =========================== */}
        {
          isFetching &&
          <View style={styles.discountItemListLoading}>
            <Loader iconSize={16} />
          </View>
        }

        {/* =========================== */}
        {/* ======= ERROR STATE ======= */}
        {/* =========================== */}
        {
          !isFetching &&
          error.length > 0 &&
          <TouchableText textStyle={styles.discountItemListErrorText} onPress={onRetry}>
            Ocorreu um erro ao carregar seus descontos e isenções ativas.{' '}
            <BrandText style={styles.discountItemListErrorTryAgain}>
              Tentar novamente
            </BrandText>
          </TouchableText>
        }

        {/* =========================== */}
        {/* ====== NORMAL STATE ======= */}
        {/* =========================== */}
        {
          activeDiscounts.length > 0 &&
          !isFetching &&
          error.length === 0 &&
          activeDiscounts.map((activeDiscount) => (
            <DiscountItem
              data={activeDiscount}
              key={activeDiscount.expirationDate + activeDiscount.type}
              style={styles.discountItem}
            />
          ))
        }
      </View>
    )
  }
}

DiscountItemList.propTypes = propTypes;

// styles
const styles = StyleSheet.create({
  discountItemListLoading: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  discountItemListErrorText: {
    color: colors.BRAND_ERROR,
    textAlign: 'center'
  },
  discountItemListErrorTryAgain: {

    textDecorationLine: 'underline',
  },
  discountItem: {
    marginBottom: 16,
  }
});

export default DiscountItemList;