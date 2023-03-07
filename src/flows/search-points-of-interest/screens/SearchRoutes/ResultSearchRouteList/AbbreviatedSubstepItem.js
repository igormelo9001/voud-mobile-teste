import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import Icon from '../../../../../components/Icon';
import VoudText from '../../../../../components/VoudText';
import { colors } from '../../../../../styles';
import getIconNameForStep from '../../../utils/get-icon-name-for-step'

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    width: 60,
    marginLeft: 2,
  },
  labelWrapper: {
    borderRadius: 2,
    padding: 4,
    width: 24,
  },
  labelText: {
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
  lastArrow: {
    fontSize: 16,
    color: colors.GRAY,
    alignSelf: 'center',
    marginLeft: 2,
  }
});

export class AbbreviatedSubstepItem extends Component {
  render() {
    const {
      type,
      substeps,
    } = this.props;
    let { length: substepsLength } = substeps;
    if (substepsLength > 99) substepsLength = '+99'
    const iconName = getIconNameForStep(type);
    return (
      <View style={styles.wrapper}>
        <View style={StyleSheet.flatten([styles.labelWrapper, { backgroundColor: colors.BRAND_PRIMARY }])}>
          <VoudText style={styles.labelText}>{`${substepsLength}`}</VoudText>
        </View>
        <Icon
          style={styles.iconVoud}
          name={iconName}
        />
        <Icon
          name="arrow-forward"
          style={styles.lastArrow}
        />
      </View>
    )
  }
}

export default AbbreviatedSubstepItem
