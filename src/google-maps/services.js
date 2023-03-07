import {
  initiateRemoteConfig,
  getGoogleMapsHostUrl
} from "../shared/remote-config";

initiateRemoteConfig();

// Base URLs
// const GOOGLE_MAPS_BASE_URL = 'http://test-api.voud.com.br:8086/maps/api'; // Autopass DEV
// const GOOGLE_MAPS_BASE_URL = "https://homolog-api.voud.com.br:8091/maps/api"; // Autopass HML
// const GOOGLE_MAPS_BASE_URL = 'https://api.voud.com.br:8091/maps/api'; // Autopass PROD

export const googleMapsRequest = async (endpoint, params) => {
  const config = {
    method: "GET"
  };

  const queryStrings = ["language=pt-BR"];

  if (params) {
    for (const key in params) {
      queryStrings.push(`${key}=${encodeURIComponent(params[key])}`);
    }
  }

  const GOOGLE_MAPS_BASE_URL = await getGoogleMapsHostUrl();

  const response = await fetch(
    `${GOOGLE_MAPS_BASE_URL}${endpoint}?${queryStrings.join("&")}`,
    config
  );
  const responseJson = await response.json();

  if (!response.ok || responseJson.status !== "OK") {
    const error = new Error(responseJson.error_message || response.status);
    error.response = response;
    throw error;
  }
  return responseJson;
};
