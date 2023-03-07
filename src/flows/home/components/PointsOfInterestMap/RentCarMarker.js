import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Svg, { G, Text, TSpan, Path, Polyline, Rect } from 'react-native-svg';

// 3rd party
import { Marker } from 'react-native-maps';

import { navigateToRoute } from '../../../../redux/nav';
import { routeNames } from '../../../../shared/route-names';
import { GATrackEvent, GAEventParams } from '../../../../shared/analytics';

import { pinZazcar0, pinZazcar1, pinZazcar2, pinZazcar3, pinZazcar4, pinZazcar5 } from '../../../../images/rent_cars/index';

class RentCarMarker extends Component {
	constructor(props) {
		super(props);
		this._tracksViewChanges = true;
	}

	componentDidUpdate() {
		this._tracksViewChanges = false;
	}

	navigateToZazcar = () => {
		const { detail, pointName, pointAddress, dispatch } = this.props;
		const { categories: { BUTTON }, actions: { CLICK }, labels: { MENU_MOBILITY_RENTCAR } } = GAEventParams;

		GATrackEvent(BUTTON, CLICK, MENU_MOBILITY_RENTCAR);
		dispatch(
			navigateToRoute(routeNames.ZAZCAR, {
				pointName: pointName,
				pointAddress: pointAddress,
				details: detail
			})
		);
	};

	carsCount = () =>{
		const { detail } = this.props;
		return detail.filter(({available}) => available === true).length
	}

	getImageByCount = () => {
		switch (this.carsCount()) {
			case 0:
				return pinZazcar0;
			case 1:
				return pinZazcar1;
			case 2:
				return pinZazcar2;
			case 3:
				return pinZazcar3;
			case 4:
				return pinZazcar4;
			case 5:
				return pinZazcar5;
			default:
				break;
		}
	};

	render() {
		const { coordinate, markerRef } = this.props;
		return (
			<Marker
				onPress={this.carsCount() === 0 ? () => {} : this.navigateToZazcar}
				image={this.getImageByCount()}
				ref={markerRef}
				coordinate={coordinate}
				tracksViewChanges={this._tracksViewChanges}
			/>
		);
	}
}

RentCarMarker.propTypes = {
	coordinate: PropTypes.object,
	image: PropTypes.any,
	userPosition: PropTypes.object,
	type: PropTypes.string,
	stopName: PropTypes.string,
	lines: PropTypes.array,
	pointAddress: PropTypes.string,
	pointName: PropTypes.string,
	dispatch: PropTypes.func,
	detail: PropTypes.array,
	markerRef: PropTypes.object
};
RentCarMarker.defaultProps = {};

export default RentCarMarker;
