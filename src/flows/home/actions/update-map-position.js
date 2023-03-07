import actionTypes from './types';

export function updateMapPosition(latitude, longitude, latitudeDelta, longitudeDelta) {
  return {
    type: actionTypes.UPDATE_CURRENT_MAP_POSITION,
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta
  }
}