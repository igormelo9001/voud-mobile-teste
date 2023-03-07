import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { colors } from '../../../../../styles';
import VoudText from '../../../../../components/VoudText';
import Icon from '../../../../../components/Icon';
import getSubstepLabelText from '../../../utils/get-substep-label-text';
import getIconNameForStep from '../../../utils/get-icon-name-for-step';
import { adaptTextColorToBackgroundColor } from '../../../utils/adapt-text-color-to-background-color';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 127,
  },
  innerContainer: {
    flexDirection: 'row',
    width: 98,
  },
  stopWrapper: {
    position: 'absolute',
    left: 36,
  },
  stopWrapperWithArrow: {
    position: 'relative'
  },
  labelText: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stop: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopLeft: {
    paddingRight: 0,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 0,
    overflow: 'hidden',
    width: 40,
  },
  stopRight: {
    paddingLeft: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 2,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 2,
    overflow: 'hidden',
    width: 60,
  },
  arrow: {
    height: 15,
    width: 15,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderStyle: 'solid',
    borderColor: 'white',
    position: 'absolute',
    right: -9,
    top: 2,
    transform: [
      { "rotate": "45deg" }
    ]
  },
  icon: {
    fontSize: 16,
    color: colors.GRAY,
    alignSelf: 'center',
  },
  iconVoud: {
    fontSize: 16,
    color: colors.BRAND_PRIMARY,
    alignSelf: 'center',
  },
})

export class TwoStepsItem extends Component {
  render() {
    const { substeps, type } = this.props;
    const [firstSubstep, secondSubstep] = substeps;
    let firstLabelText = getSubstepLabelText(type, firstSubstep.shortName);
    let secondLabelText = getSubstepLabelText(type, secondSubstep.shortName);
    let iconName = getIconNameForStep(type);
    return (
      <View style={styles.container}>
        <Icon
          style={styles.iconVoud}
          name={iconName}
        />
        <View style={styles.innerContainer}>
          <View style={styles.stopWrapper}>
            <View
              style={
                StyleSheet.flatten([
                  styles.stop,
                  styles.stopRight,
                  { backgroundColor: secondSubstep.color || colors.BRAND_PRIMARY}
                ])
              }
            >
              <VoudText
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={
                  StyleSheet.flatten([
                    styles.labelText,
                    adaptTextColorToBackgroundColor(secondSubstep.color)
                  ])
                }>
                  {secondLabelText}
                </VoudText>
            </View>
          </View>
          <View style={styles.stopWrapperWithArrow}>
            <View
              style={
                StyleSheet.flatten([
                  styles.arrow,
                  { backgroundColor: firstSubstep.color || colors.BRAND_PRIMARY}
                ])
              }
            ></View>
            <View
              style={
                StyleSheet.flatten([
                  styles.stop,
                  styles.stopLeft,
                  { backgroundColor: firstSubstep.color || colors.BRAND_PRIMARY}
                ])
              }
            >
              <VoudText
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={
                  StyleSheet.flatten([
                    styles.labelText,
                    adaptTextColorToBackgroundColor(firstSubstep.color)
                  ])
                }>
                  {firstLabelText}
                </VoudText>
            </View>
          </View>
        </View>
        <Icon
          name="arrow-forward"
          style={styles.icon}
        />
      </View>
    )
  }
}

export default TwoStepsItem
