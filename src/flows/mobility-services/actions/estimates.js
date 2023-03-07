// NPM 
import { Linking } from 'react-native';

import vahRequest from '../services';

// Action types
import actionTypes from './types';

// Synchronous actions

// Estimates
function _fetchEstimates() {
  return { type: actionTypes.FETCH_ESTIMATES }
}

function _fetchEstimatesSuccess(response) {
  return { type: actionTypes.FETCH_ESTIMATES_SUCCESS, response };
}

function _fetchEstimatesFailure(error) {
  return { type: actionTypes.FETCH_ESTIMATES_FAILURE, error };
}

export function clearEstimates() {
  return { type: actionTypes.ESTIMATES_CLEAR };
}

export function selectMobilityService(id) {
  return { type: actionTypes.SELECT_SERVICE, id };
}

// Estimate action
function _fetchEstimateAction() {
  return { type: actionTypes.FETCH_ESTIMATE_ACTION }
}

function _fetchEstimateActionSuccess(response) {
  return { type: actionTypes.FETCH_ESTIMATE_ACTION_SUCCESS, response };
}

function _fetchEstimateActionFailure(error) {
  return { type: actionTypes.FETCH_ESTIMATE_ACTION_FAILURE, error };
}

// Thunks

const extractDataFromAddressComponents = (addressComponents, type) => {
  const matchedComponent = addressComponents.find(component => component.types.indexOf(type) !== -1);
  if (matchedComponent) {
    return matchedComponent.long_name;
  }
  return undefined;
};

const extractParamsFromPlaceDetails = (placeDetails, prefix) => {
  if (!placeDetails || !placeDetails.geometry) return;

  const { name, address_components: addressComponents, geometry: { location } } = placeDetails;
  
  const addressItems = [];
  const street = extractDataFromAddressComponents(addressComponents, 'route');
  if (street) addressItems.push(street);
  const number = extractDataFromAddressComponents(addressComponents, 'street_number');
  if (number) addressItems.push(number);
  const address = street ? addressItems.join(', ') : name;
  
  const city = extractDataFromAddressComponents(addressComponents, 'administrative_area_level_2');
  const state = extractDataFromAddressComponents(addressComponents, 'administrative_area_level_1');
  return {
    [`${prefix}address`]: address,
    [`${prefix}state`]: state,
    [`${prefix}city`]: city,
    // [`${prefix}zip_code`]: 'x',
    [`${prefix}latitude`]: location.lat,
    [`${prefix}longitude`]: location.lng,
  }
};

const checkInstalledPlayersApps = async response => {
  const players = response && response.data ? response.data.players : {};
  for (let key in players) {
    const player = players[key];
    const url = player.deeplink_url;

    try {
      player.installed = await Linking.canOpenURL(url);
    } catch (error) {
      if (__DEV__) console.tron.log(error.message);
      player.installed = false;
    }
  }
  return response;
}

export function fetchEstimates(originPlaceDetails, destinationPlaceDetails) {
  return async dispatch => {
    dispatch(_fetchEstimates());

    try {
      const requestBody = {
        ...extractParamsFromPlaceDetails(originPlaceDetails, 'start_'),
        ...extractParamsFromPlaceDetails(destinationPlaceDetails, 'end_'),
        app_version: '1',
      };

      let response = await vahRequest('/estimates/urban', requestBody);
      response = await checkInstalledPlayersApps(response);

      if (__DEV__) console.tron.log(response);
      dispatch(_fetchEstimatesSuccess(response));
    } catch (error) {
      if (__DEV__) console.tron.log(error.message);
      dispatch(_fetchEstimatesFailure(error.message));
      throw error;
    }
  }
}

export function fetchEstimateAction(urban_search_id, urban_result_id, isStore = false) {
  return async dispatch => {
    dispatch(_fetchEstimateAction());

    try {
      const requestBody = {
        urban_search_id,
        urban_result_id,
        action: isStore ? 'store' : 'trip',
      };

      const response = await vahRequest('/estimates/urban/action', requestBody);
      if (__DEV__) console.tron.log(response);
      dispatch(_fetchEstimateActionSuccess(response));
    } catch (error) {
      if (__DEV__) console.tron.log(error.message);
      dispatch(_fetchEstimateActionFailure(error.message));
      throw error;
    }
  }
}
