import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import VoudText from '../../../../../components/VoudText';

const styles = StyleSheet.create({
  priceWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  currency: {
    fontSize: 10,
    marginRight: 2,
    fontWeight: 'bold'
  },
  price: {
    fontSize: 10,
    fontWeight: 'bold'
  },
});

export class FareWrapper extends Component {
  _formatFare(fare) {
    if(!fare) return '-';
    return String(fare.value.toFixed(2)).replace('.',',');
  }
  
  render() {
    const { fare, currency } = this.props;

    return (
      <View style={styles.priceWrapper}>
        <VoudText style={styles.currency}>
          { currency }
        </VoudText>
        <VoudText style={styles.price}>
          {this._formatFare(fare)}
        </VoudText>
      </View>
    )
  }
}

export default FareWrapper
