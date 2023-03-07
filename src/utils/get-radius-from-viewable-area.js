import { calculateDistance } from './haversine';
/**
 * Uses haversine to calculate radius using
 * lat, lng and deltas
 * Returns distance in meters
 * @param {number} latitude - latitude of center
 * @param {number} longitude - longitude of center
 * @param {number} latitudeDelta - latitudeDelta of current zoom level
 * @param {number} longitudeDelta - longitudeDelta of current zoom level
 * @returns {number} distance in km
 */
export function getRadiusFromViewableArea(latitude, longitude, latitudeDelta, longitudeDelta) {
  const ne = {
    longitude: longitude + (longitudeDelta / 2),
    latitude: latitude + (latitudeDelta / 2)
  }

  const haversine = calculateDistance(latitude, longitude, ne.latitude, ne.longitude);

  return haversine;
}

export function getVouDRadiusFromViewableArea(latitude, longitude, latitudeDelta, longitudeDelta) {
  return getRadiusFromViewableArea(latitude, longitude, latitudeDelta, longitudeDelta) * 1.25;
}