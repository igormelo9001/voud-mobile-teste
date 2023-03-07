import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import VoudText from '../../../../../components/VoudText';
import { colors } from '../../../../../styles';
import Icon from '../../../../../components/Icon';
import getIconNameForStep from '../../../utils/get-icon-name-for-step';
import getSubstepLabelText from '../../../utils/get-substep-label-text';
import { adaptTextColorToBackgroundColor } from '../../../utils/adapt-text-color-to-background-color';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 157,
  },
  innerContainer: {
    flexDirection: 'row',
    width: 120,
  },
  stopWrapper: {
    position: 'relative'
  },
  stopWrapperMiddle: {
    position: 'absolute',
    left: 36
  },
  stopWrapperRight: {
    position: 'absolute',
    left: 64,
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
  stopMiddle: {
    paddingLeft: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 2,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 2,
    overflow: 'hidden',
    backgroundColor: colors.BRAND_SUCCESS_DARK,
    width: 32,
  },
  stopRight: {
    paddingLeft: 14,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 2,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 2,
    overflow: 'hidden',
    backgroundColor: colors.BRAND_SUCCESS_DARK,
    width: 56,
  },
  threeDots: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
  },
  labelText: {
    fontSize: 8,
    fontWeight: 'bold'
  },
  icon: {
    fontSize: 16,
    color: colors.GRAY,
    alignSelf: 'center',
  },
  iconVoud: {
    fontSize: 16,
    marginRight: 4,
    color: colors.BRAND_PRIMARY,
    alignSelf: 'center',
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
  lastArrow: {
    fontSize: 16,
    color: colors.GRAY,
    alignSelf: 'center',
    marginLeft: 2,
  },
});

export class SubstepLabelsInfinity extends Component {
  render() {
    const {
      substeps,
      type,
    } = this.props;
    const { length: substepsLength } = substeps;
    const firstSubstep = {...substeps[0]};
    const lastSubstep = {...substeps[substepsLength - 1]};
    let firstLabelText = getSubstepLabelText(type, firstSubstep.shortName);
    let lastLabelText = getSubstepLabelText(type, lastSubstep.shortName);
    let iconName = getIconNameForStep(type);
    return (
      <View style={styles.container}>
        <Icon 
          name={iconName}
          style={styles.iconVoud}
        />
        <View style={styles.innerContainer}>
          <View style={styles.stopWrapperRight}>
            <View
              style={
                StyleSheet.flatten([
                  styles.stop,
                  styles.stopRight,
                  { backgroundColor: lastSubstep.color || colors.BRAND_PRIMARY },
                ])}
            >
              <VoudText
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={
                  StyleSheet.flatten([
                    styles.labelText,
                    adaptTextColorToBackgroundColor(lastSubstep.color)
                  ])
                }>
                  {lastLabelText}
                </VoudText>
            </View>
          </View>
          <View style={styles.stopWrapperMiddle}>
            <View style={
              StyleSheet.flatten([
                styles.arrow,
                { backgroundColor: colors.BRAND_PRIMARY },
              ])
            }></View>
            <View
              style={
                StyleSheet.flatten([
                  styles.stop,
                  styles.stopMiddle,
                  { backgroundColor: colors.BRAND_PRIMARY },
                ])}
            >
              <VoudText style={styles.threeDots}>...</VoudText>
            </View>

          </View>
          <View style={styles.stopWrapper}>
            <View style={
              StyleSheet.flatten([
                styles.arrow,
                { backgroundColor: firstSubstep.color || colors.BRAND_PRIMARY },
              ])
            }></View>
            <View
              style={
                StyleSheet.flatten([
                  styles.stop,
                  styles.stopLeft,
                  { backgroundColor: firstSubstep.color || colors.BRAND_PRIMARY },
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
          style={styles.lastArrow}
        />
      </View>
    )
  }
}

export default SubstepLabelsInfinity
