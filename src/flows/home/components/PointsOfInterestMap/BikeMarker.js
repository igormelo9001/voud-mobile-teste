import React, { Component } from 'react';
import PropTypes from 'prop-types';

// 3rd party
import { Marker, Callout } from 'react-native-maps';

// components
import BikeTooltip from './BikeTooltip';

import { navigateToRoute } from '../../../../redux/nav';
import { routeNames } from '../../../../shared/route-names';

// images
const pinBikeStop = require('../../../../images/pin-bike.png');

class BikeMarker extends Component {
	constructor(props) {
		super(props);
		this._tracksViewChanges = true;
	}

	componentDidUpdate() {
		this._tracksViewChanges = false;
	}

	navigateToTembici = () => {
		const { detail, pointName, dispatch } = this.props;
		const { num_bikes_available, num_docks_available, last_reported } = detail;

		dispatch(navigateToRoute(routeNames.TEMBICI, {
			pointName: pointName,
			last_reported: last_reported,
			num_bikes_available: num_bikes_available,
			num_docks_available: num_docks_available,
		}));
	};

	render() {
		const { coordinate, markerRef, detail, pointName } = this.props;
		const { num_bikes_available, num_docks_available, } = detail;

		return (
			<Marker
				ref={markerRef}
				coordinate={coordinate}
				image={pinBikeStop}
				tracksViewChanges={this._tracksViewChanges}
			>
				<Callout onPress={this.navigateToTembici} tooltip>
					<BikeTooltip
						pointName={pointName}
						num_bikes_available={num_bikes_available}
						num_docks_available={num_docks_available}
					/>
				</Callout>
			</Marker>
		);
	}
}

BikeMarker.propTypes = {
	coordinate: PropTypes.object,
	image: PropTypes.any,
	userPosition: PropTypes.object,
	type: PropTypes.string,
	stopName: PropTypes.string,
	lines: PropTypes.array,
	pointAddress: PropTypes.string,
	pointName: PropTypes.string
};
BikeMarker.defaultProps = {};

export default BikeMarker;
