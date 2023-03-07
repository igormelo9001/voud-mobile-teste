// NPM imports
import axios from "axios";

import {
  SessionExpiredError,
  VoudError,
  UnsupportedVersionError,
  ServiceUnavailableError
} from "./custom-errors";
import { saveItem, getItem, removeItem, getJson } from "../utils/async-storage";
import { getBuildNumber } from "../utils/device-info";
import { getHostUrl, initiateRemoteConfig } from "./remote-config";

initiateRemoteConfig();

// Private variables
// Base URLs
// const VOUD_BASE_URL = "http://test-api.voud.com.br:8082/voud"; // Autopass DEV
// const VOUD_BASE_URL = "https://homolog-api.voud.com.br:8082/voud"; // Autopass HML
// const VOUD_BASE_URL = "https://api.voud.com.br:8084/voud"; // Autopass PROD

const VOUD_USER_TOKEN_KEY = "x-voud-user-token";
const SESSION_TOKEN_ASYNC_KEY = "sessionToken";
const VOUD_SCOO_TOKEN = "Authorization";
const SESSION_SCOO_TOKEN_ASYNC_KEY = "scooterToken";

export const voudErrorCodes = {
  VT_CARD_DOES_NOT_BELONG_TO_USER: "412007",
  EXCEEDED_DAILY_PURCHASE_LIMIT: "999002",
  ACQUIRER_INTEGRATION_ERROR: "999901"
};

export const httpStatusCodes = {
  SESSION_EXPIRED: 403,
  UNSUPPORTED_VERSION: 409,
  SERVICE_UNAVAILABLE: 503
};

// Session Token
let sessionToken;

// Token Scoo;
let scooToken;

export const clearSessionToken = () => {
  sessionToken = undefined;
  removeItem(SESSION_TOKEN_ASYNC_KEY);
};

/**
 * fetch wrapper, including headers configurations
 * @param {string} endpoint - service endopoint
 * @param {string} method - request method ('GET', 'POST', 'PUT', 'DELETE')
 * @param {Object} requestBody
 */
export const voudRequest = async (
  endpoint,
  method,
  requestBody,
  isAuth = false,
  isScoo = false,
  isAuthScoo = false
) => {
  if (isAuth && !sessionToken) {
    sessionToken = await getItem(SESSION_TOKEN_ASYNC_KEY);
  }

  if (isScoo) {
    scooToken = await getJson(SESSION_SCOO_TOKEN_ASYNC_KEY);
  }
  const VOUD_BASE_URL = await getHostUrl();
  const buildNumber = getBuildNumber();

  const config = {
    method,
    url: endpoint,
    baseURL: VOUD_BASE_URL,
    headers: {
      ...(isAuth ? { [VOUD_USER_TOKEN_KEY]: sessionToken } : {}),
      "x-voud-build-number": buildNumber,
      "Content-Type": "application/json",
      "X-VOUD-CHANNEL": "VOUD",
      ...(isScoo && !isAuthScoo
        ? { [VOUD_SCOO_TOKEN]: ` Token ${scooToken.token}` }
        : {})
    }
  };

  if (requestBody) config.data = requestBody;
  let response;

  try {
    response = await axios(config);
  } catch (error) {
    const response = error.response;
    const responseJson = response.data;

    if (response.status !== 200) {
      const errorMessage = responseJson.returnMessage || response.status;

      if (response.status === httpStatusCodes.SESSION_EXPIRED) {
        throw new SessionExpiredError(errorMessage, response.status);
      }

      if (response.status === httpStatusCodes.UNSUPPORTED_VERSION) {
        throw new UnsupportedVersionError(errorMessage, response.status);
      }

      if (response.status === httpStatusCodes.SERVICE_UNAVAILABLE) {
        const messageTitle = responseJson.title ? responseJson.title : "";
        const messageBody = responseJson.message ? responseJson.message : "";
        throw new ServiceUnavailableError(
          messageTitle,
          messageBody,
          response.status
        );
      }

      const error = new VoudError(errorMessage, responseJson.returnCode, {
        ...responseJson
      });
      error.response = response;
      throw error;
    }
  }

  const responseJson = response.data;

  const voudSessionToken = response.headers[VOUD_USER_TOKEN_KEY];
  if (voudSessionToken) {
    sessionToken = voudSessionToken;
    saveItem(SESSION_TOKEN_ASYNC_KEY, voudSessionToken);
  }

  if (responseJson.returnCode && responseJson.returnCode !== "0") {
    throw new VoudError(responseJson.returnMessage, responseJson.returnCode, {
      ...responseJson
    });
  }
  return responseJson;
};
