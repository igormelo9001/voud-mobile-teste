import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import LinearGradient from 'react-native-linear-gradient';

import VoudText from '../../../../components/VoudText';
import { colors } from '../../../../styles';
import Icon from '../../../../components/Icon';
import { acceptedCardsTypes } from '../../actions';
import { voudCapitalizeLetters } from '../../../../utils/string-util';

class BusTooltip extends Component {
  render() {
    const {
      acceptedCards,
      lineNumber,
      lineOrigin,
      lineDestiny,
    } = this.props;
    return (
      <LinearGradient
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
        locations={[0,0.92,1]}
        colors={['transparent', 'rgba(0,0,0,0.15)', 'transparent']}
        style={styles.tooltip}
      >
        <View style={styles.tooltipBody}>
          <View style={styles.busLine}>
            <Icon name="bus" size={16} style={styles.busIcon} />
            <VoudText style={styles.busLineNumber}>{lineNumber}</VoudText>
          </View>
          <View style={styles.itinerary}>
            <Icon
              style={styles.timelineIcon}
              name="bus-route"
              size={24}
            />
            <View>
              <VoudText style={styles.busDetailsText}>
                {voudCapitalizeLetters(lineOrigin)}
              </VoudText>
              <VoudText style={styles.busDetailsText}>
                {voudCapitalizeLetters(lineDestiny)}
              </VoudText>
            </View>
          </View>
          <View style={styles.acceptedCards}>
            {
              acceptedCards.indexOf(acceptedCardsTypes.BOM) >= 0 &&
              <VoudText
                style={StyleSheet.flatten([
                  styles.acceptedCardLabel,
                  styles.acceptedCardBOM
                ])}>
                BOM
              </VoudText>
            }
            {
              acceptedCards.indexOf(acceptedCardsTypes.BU) >= 0 &&
              <VoudText
                style={StyleSheet.flatten([
                  styles.acceptedCardLabel,
                  styles.acceptedCardBU
                ])}>
                Bilhete Único
              </VoudText>
            }
          </View>
        </View>
        <View style={styles.tooltipArrow} />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  tooltip: {
    paddingBottom: 9,
    paddingHorizontal: 1,
  },
  tooltipBody: {
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 8,
    minWidth: 160,
  },
  tooltipArrow: {
    backgroundColor: 'white',
    width: 9,
    height: 9,
    position: 'absolute',
    left: "47%",
    bottom: 4,
    transform: [
      { "rotate": "45deg" }
    ],
  },

  // bus line
  busLine: {
    flexDirection: 'row',
  },
  busLineNumber: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#4b4b4b'
  },

  // accepted cards
  acceptedCards: {
    flexDirection: 'row',
    marginTop: 4,
  },
  acceptedCardLabel: {
    fontSize: 8,
    padding: 4,
    backgroundColor: 'black',
    color: 'white',
    borderRadius: 2,
    overflow: 'hidden',
    fontWeight: 'bold',
    marginRight: 4
  },
  acceptedCardBOM: {
    color: 'white',
    backgroundColor: colors.BOM_COLOR
  },
  acceptedCardBU: {
    color: 'white',
    backgroundColor: colors.BU_COLOR
  },

  // itinerary
  itinerary: {
    flexDirection: 'row',
    padding: 0,
    marginTop: 2,
  },

  timelineIcon: {
    color: colors.GRAY,
    width: 16,
    // textAlign: 'left',
    position: 'relative',
    bottom: -3,
    left: -5,
  },

  // // details column
  busDetailsText: {
    fontSize: 10,
    color: '#4b4b4b',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  busIcon: {
    fontSize: 16,
    color: colors.BRAND_PRIMARY
  }
})

BusTooltip.propTypes = {
  acceptedCards: PropTypes.array,
  lineNumber: PropTypes.string,
  lineOrigin: PropTypes.string,
  lineDestiny: PropTypes.string,
};
BusTooltip.defaultProps = {};

export default BusTooltip;
