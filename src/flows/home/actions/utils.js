import { pointsOfInterestTypes } from './enums';
import { calculateDistance } from '../../../utils/haversine';
import { getVouDRadiusFromViewableArea } from '../../../utils/get-radius-from-viewable-area';
import { HEADER_HEIGHT } from '../components/Header';
import { COLLAPSIBLE_HEIGHT } from '../components/ServicesMenu';
import { isArray } from 'util';

export const DEFAULT_LAT_DELTA = 0.025;
export const DEFAULT_LNG_DELTA = 0.025;

export function getTypesFromZoomLevel(longitudeDelta) {
	const zoomLevel = Math.round(Math.log(360 / longitudeDelta) / Math.LN2);

	if (zoomLevel >= 16) {
		return [
			pointsOfInterestTypes.STOP_TRAIN,
			pointsOfInterestTypes.STOP_BUS,
			pointsOfInterestTypes.STOP_SUBWAY,
			pointsOfInterestTypes.RECHARGE,
			pointsOfInterestTypes.BUS,
			pointsOfInterestTypes.BIKE,
			pointsOfInterestTypes.RENT_CAR
		];
	}
	if (zoomLevel < 16 && zoomLevel >= 14) {
		return [
			pointsOfInterestTypes.STOP_TRAIN,
			pointsOfInterestTypes.STOP_SUBWAY,
			pointsOfInterestTypes.RECHARGE,
			pointsOfInterestTypes.BUS,
			pointsOfInterestTypes.BIKE,
			pointsOfInterestTypes.RENT_CAR
		];
	}
	if (zoomLevel < 14 && zoomLevel >= 11) {
		return [
			pointsOfInterestTypes.STOP_TRAIN,
			pointsOfInterestTypes.STOP_SUBWAY,
			pointsOfInterestTypes.RECHARGE,
			pointsOfInterestTypes.BIKE,
			pointsOfInterestTypes.RENT_CAR
		];
	}
	if (zoomLevel < 11) {
		return [ pointsOfInterestTypes.RECHARGE, pointsOfInterestTypes.BIKE, pointsOfInterestTypes.RENT_CAR ];
	}

	return [];
}

const MAX_NUMBER_OF_VIEWABLE_POINTS = 200;
const MAX_NUMBER_OF_STORED_POINTS = 800;

export function mergeExistingPoints(currData, newData, maxNumber = MAX_NUMBER_OF_STORED_POINTS) {
	// Filter existing points on newPayload
	// if point id || externalId already exists,
	// remove it from final array
	const filteredNewData = newData.filter(
		(point) =>
			!currData.some((existingPoint) => {
				const pointId = point.id || point.externalId;
				const existingPointId = existingPoint.id || existingPoint.externalId;
				return pointId == existingPointId;
			})
	);

	const checkMap = {};
	const newArray = [ ...filteredNewData, ...currData ].filter((point) => {
		const checkedId = `${point.positionLatitude}_${point.positionLongitude}`;
		const checked = checkMap[checkedId];
		if (!checked) {
			checkMap[checkedId] = true;
		}
		return !checked;
	});

	return newArray.length > maxNumber ? newArray.splice(0, maxNumber) : newArray;
}

export function filterNearbyTembici(data, mapPosition) {
	if (!data) return [];

	const { latitude, longitude } = mapPosition;

	return data.sort(
		(a, b) =>
			calculateDistance(latitude, longitude, a.positionLatitude, a.positionLongitude) -
			calculateDistance(latitude, longitude, b.positionLatitude, b.positionLongitude)
	);
}

export function filterNearbyZazcar(data, mapPosition) {
	if (!data) return [];


	const { latitude, longitude } = mapPosition;

	data.sort(
	(a, b) =>
		calculateDistance(latitude, longitude, a.positionLatitude, a.positionLongitude) -
		calculateDistance(latitude, longitude, b.positionLatitude, b.positionLongitude)
	);

	const resultByAvailability = data.filter(
		(item) =>{
			if (item.pointType  !== pointsOfInterestTypes.RENT_CAR) return false;

			const carsCount = item.detail.filter(item => item.available == true).length;
			return carsCount > 0;
	});

	const result = data.filter(
		(item) =>{
			if (item.pointType  !== pointsOfInterestTypes.RENT_CAR) return false;

			return item.distance ==
			resultByAvailability.map((item) => Number.parseFloat(item.distance)).reduce((acc, cur) => acc && cur && Math.min(acc, cur))
		});

	if (isArray(result) && result.length > 0) {
		return result[0];
	}else{
		return null;
	}
}

export function filterPointsByZoomAndDistance(data, mapPosition, maxNumber = MAX_NUMBER_OF_VIEWABLE_POINTS) {
	if (!data) return [];

	const { latitude, longitude, latitudeDelta, longitudeDelta } = mapPosition;
	const regionRadius = getVouDRadiusFromViewableArea(latitude, longitude, latitudeDelta, longitudeDelta);
	const types = getTypesFromZoomLevel(longitudeDelta);

	const filteredArray = data
		.filter((point) => {
			const distance = calculateDistance(latitude, longitude, point.positionLatitude, point.positionLongitude);
			return distance < regionRadius && types.indexOf(point.pointType) >= 0;
		})
		.sort(
			(a, b) =>
				calculateDistance(latitude, longitude, a.positionLatitude, a.positionLongitude) -
				calculateDistance(latitude, longitude, b.positionLatitude, b.positionLongitude)
		);

	const selectedPoints = filteredArray.length > maxNumber ? filteredArray.splice(0, maxNumber) : filteredArray;

	return data.filter((point) =>
		selectedPoints.some((selectedPoint) => {
			const pointId = point.id || point.externalId;
			const selectedPointId = selectedPoint.id || selectedPoint.externalId;
			return pointId == selectedPointId;
		})
	);
}

export function filterCurrentDataByType(currData, types) {
	return currData.filter((point) => types.indexOf(point.pointType) >= 0);
}

export function shouldRenderDynamicPoints(longitudeDelta) {
	const types = getTypesFromZoomLevel(longitudeDelta);
	return types.indexOf(pointsOfInterestTypes.BUS) > 0;
}

export async function centerMarker(
	mapRef,
	mapHeight,
	menuCollapsed,
	latitude,
	longitude,
	latitudeDelta,
	longitudeDelta,
	duration = 400
) {
	if (!mapRef || !mapHeight || !latitude || !longitude || !latitudeDelta || !longitudeDelta) return;

	const bottomOffset = menuCollapsed ? 0 : latitudeDelta * (COLLAPSIBLE_HEIGHT / 2) / mapHeight;

	mapRef.animateToRegion(
		{
			latitude: latitude + latitudeDelta * (HEADER_HEIGHT / 2) / mapHeight - bottomOffset,
			longitude,
			latitudeDelta,
			longitudeDelta
		},
		duration
	);
}
