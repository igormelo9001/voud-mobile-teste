import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import Icon from '../../../../../components/Icon';
import VoudText from '../../../../../components/VoudText';
import { colors } from '../../../../../styles';
import getSubstepLabelText from '../../../utils/get-substep-label-text';
import getIconNameForStep from '../../../utils/get-icon-name-for-step';
import { adaptTextColorToBackgroundColor } from '../../../utils/adapt-text-color-to-background-color';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 82,
  },
  labelWrapper: {
    borderRadius: 2,
    padding: 4,
    width: 50,
    marginRight: 2,
  },
  labelText: {
    fontSize: 8,
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
});

export class SingleStepItem extends Component {
  render() {
    const {
      type,
      color = colors.BRAND_PRIMARY,
      shortName,
    } = this.props;
    let labelText = getSubstepLabelText(type, shortName);
    let iconName = getIconNameForStep(type);
    return (
      <View style={styles.container}>
        <Icon
          style={styles.iconVoud}
          name={iconName}
        />
        <View style={StyleSheet.flatten([styles.labelWrapper, { backgroundColor: color }])}>
          <VoudText
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={
              StyleSheet.flatten([
                styles.labelText,
                adaptTextColorToBackgroundColor(color)
              ])
            }
          >
            {labelText}
          </VoudText>
        </View>
        <Icon
          name="arrow-forward"
          style={styles.icon}
        />
      </View>
    )
  }
}

export default SingleStepItem


{/* <LinearGradient
colors={[colors.BRAND_PRIMARY_DARKER, colors.BRAND_PRIMARY_LIGHT ]}
start={{x: 0, y: 0}} end={{x: 1, y: 0}}
style={styles.linearGradient}
/> */}