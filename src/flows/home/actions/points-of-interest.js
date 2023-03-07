// Action types
import actionTypes from './types';
import { pointsOfInterestTypes } from './enums';
import { voudRequest } from '../../../shared/services';
import { getTypesFromZoomLevel, mergeExistingPoints, filterNearbyTembici } from './utils';
import { uuidv4 } from '../../../utils/uuid-util';
import { requestErrorHandler } from '../../../shared/request-error-handler';
import { calculateDistance } from '../../../utils/haversine';

/* region #ZAZCAR */

export function showDirectionZazcarAction(showDirectionZazcar) {
  return {
    type: actionTypes.SHOW_DIRECTION_ZAZCAR,
    showDirectionZazcar,
  };
}

function _fetchPointsOfZazcar(uid) {
  return {
    type: actionTypes.FETCH_POINTS_OF_ZAZCAR,
    uid,
  };
}

function _fetchPointsOfZazcarSuccess(data) {
  return {
    type: actionTypes.FETCH_POINTS_OF_ZAZCAR_SUCCESS,
    data,
  };
}

function _fetchPointsOfZazcarFailure(error) {
  return {
    type: actionTypes.FETCH_POINTS_OF_ZAZCAR_FAILURE,
    error,
  };
}

export function fetchPointsOfZazcarClear() {
  return {
    type: actionTypes.FETCH_POINTS_OF_ZAZCAR_CLEAR,
  };
}
/* end-region #ZAZCAR */

/* region #TEMBICI */

function _fetchPointsOfTembici(uid) {
  return {
    type: actionTypes.FETCH_POINTS_OF_TEMBICI,
    uid,
  };
}

function _fetchPointsOfTembiciSuccess(data, nearbyTembiciLocation) {
  return {
    type: actionTypes.FETCH_POINTS_OF_TEMBICI_SUCCESS,
    data,
    nearbyTembiciLocation,
  };
}

function _fetchPointsOfTembiciFailure(error) {
  return {
    type: actionTypes.FETCH_POINTS_OF_TEMBICI_FAILURE,
    error,
  };
}

export function fetchPointsOfTembiciClear() {
  return {
    type: actionTypes.FETCH_POINTS_OF_TEMBICI_CLEAR,
  };
}
/* end-region #TEMBICI */

function _fetchPointsOfInterest(uid) {
  return {
    type: actionTypes.FETCH_POINTS_OF_INTEREST,
    uid,
  };
}

function _fetchPointsOfInterestSuccess(data) {
  return {
    type: actionTypes.FETCH_POINTS_OF_INTEREST_SUCCESS,
    data,
  };
}

function _fetchPointsOfInterestFailure(error) {
  return {
    type: actionTypes.FETCH_POINTS_OF_INTEREST_FAILURE,
    error,
  };
}

export function fetchPointsOfInterestClear() {
  return {
    type: actionTypes.FETCH_POINTS_OF_INTEREST_CLEAR,
  };
}

function _fetchDynamicPoints(uid) {
  return {
    type: actionTypes.FETCH_DYNAMIC_POINTS,
    uid,
  };
}

function _fetchDynamicPointsSuccess(data) {
  return {
    type: actionTypes.FETCH_DYNAMIC_POINTS_SUCCESS,
    data,
  };
}

function _fetchDynamicPointsFailure(error) {
  return {
    type: actionTypes.FETCH_DYNAMIC_POINTS_FAILURE,
    error,
  };
}

export function fetchDynamicPointsClear() {
  return {
    type: actionTypes.FETCH_DYNAMIC_POINTS_CLEAR,
  };
}

// const
const ITEMS_PER_PAGE = 250;

// #region Zazcar
export function fetchPointsOfZazcar(currentUserPosition) {
  return async function(dispatch, getState) {
    const requestUid = uuidv4();
    try {
      dispatch(_fetchPointsOfZazcar(requestUid));

      const response = await voudRequest('/zazcar/pod', 'GET', null, true);

      const managedData = response.payload.pods.map(item => {
        return {
          id: item.id,
          name: item.name,
          description: item.address,
          positionLatitude: item.location.lat,
          positionLongitude: item.location.lon,
          company: 'ZAZCAR',
          detail: item.cars,
          pointType: pointsOfInterestTypes.RENT_CAR,
          distance: calculateDistance(
            currentUserPosition.latitude,
            currentUserPosition.longitude,
            item.location.lat,
            item.location.lon,
            5
          ),
          externalId: item.id,
          openHoursString: item.openHoursString,
          availableCars: item.availableCars,
          carsCount: item.carsCount,
        };
      });

      dispatch(_fetchPointsOfZazcarSuccess(managedData));

      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message);

      if (getState().staticPoints.lastRequestUid !== requestUid) return;

      if (!requestErrorHandler(dispatch, error, _fetchPointsOfZazcarFailure(error.message))) {
        throw error;
      }
    }
  };
}
// #end region Zazcar

// #region Tembici
export function fetchPointsOfTembici(currentUserPosition) {
  return async function(dispatch, getState) {
    const requestUid = uuidv4();
    try {
      dispatch(_fetchPointsOfTembici(requestUid));
      const response = await voudRequest('/tembici/station_information/', 'GET', null, true);
      const responseDetail = await voudRequest('/tembici/station_status/', 'GET', null, true);

      const managedData = response.payload.data.stations.map(item => {
        const detail = responseDetail.payload.data.stations.filter(itemDetail => {
          return itemDetail.station_id == item.station_id && itemDetail;
        });
        return {
          id: item.station_id,
          name: item.name,
          description: item.address,
          positionLatitude: item.lat,
          positionLongitude: item.lon,
          tembiciAddress: item.address,
          capacity: item.capacity,
          company: 'TEMBICI',
          acceptedCards: [],
          fare: 99.99,
          lines: [],
          detail,
          pointType: pointsOfInterestTypes.BIKE,
          distance: calculateDistance(
            currentUserPosition.latitude,
            currentUserPosition.longitude,
            item.lat,
            item.lon,
            5
          ),
          externalId: item.station_id,
        };
      });
      const nearbyTembiciLocation = filterNearbyTembici(managedData, currentUserPosition);

      const resultDistances = nearbyTembiciLocation
        .map(item => Number.parseFloat(item.distance))
        .reduce((acc, cur) => acc && cur && Math.min(acc, cur));

      const nearbyTembiciByDistance = nearbyTembiciLocation.filter(
        item => item.distance == resultDistances
      );

      dispatch(_fetchPointsOfTembiciSuccess(managedData, nearbyTembiciByDistance[0]));

      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message);

      if (getState().pointsOfTembici.staticPoints.lastRequestUid !== requestUid) return;

      if (!requestErrorHandler(dispatch, error, _fetchPointsOfTembiciFailure(error.message))) {
        throw error;
      }
    }
  };
}
// #end region Tembici

// #region PointsOfInterest
export function fetchPointsOfInterest(radius, latitude, longitude, longitudeDelta) {
  return async function(dispatch, getState) {
    // Generate and dispatch request unique id
    // this is used later in thunk to ignore
    // old requests that take longer to respond
    const requestUid = uuidv4();
    try {
      dispatch(_fetchPointsOfInterest(requestUid));

      const removeUnusedTypes = getTypesFromZoomLevel(longitudeDelta);
      removeUnusedTypes.pop();
      removeUnusedTypes.pop();
      const response = await voudRequest(
        '/mobility/list-points',
        'POST',
        {
          userLocation: `${latitude},${longitude}`,
          radius,
          types: removeUnusedTypes,
          page: 0,
          size: ITEMS_PER_PAGE,
        },
        true
      );
      const data = mergeExistingPoints(getState().pointsOfInterest.data, response.payload.aaData);

      if (getState().pointsOfInterest.staticPoints.lastRequestUid === requestUid) {
        dispatch(_fetchPointsOfInterestSuccess(data));
      }

      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message);

      if (getState().pointsOfInterest.staticPoints.lastRequestUid !== requestUid) return;

      if (!requestErrorHandler(dispatch, error, _fetchPointsOfInterestFailure(error.message))) {
        throw error;
      }
    }
  };
}
// #end region PointsOfInterest

// #region DynamicPoints
export function fetchDynamicPoints(radius, latitude, longitude) {
  return async function(dispatch, getState) {
    // Generate and dispatch request unique id
    // this is used later in thunk to ignore
    // old requests that take longer to respond
    const requestUid = uuidv4();
    try {
      dispatch(_fetchDynamicPoints(requestUid));

      const response = await voudRequest(
        '/mobility/list-dynamic-points',
        'POST',
        {
          userLocation: `${latitude},${longitude}`,
          radius,
          size: ITEMS_PER_PAGE,
        },
        true
      );

      const data = mergeExistingPoints(getState().pointsOfInterest.data, response.payload);

      // compare this request UID to lastRequestUid on store,
      // if is different, a newer request has been made,
      // and the results of this one should be ignored
      if (getState().pointsOfInterest.dynamicPoints.lastRequestUid === requestUid) {
        dispatch(_fetchDynamicPointsSuccess(data));
      }
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message);

      if (getState().pointsOfInterest.dynamicPoints.lastRequestUid !== requestUid) return;

      if (!requestErrorHandler(dispatch, error, _fetchDynamicPointsFailure(error.message))) {
        throw error;
      }
    }
  };
}
// #end region DynamicPoints
