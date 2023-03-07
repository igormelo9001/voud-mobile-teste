import axios from "axios";

import {
  initiateRemoteConfig,
  getVAHHostUrl,
  getVAHBearerToken
} from "../../shared/remote-config";

// Base URLs
// const VAH_BASE_URL = "http://test-api.voud.com.br:8090/v1"; // Autopass DEV
// const VAH_BASE_URL = "https://homolog-api.voud.com.br:8090/v1"; // Autopass HML
// const VAH_BASE_URL = "https://api.voud.com.br:8090/v1"; // Autopass PROD

initiateRemoteConfig();

/**
 * fetch wrapper, including headers configurations
 * @param {string} endpoint - service endopoint
 * @param {Object} requestBody
 */
const vahRequest = async (endpoint, requestBody) => {
  const VAH_BEARER_TOKEN = await getVAHBearerToken();
  const VAH_BASE_URL = await getVAHHostUrl();

  const config = {
    method: "POST",
    url: endpoint,
    baseURL: VAH_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VAH_BEARER_TOKEN}`
    }
  };

  if (requestBody) config.data = JSON.stringify(requestBody);
  let response;

  try {
    response = await axios(config);
  } catch (error) {
    const response = error.response;
    const responseJson = response.data;

    if (response.status !== 200) {
      let error;
      if (response.status === 503 || response.status === 400) {
        error = new Error("Serviço temporariamente indispónivel.");
      } else {
        const errorMessage =
          responseJson && responseJson.length > 0
            ? responseJson[0].Message
            : null;
        error = new Error(errorMessage || response.status);
        error.response = response;
      }

      throw error;
    }
  }

  const responseJson = response.data;

  return responseJson;
};

export default vahRequest;
