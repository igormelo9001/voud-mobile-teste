// NPM
import moment from 'moment';
import { googleMapsRequest } from '../../../google-maps/services';

// Action types
import actionTypes from './types';
import { uuidv4 } from '../../../utils/uuid-util';
import { createObject, isNewSearchTerm, queryObject, saveObject } from '../../../utils/realm-utils';

// consts
const BASIC_FIELDS = 'address_components,formatted_address,geometry,name';

// Synchronous actions

// Place search
export function _fetchPlaceSearch() {
  return { type: actionTypes.FETCH_PLACE_SEARCH };
}

export function _fetchPlaceSearchSuccess(response) {
  return { type: actionTypes.FETCH_PLACE_SEARCH_SUCCESS, response };
}

export function _fetchPlaceSearchFailure(error) {
  return { type: actionTypes.FETCH_PLACE_SEARCH_FAILURE, error };
}

export function clearPlaceSearch() {
  return { type: actionTypes.PLACE_SEARCH_CLEAR };
}

// Predictions
export function _fetchPredictions() {
  return { type: actionTypes.FETCH_PREDICTIONS };
}

export function _fetchPredictionsSuccess(response) {
  return { type: actionTypes.FETCH_PREDICTIONS_SUCCESS, response };
}

export function _fetchPredictionsFailure(error) {
  return { type: actionTypes.FETCH_PREDICTIONS_FAILURE, error };
}

export function clearPredictions() {
  return { type: actionTypes.PREDICTIONS_CLEAR };
}

export function setPredictionsSessionToken(sessionToken) {
  return { type: actionTypes.SET_PREDICTIONS_SESSION_TOKEN, sessionToken };
}

// Place details
export  function _fetchPlaceDetails() {
  return { type: actionTypes.FETCH_PLACE_DETAILS };
}

export function _fetchPlaceDetailsSuccess(response, isOrigin, isDestination) {
  return {
    type: actionTypes.FETCH_PLACE_DETAILS_SUCCESS,
    response,
    isOrigin,
    isDestination,
  };
}

export function _fetchPlaceDetailsFailure(error) {
  return { type: actionTypes.FETCH_PLACE_DETAILS_FAILURE, error };
}

export function clearPlaceDetails() {
  return { type: actionTypes.PLACE_DETAILS_CLEAR };
}

// Change directions
export function searchChangeDirections() {
  return { type: actionTypes.SEARCH_CHANGE_DIRECTIONS };
}

// Thunks

export const normalizeQuery = query => {
  const querySplited = query.split(',');
  return querySplited.map(item => item.slice(0, 9)).reduce((acc, cur) => acc.concat(`,${cur}`));
};

export function fetchPlaceTextSearch(query = '', radius = 1) {
  return async dispatch => {
    dispatch(_fetchPlaceSearch());

    try {
      const params = {
        query,
        radius,
      };

      const normalizeQueryString = normalizeQuery(query);
      const dayToCompare = moment(new Date())
        .parseZone()
        .local()
        .format('YYYY-MM-DDTHH:mm:ss');

      if (__DEV__) console.tron.log(`day to compare TEXT SEARCH${  dayToCompare}`);

      const TEXT_SEARCH = 'TextSearch';
      const FILTERS = {
        operator: 'AND',
        filters: [
          { key: 'query', value: normalizeQueryString, operator: 'eq' },
          { key: 'timestamp', value: dayToCompare, operator: 'gt' },
        ],
      };

      const isNewSearchQuery = await isNewSearchTerm(FILTERS, TEXT_SEARCH);
      if (!isNewSearchQuery) {
        const textSearch = await queryObject(TEXT_SEARCH, FILTERS);

        const res = {
          html_attributions: [],
          results: new Array(textSearch[0]),
          status: 'OK',
        };

        dispatch(_fetchPlaceSearchSuccess(res));
        return res;
      }

      const response = await googleMapsRequest('/place/textsearch/json', params);

      if (__DEV__) console.tron.log(response);
      
      const textsearch = response.results ? response.results.map(item => {
        return {
          ...item,
          query: normalizeQueryString,
        };
      }): '';

      const dateToExpire = moment(new Date())
        .add(15, 'days')
        .parseZone(new Date())
        .local()
        .format('YYYY-MM-DDTHH:mm:ss');
      const timestamp = isNewSearchQuery ? dateToExpire : null;
      await saveObject(TEXT_SEARCH, textsearch, null, timestamp);

      dispatch(_fetchPlaceSearchSuccess(response));

      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message);
      dispatch(_fetchPlaceSearchFailure(error.message));
      throw error;
    }
  };
}

export function fetchPredictions(input) {
  return async (dispatch, getState) => {
    dispatch(_fetchPredictions());
    try {
      const searchTerm = input.trim();
      const dayToCompare = moment(new Date())
        .parseZone()
        .local()
        .format('YYYY-MM-DDTHH:mm:ss');

      if (__DEV__) console.tron.log(`day to compare${  dayToCompare}`);

      const PREDICTIONS = 'Predictions';
      const FILTERS = {
        operator: 'AND',
        filters: [
          { key: 'searchTerm', value: searchTerm, operator: 'eq' },
          { key: 'timestamp', value: dayToCompare, operator: 'gt' },
        ],
      };
      const isNewSearchTermResult = await isNewSearchTerm(FILTERS, PREDICTIONS);
      if (!isNewSearchTermResult) {
        const predictions = await queryObject(PREDICTIONS, FILTERS);
        dispatch(_fetchPredictionsSuccess({ predictions }));
        return;
      }

      let sessiontoken = getState().mobilityServices.predictions.sessionToken;

      if (sessiontoken === '') {
        sessiontoken = uuidv4();
        dispatch(setPredictionsSessionToken(sessiontoken));
      }

      const params = {
        input: input || '',
        sessiontoken,
      };

      const { latitude, longitude } = getState().profile.position;

      if (latitude && longitude) {
        params.location = `${latitude},${longitude}`;
      }

      const response = await googleMapsRequest('/place/autocomplete/json', params);

      const dateToExpire = moment(new Date())
        .add(15, 'days')
        .parseZone(new Date())
        .local()
        .format('YYYY-MM-DDTHH:mm:ss');
      const timestamp = isNewSearchTermResult ? dateToExpire : null;
      await saveObject(PREDICTIONS, response.predictions, searchTerm, timestamp);

      if (__DEV__) console.tron.log(response);
      dispatch(_fetchPredictionsSuccess(response));
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message);
      dispatch(_fetchPredictionsFailure(error.message));
      throw error;
    }
  };
}

export function fetchPlaceDetails(placeid, isOrigin = false, isDestination = false) {
  return async (dispatch, getState) => {
    dispatch(_fetchPlaceDetails());

    try {
      const sessiontoken = getState().mobilityServices.predictions.sessionToken;
      const params = {
        placeid,
        fields: BASIC_FIELDS,
        ...(sessiontoken !== '' ? { sessiontoken } : {}),
      };

      const response = await googleMapsRequest('/place/details/json', params);

      if (__DEV__) console.tron.log(response);

      dispatch(_fetchPlaceDetailsSuccess(response, isOrigin, isDestination));
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message);
      dispatch(_fetchPlaceDetailsFailure(error.message));
      throw error;
    }
  };
}
