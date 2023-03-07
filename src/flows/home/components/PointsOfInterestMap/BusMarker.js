import React, { Component } from 'react';
import PropTypes from 'prop-types';

//3rd party components
import { Marker, Callout } from 'react-native-maps';

// components
import BusTooltip from './BusTooltip';

// images
import images from './busPins';

class BusMarker extends Component {
  constructor(props) {
    super(props);
    this._tracksViewChanges = true;
  }
  
  componentDidUpdate() {
    this._tracksViewChanges = false;
  }

  render() {
    const {
      lineColor,
      coordinate,
      acceptedCards,
      lineNumber,
      lineOrigin,
      lineDestiny,
    } = this.props;

    return (
      <Marker
        coordinate={coordinate}
        image={images[lineColor] || images.default}
        tracksViewChanges={this._tracksViewChanges}
      >
        <Callout tooltip>
          <BusTooltip
            acceptedCards={acceptedCards}
            lineNumber={lineNumber}
            lineOrigin={lineOrigin}
            lineDestiny={lineDestiny}
          />
        </Callout>
      </Marker>
    );
  }
}

BusMarker.propTypes = {
  lineColor: PropTypes.string,
  coordinate: PropTypes.object,
  acceptedCards: PropTypes.array,
  lineNumber: PropTypes.string,
  lineOrigin: PropTypes.string,
  lineDestiny: PropTypes.string,
};
BusMarker.defaultProps = {};

export default BusMarker;
