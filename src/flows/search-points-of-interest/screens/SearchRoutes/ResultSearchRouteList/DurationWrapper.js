import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import VoudText from '../../../../../components/VoudText';

const styles = StyleSheet.create({
  timeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  textWrapper: {
    textAlign: 'center'
  },
  time: {
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 2,
  },
  timeUnity: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  fontSizeTraceRouteDuration:{
    fontSize:12
  }
})

class DurationWrapper extends Component {
  _getHoursAndMinutesFromSeconds(durationInSeconds) {
    const hours = durationInSeconds / 3600;
    const minutes = (hours % 1) * 60;
    return {
      hours: Math.trunc(hours),
      minutes: Math.trunc(minutes),
    }
  }

  render() {
    const { durationInSeconds, isTraceRoute } = this.props;
    const { hours, minutes } = this._getHoursAndMinutesFromSeconds(durationInSeconds);
    const fontSizeTraceRoute = !!isTraceRoute ? styles.fontSizeTraceRouteDuration : null;
    return (
      <View style={styles.timeWrapper}>
        <VoudText
          style={styles.textWrapper}
          numberOfLines={1}
          ellipsizeMode={'tail'}
        >
          {
            hours ? (
              <VoudText>
                <VoudText style={StyleSheet.flatten([styles.time, fontSizeTraceRoute])}>
                  {hours}
                </VoudText>
                <VoudText style={StyleSheet.flatten([ styles.timeUnity, fontSizeTraceRoute])}>
                  {'h '}
                </VoudText>
              </VoudText>
            ) : null
          }
          {
            Number(minutes) ? (
              <VoudText>
                <VoudText style={StyleSheet.flatten([ styles.time, fontSizeTraceRoute ])}>
                  {minutes}
                </VoudText>
                <VoudText style={StyleSheet.flatten([styles.timeUnity, fontSizeTraceRoute])}>
                   {` min`}
                </VoudText>
              </VoudText>
            ) : null
          }
        </VoudText>
      </View>
    );
  }
}

export default DurationWrapper;
