/**
 * Calculates the distance between 2 points on Earth.
 * Uses haversine and an adjustment coefficient
 * https://en.wikipedia.org/wiki/Haversine_formula
 * @param {number} lat - latitude of point 1
 * @param {number} long - longitude of point 1
 * @param {number} lat2 - latitude of point 2
 * @param {number} long2 - longitude of point 2
 * @param {number} precision - number of decimal digits
 * @returns {number} distance in kilometers
 */
export function calculateDistance(lat, long, lat2, long2, precision = 1) {
    const earthRadius = 6371;
    const adjustment = 1.2;
    lat = angleToRad(lat);
    lat2 = angleToRad(lat2);
    const latTheta = lat - lat2;
    const longTheta =angleToRad(long - long2);
    const d = 2 * earthRadius * Math.asin(Math.sqrt(hav(latTheta) + Math.cos(lat) * Math.cos(lat2) * hav(longTheta)));
    return (d * adjustment).toFixed(precision);
}

function hav(theta) {
    return (1 - Math.cos(theta))/2;
}

function angleToRad(angle) {
    return Math.PI * angle/180;
}
