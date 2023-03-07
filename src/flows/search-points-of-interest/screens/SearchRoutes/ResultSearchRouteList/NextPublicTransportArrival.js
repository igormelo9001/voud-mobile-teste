import React, { Component } from 'react'
import { StyleSheet } from 'react-native'

import VoudText from '../../../../../components/VoudText';

import getTimeUntilNextPublicTransportArrival from '../../../utils/get-time-until-next-public-transport-arrival';
import getVehicleType from '../../../utils/get-vehicle-type';
import { colors } from '../../../../../styles';

const styles = StyleSheet.create({
  labelText: {
    fontSize:10,
    color: colors.GRAY,
  },
  labelTextBold: {
    fontSize:10,
    color: colors.GRAY,
    fontWeight: 'bold',
  },
  highlightedLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6bb400',
  },
});

export class NextPublicTransportArrival extends Component {
  render() {
    const { step } = this.props;
    const { transitDetails } = step;
    const { 
      departureStop: { name },
      departureTime,
    } = transitDetails
    const timeUntilNextPublicTransportArrival = getTimeUntilNextPublicTransportArrival(departureTime);
    const vehicleType = getVehicleType(step);
    return (
      <VoudText numberOfLines={2} ellipsizeMode={'tail'}>
        <VoudText style={styles.labelText}>{`Próximo ${vehicleType} em `}</VoudText>
        <VoudText style={styles.highlightedLabelText}>{timeUntilNextPublicTransportArrival > 0 ? `${timeUntilNextPublicTransportArrival} min` : '1 min'}</VoudText>
        <VoudText style={styles.labelText}>{' em '}</VoudText>
        <VoudText style={styles.labelTextBold}>{`${name}.`}</VoudText>
      </VoudText>
    )
  }
}

export default NextPublicTransportArrival
