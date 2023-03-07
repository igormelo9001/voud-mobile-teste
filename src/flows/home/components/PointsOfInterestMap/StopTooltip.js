import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import Moment from 'moment';

import VoudText from '../../../../components/VoudText';
import Icon from '../../../../components/Icon';
import { colors } from '../../../../styles';
import { pointsOfInterestTypes } from '../../actions';
import { calculateDistance } from '../../../../utils/haversine';
import { voudCapitalizeLetters } from '../../../../utils/string-util';

class StopTooltip extends Component {

  _getStopIconName = (stopType) => {
    if (stopType === pointsOfInterestTypes.STOP_BUS) return 'bus';
    if (stopType === pointsOfInterestTypes.STOP_SUBWAY) return 'subway';
    if (stopType === pointsOfInterestTypes.STOP_TRAIN) return 'train';
    if (stopType === pointsOfInterestTypes.RECHARGE) return 'recharge-point';

    return 'bus';
  }

  _calculateDistance = () => {
    const { stopPosition, userPosition } = this.props;

    const distance = calculateDistance(
      stopPosition.latitude,
      stopPosition.longitude,
      userPosition.latitude,
      userPosition.longitude
    );

    if (distance > 1) {
      return `${distance}km`;
    }

    // if under 1km, convert to meters
    return `${distance * 1000}m`;
  }

  _formatRemainingTime = (timeToArrival) => {
    const remainingTime = Moment(timeToArrival, 'HH:mm').diff(Moment(), 'minute');
     return `${remainingTime >= 0 ? remainingTime : 0} min`;
  }

  _renderForecastToolTip = () => (
    <View style={styles.forecastTooltipBody}>
      <Icon
        name="bus"
        style={styles.forecastIcon}
      />
      <VoudText style={styles.forecastText}>
        <VoudText>{'Chegando em '}</VoudText>
        <VoudText style={styles.forecastTimeText}>
          {this._formatRemainingTime(this.props.timeToArrival)}
        </VoudText>
      </VoudText>
    </View>
  )

  _renderAlertToolTip = () => (
    <View style={styles.alertMessageBody}>
      {this._renderBusLineInfo()}
      <VoudText style={styles.alertMessageText}>
        {this.props.alertMessage}
      </VoudText>
    </View>
  )

  _renderBusLineInfo = () => {
    const {
      type,
      stopName,
      pointAddress,
    } = this.props;
    return (
      <View style={styles.busLineInfo}>
        <Icon
          size={16}
          name={this._getStopIconName(type)}
          style={styles.icon}
        />
        <VoudText style={styles.busLineName}>
          {voudCapitalizeLetters(stopName || pointAddress)}
          <VoudText style={{fontWeight: 'normal'}}> ({this._calculateDistance()})</VoudText>
        </VoudText>
      </View>
    )
  }

  _renderDefaultTooltip = () => {
    const {
      type,
      lines,
      pointName,
    } = this.props;

    return (
      <View style={styles.tooltipBody}>
        {this._renderBusLineInfo()}
        <View style={styles.busLinesList}>
          {
            lines &&
            lines.map(line => (
              <View
                key={line.id}
                style={StyleSheet.flatten([
                  styles.busLineLabel,
                  { backgroundColor: `#${line.lineColor || '000000'}` }
                ])}
              >
                <VoudText
                  style={StyleSheet.flatten([
                    styles.busLineLabelText,
                    { color: `#${line.textColor || '000000'}` }
                  ])}
                >
                  {line.lineNumber}
                </VoudText>
              </View>
            ))
          }
          {
            type === pointsOfInterestTypes.RECHARGE &&
            <View
              key={pointName}
              style={StyleSheet.flatten([
                styles.busLineLabel,
                { backgroundColor: colors.BRAND_PRIMARY_DARKER }
              ])}
            >
              <VoudText
                style={StyleSheet.flatten([
                  styles.busLineLabelText,
                  { color: 'white' }
                ])}
              >
                {voudCapitalizeLetters(pointName)}
              </VoudText>
            </View>
          }
        </View>
      </View>
    );
  }

  render() {
    const { timeToArrival, alertMessage } = this.props;
    let content = null;

    if (timeToArrival) {
      content = this._renderForecastToolTip();
    } else if (alertMessage) {
      content = this._renderAlertToolTip();
    } else {
      content = this._renderDefaultTooltip();
    }

    return (
      <LinearGradient
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
        locations={[0,0.92,1]}
        colors={['transparent', 'rgba(0,0,0,0.15)', 'transparent']}
        style={styles.tooltip}
      >
        {content}
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
    width: 190,
  },

  tooltipArrow: {
    backgroundColor: 'white',
    width: 9,
    height: 9,
    marginLeft: -4,
    position: 'absolute',
    left: '50%',
    bottom: 4,
    transform: [
      { "rotate": "45deg" }
    ]
  },



  busLineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busLineName: {
    flex: 1,
    flexDirection: 'row',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4b4b4b',
    marginLeft: 4,
  },

  icon: {
    fontSize: 16,
    color: colors.BRAND_PRIMARY,
  },

  busLinesList: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },

  busLineLabel: {
    borderRadius: 2,
    padding: 4,
    backgroundColor: '#234A76',
    marginLeft: 4,
    marginBottom: 4,
  },
  busLineLabelText: {
    lineHeight: 10,
    fontSize: 8,
    color: 'white',
    fontWeight: 'bold'
  },
  forecastTooltipBody: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 8,
  },
  forecastIcon: {
    fontSize: 24,
    color: colors.BRAND_PRIMARY,
  },
  forecastText: {
    marginLeft: 4,
    fontSize: 12,
    color: colors.GRAY,
  },
  forecastTimeText: {
    fontWeight: 'bold',
    color: colors.BRAND_SUCCESS,
  },
  alertMessageBody: {
    width: 190,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 8,
  },
  alertMessageText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.GRAY,
    marginTop: 8,
  },
});

StopTooltip.propTypes = {
  stopName: PropTypes.string,
  lines: PropTypes.array,
  pointAddress: PropTypes.string,
  pointName: PropTypes.string,
  type: PropTypes.string,
};
StopTooltip.defaultProps = {
  stopName: '',
  lines: [],
  pointAddress: '',
  pointName: '',
  type: 'BUS_STOP' //pointsOfInterestTypes.STOP_BUS
};

export default StopTooltip;
