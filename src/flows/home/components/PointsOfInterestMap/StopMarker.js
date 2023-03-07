import React, { Component } from 'react';
import PropTypes from 'prop-types';

// 3rd party
import { Marker, Callout } from 'react-native-maps';

// components
import StopTooltip from './StopTooltip';
import { pointsOfInterestTypes } from '../../actions';

// images
const pinBusStop = require('../../../../images/pin-bus-stop.png');
const pinSubwayStop = require('../../../../images/pin-subway-stop.png');
const pinTrainStop = require('../../../../images/pin-train-stop.png');
const pinRechargeStop = require('../../../../images/pin-recharge-stop.png');

class StopMarker extends Component {
  constructor(props) {
    super(props);
    this._tracksViewChanges = true;
  }
  
  componentDidUpdate() {
    this._tracksViewChanges = false;
  }
  
  render() {
    const {
      coordinate,
      userPosition,
      type,
      stopName,
      lines,
      pointAddress,
      pointName,
      timeToArrival,
      alertMessage,
      markerRef,
      mapRef,
      mapPosition,
    } = this.props;
    
    let image;
    if (type === pointsOfInterestTypes.STOP_BUS) image = pinBusStop;
    if (type === pointsOfInterestTypes.STOP_SUBWAY) image = pinSubwayStop;
    if (type === pointsOfInterestTypes.STOP_TRAIN) image = pinTrainStop;
    if (type === pointsOfInterestTypes.RECHARGE) image = pinRechargeStop;

    return (
      <Marker
        ref={markerRef}
        coordinate={coordinate}
        image={image}
        tracksViewChanges={this._tracksViewChanges}
      >
        <Callout tooltip>
          <StopTooltip
            stopPosition={coordinate}
            userPosition={userPosition}
            type={type}
            // Bus/subway/train stop props
            stopName={stopName}
            lines={lines}
            // recharge point props
            pointAddress={pointAddress}
            pointName={pointName}
            timeToArrival={timeToArrival}
            alertMessage={alertMessage}
          />
        </Callout>
      </Marker>
    );
  }
}

StopMarker.propTypes = {
  coordinate: PropTypes.object,
  image: PropTypes.any,
  userPosition: PropTypes.object,
  type: PropTypes.string,
  stopName: PropTypes.string,
  lines: PropTypes.array,
  pointAddress: PropTypes.string,
  pointName: PropTypes.string
};
StopMarker.defaultProps = {};

export default StopMarker;
