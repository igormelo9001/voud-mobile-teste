// NPM Imports
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

// VouD Imports

import Icon from '../../../../../../components/Icon';

import DurationWrapper from '../../../SearchRoutes/ResultSearchRouteList/DurationWrapper';
import BiggestStepItem from '../../../SearchRoutes/ResultSearchRouteList/BiggestStepItem';
import SingleSubstepItem from '../../../SearchRoutes/ResultSearchRouteList/SingleSubstepItem';
import configRouteItemObj from '../../../../../search-points-of-interest/utils/config-route-item-obj';
import TwoSubstepsItem from '../../../SearchRoutes/ResultSearchRouteList/TwoSubstepsItem';
import InfiniteSubstepsItem from '../../../SearchRoutes/ResultSearchRouteList/InfiniteSubstepsItem';
import AbbreviatedSubstepItem from '../../../SearchRoutes/ResultSearchRouteList/AbbreviatedSubstepItem';
import VoudText from '../../../../../../components/VoudText';

// component
import adaptRouteJson from '../../../../../search-points-of-interest/utils/adapt-route-json';
import getStepWidthByCategory from '../../../../../search-points-of-interest/utils/get-step-width-by-category';
import getWidthForAbbreviatedSteps from '../../../../../search-points-of-interest/utils/get-width-for-abbreviated-steps';
import getStepsType from '../../../../../search-points-of-interest/utils/get-steps-type';

import styles from "./style";


const bomLogo = require('../../../../../../images/transport-cards/bom.png')
const buLogo = require('../../../../../../images/transport-cards/bu.png');

// Component
class StartRouteItem extends Component {
  _renderBiggestStepItem = ({ steps, totalSubsteps }) => {
    const types = getStepsType(steps);
    return (
      <BiggestStepItem
        totalSubsteps={totalSubsteps}
        types={types}
      />
    )
  }

  _renderStepsWithAbbreviation = ({ type, substeps }, index) => {
    return (
      <AbbreviatedSubstepItem
        key={index}
        type={type}
        substeps={substeps}
      />
    )
  }

  _renderStepByCategory = ({ type, substeps }, index) => {
    const { length } = substeps;
    if (length === 1) {
      return (
        <SingleSubstepItem
          key={index}
          type={type}
          color={substeps[0].color && substeps[0].color}
          shortName={substeps[0].shortName}
        />
      )
    }
    if (length === 2) {
      return (
        <TwoSubstepsItem
          key={index}
          type={type}
          substeps={substeps}
        />
      )
    }
    return (
      <InfiniteSubstepsItem
        key={index}
        type={type}
        substeps={substeps}
      />
    )
  }

  _renderRouteSteps = (formattedSteps) => {
    const { steps } = formattedSteps;
    const { width: deviceWidth } = Dimensions.get('window');
    const { TOTAL_UNAVAILABLE_WIDTH } = configRouteItemObj;
    const availableWidth = deviceWidth - TOTAL_UNAVAILABLE_WIDTH;
    const stepsWidthByCategory = steps.map(getStepWidthByCategory);
    const totalWidthByCategory = stepsWidthByCategory.reduce((acc, item) => acc + item);
    const totalWidthWithAbbreviation = getWidthForAbbreviatedSteps(steps);

    if (totalWidthByCategory <= availableWidth) {
      return steps.map(this._renderStepByCategory);
    }
    if (totalWidthWithAbbreviation <= availableWidth) {
      return steps.map(this._renderStepsWithAbbreviation);
    }
    return this._renderBiggestStepItem(formattedSteps);
  }

  _formatFare(fare) {
    if (!fare) return '-';
    return String(fare.value.toFixed(2)).replace('.', ',');
  }

  _renderSizeImageCard(card,acceptedCards){
    if(card === "BU"){
        return acceptedCards.length > 1 ? styles.buImg : styles.buImgLarge;
    } else {
      return acceptedCards.length > 1 ? styles.bomImg : styles.bomImgLarge
    }

  }

  _renderAcceptedCards(acceptedCards) {

    let isCardBom = acceptedCards.filter(item => item === "BOM").length === 1;

    return (
      acceptedCards
        .sort()
        .map((card, index) => {
          return (
            <Image
              source={card === "BU" ? buLogo : bomLogo}
              style={StyleSheet.flatten([
                isCardBom ? styles.imgBom : styles.img,
                this._renderSizeImageCard(card,acceptedCards),
                // card === "BU" ? styles.buImg : styles.bomImg,
                acceptedCards.length > 1 && index !== acceptedCards.length - 1 ? styles.mb8 : {}
              ])}
              resizeMode="contain"
              key={index}

            />
          )
        })
    );
  }

  _getHoursAndMinutesFromSeconds(durationInSeconds) {

    const hours = durationInSeconds / 3600;
    const minutes = (hours % 1) * 60;

      if(Math.trunc(hours)){
        return Math.trunc(hours)
      } else {
        return Math.trunc(minutes);
      }
}

  render() {

    const { item } = this.props;
    const leg = item.legs[0];
    const { duration,steps } = leg;


    let walkingStart = this._getHoursAndMinutesFromSeconds(steps[0].duration.inSeconds);
    let walkingEnd = this._getHoursAndMinutesFromSeconds(steps[steps.length-1].duration.inSeconds);

    if(walkingStart === 0 && steps[0].distance.inMeters > 0){
      walkingStart = steps[0].duration.humanReadable.split(' ')[0];
    }

    if(walkingEnd === 0 && steps[steps.length-1].distance.inMeters > 0){
      walkingEnd = steps[0].duration.humanReadable.split(' ')[0];
    }

    return (
      <View style={StyleSheet.flatten([styles.itemWrapper])}>

        <View style={styles.contentMiddle}>
          {this._renderAcceptedCards(item.acceptedCards)}
        </View>

        <View style={[styles.contentRight]}>
          <View style={styles.routeStepsWrapper}>

            <View style={{flexDirection:'row'}}>
              <Icon
                name="directions-walk"
                style={styles.iconVoud}
              />
              <VoudText style={{marginLeft: 0, fontSize:8,marginTop: 10,}}>{walkingStart}</VoudText>
            </View>


            <Icon
              name="arrow-forward"
              style={styles.icon}
            />
            {this._renderRouteSteps(adaptRouteJson(item))}
            <View style={styles.contentIconDirections}>
              <Icon
                name="directions-walk"
                style={styles.iconVoud}
              />
              <VoudText style={{marginLeft: 0, fontSize:8,marginTop: 10,}}>{walkingEnd}</VoudText>
            </View>
            <View style={styles.contentDurationWrapper}>
              <View>
                 <DurationWrapper durationInSeconds={duration.inSeconds} isTraceRoute />
                 <VoudText style={styles.price}>{`R$ ${this._formatFare(item.fare)}`}</VoudText>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default StartRouteItem;
