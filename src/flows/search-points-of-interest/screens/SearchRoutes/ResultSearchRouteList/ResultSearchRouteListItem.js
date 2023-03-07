// NPM Imports
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

// VouD Imports
import TouchableNative from '../../../../../components/TouchableNative';
import Icon from '../../../../../components/Icon';
import { colors } from '../../../../../styles';
import DurationWrapper from './DurationWrapper';
import BiggestStepItem from './BiggestStepItem';
import SingleSubstepItem from './SingleSubstepItem';
import configRouteItemObj from '../../../utils/config-route-item-obj';
import TwoSubstepsItem from './TwoSubstepsItem';
import InfiniteSubstepsItem from './InfiniteSubstepsItem';
import AbbreviatedSubstepItem from './AbbreviatedSubstepItem';

// component
import adaptRouteJson from '../../../utils/adapt-route-json';
import getStepWidthByCategory from '../../../utils/get-step-width-by-category';
import getWidthForAbbreviatedSteps from '../../../utils/get-width-for-abbreviated-steps';
import getStepsType from '../../../utils/get-steps-type';
import FareWrapper from './FareWrapper';
import NextPublicTransportArrival from './NextPublicTransportArrival';
import getFirstStop from '../../../utils/get-first-stop';

const bomLogo = require('../../../../../images/transport-cards/bom.png');
const buLogo = require('../../../../../images/transport-cards/bu.png');

// Styles
const styles = StyleSheet.create({
  resultSearchRouteListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    backgroundColor: 'white'
  },
  itemWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_LIGHT2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  noBorder: {
    borderBottomWidth: 0
  },
  contentLeft: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    width: 48,
  },
  contentMiddle: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    height: 56,
    marginHorizontal: 4,
    width: 30,
  },
  contentRight: {
    flex: 1,
    flexDirection: 'column',
  },
  iconVoud: {
    fontSize: 16,
    marginRight: 0,
    color: colors.BRAND_PRIMARY
  },
  icon: {
    fontSize: 16,
    color: colors.GRAY
  },
  img: {
    maxWidth: 24
  },
  bomImg: {
    height: 10
  },
  buImg: {
    height: 19
  },
  buImgLarge: {
    height: 24
  },
  bomImgLarge: {
    height: 24
  },
  routeStepsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 4,
  },
  mb8: {
    marginBottom: 8,
  },
  contentRightPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    width: 70,
  },
  iconArrowForward: {
    fontSize: 16,
    marginRight: 0,
    color: '#707070'
  },
  arrowContent:{
    justifyContent:'center',
    alignItems:'center',
  },
  durationContent:{
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
  }
});

// Component
class ResultSearchRouteListItem extends Component {
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

  _renderSizeImageCard(card, acceptedCards) {
    if (card === "BU") {
      return acceptedCards.length > 1 ? styles.buImg : styles.buImgLarge;
    } else {
      return acceptedCards.length > 1 ? styles.bomImg : styles.bomImgLarge
    }

  }

  _renderAcceptedCards(acceptedCards) {
    return (
      acceptedCards
        .sort()
        .map((card, index) => {

          return (
            <Image
              source={card === "BU" ? buLogo : bomLogo}
              style={StyleSheet.flatten([
                styles.img,
                this._renderSizeImageCard(card, acceptedCards),
                // card === "BU" ?  styles.buImg : styles.bomImg,
                acceptedCards.length > 1 && index !== acceptedCards.length - 1 ? styles.mb8 : {}
              ])}
              resizeMode="contain"
              key={index}
            />
          )
        })
    );
  }
  render() {
    const { item, onPress, isLast } = this.props;
    const { acceptedCards, fare } = item;
    const leg = item.legs[0];
    const { duration } = leg;
    const firstStop = getFirstStop(item);
    return (
      <TouchableNative
        onPress={onPress}
        style={styles.resultSearchRouteListItem}
      >
        <View style={StyleSheet.flatten([styles.itemWrapper, isLast ? styles.noBorder : {}])}>
          <View style={styles.contentMiddle}>
            {this._renderAcceptedCards(acceptedCards)}
          </View>
          <View style={styles.contentRight}>
            <View style={styles.routeStepsWrapper}>
              <Icon
                name="directions-walk"
                style={styles.iconVoud}
              />
              <Icon
                name="arrow-forward"
                style={styles.icon}
              />
              {this._renderRouteSteps(adaptRouteJson(item))}
              <Icon
                name="directions-walk"
                style={styles.iconVoud}
              />
            </View>
            <NextPublicTransportArrival step={firstStop} />
          </View>
          <View style={styles.contentRightPrice}>
            <View style={{flex:1}}>
                <DurationWrapper durationInSeconds={duration.inSeconds} />
                <FareWrapper
                  fare={fare}
                  currency="R$"
                />
            </View>
            <View style={[styles.arrowContent]}>
                <Icon name="arrow-forward" style={styles.iconArrowForward} />
            </View>      
          </View>
         
        </View>
      </TouchableNative>
    )
  }
}

export default ResultSearchRouteListItem;