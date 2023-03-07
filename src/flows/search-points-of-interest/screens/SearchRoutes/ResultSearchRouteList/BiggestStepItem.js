import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import Icon from '../../../../../components/Icon';
import VoudText from '../../../../../components/VoudText';
import { colors } from '../../../../../styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  totalNumberOfStepsWrapper: {
    backgroundColor: colors.BRAND_PRIMARY,
    borderRadius: 2,
    padding: 2,
    width: 24,
  },
  totalNumberOfStepsLabel: {
    fontSize: 8,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  iconVoud: {
    fontSize: 16,
    color: colors.BRAND_PRIMARY,
    alignSelf: 'center',
  },
  icon: {
    fontSize: 16,
    color: colors.GRAY,
    alignSelf: 'center',
  },
})

function shouldRenderIconOf(types, icon) {
  return types.some(type => type === icon);
}

export class BiggestStepItem extends Component {
  render() {
    const { totalSubsteps, types } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.totalNumberOfStepsWrapper}>
          <VoudText style={styles.totalNumberOfStepsLabel}>
            { totalSubsteps < 100 ? totalSubsteps : '+99' }
          </VoudText>
        </View>
        {
          shouldRenderIconOf(types, 'BUS') &&
          <Icon
            name="bus"
            style={styles.iconVoud}
          />
        }
        {
          shouldRenderIconOf(types, 'HEAVY_RAIL') &&
          <Icon
            name="train"
            style={styles.iconVoud}
          />
        }
        {
          shouldRenderIconOf(types, 'SUBWAY') &&
          <Icon
            name="subway"
            style={styles.iconVoud}
          />
        }
        <Icon
          name="arrow-forward"
          style={styles.icon}
        />
      </View>
    )
  }
}

export default BiggestStepItem
