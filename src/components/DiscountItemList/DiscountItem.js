// NPM imports
import React, { Component, Fragment } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

// VouD Imports
import BrandText from '../BrandText';
import SystemText from '../SystemText';
import { colors } from '../../styles';
import { exemptionTypes } from '../../redux/payment-method';

// Component
const propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string.isRequired,
    expirationDate: PropTypes.string,
  }).isRequired
};

class DiscountItem extends Component {
  render() {
    const { data } = this.props;

    return (
      <Fragment>
        {
          data.type === exemptionTypes.TIME &&
          <View style={styles.discountItem}>
            <BrandText style={styles.discountDesc}>
              Isenção válida até:
            </BrandText>
            <SystemText style={styles.discountDate}>
              {moment(data.expirationDate).format('DD/MM/YYYY')}
            </SystemText>
          </View>
        }
        {
          data.type === exemptionTypes.QUANTITY &&
          <BrandText style={styles.firstPurchaseExemption}>
            {`Você foi convidado a experimentar o VouD e poderá fazer ${data.quantity && data.quantity > 1 ? `nas próximas ${data.quantity} recargas` : 'a primera recarga'} com isenção de tarifa. Aproveite!`}
          </BrandText>
        }
      </Fragment>
    )
  }
}

// proptypes
DiscountItem.propTypes = propTypes;

// styles
const styles = StyleSheet.create({
  discountItem: {
    backgroundColor: colors.GRAY_LIGHTER,
    padding: 16,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  discountDesc: {
    fontSize: 14,
    fontWeight: '300'
  },
  discountDate: {
    fontSize: 14,
    color: colors.BRAND_PRIMARY_LIGHTER
  },
  firstPurchaseExemption: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.GRAY,
    marginHorizontal: 16,
  }
});

export default DiscountItem;