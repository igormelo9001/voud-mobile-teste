// NPM imports
import base64 from "base-64";
import { Platform } from "react-native";
import firebase from "react-native-firebase";

// VouD imports
import { voudRequest, clearSessionToken } from "../shared/services";
import { requestErrorHandler } from "../shared/request-error-handler";
import { GASetUser } from "../shared/analytics";
import {
  persistProfile,
  clearProfileStorage,
  persistForceUpdateProfile
} from "./profile";
import { clearCardDataStorage } from "./transport-card";
import { GATrackEvent, GAEventParams } from "../shared/analytics";

// Actions
const PRE_AUTH = "voud/login/PRE_AUTH";
const PRE_AUTH_SUCCESS = "voud/login/PRE_AUTH_SUCCESS";
const PRE_AUTH_REQUEST_CARD_SUCCESS =
  "voud/login/PRE_AUTH_REQUEST_CARD_SUCCESS";
const PRE_AUTH_REQUEST_CARD_CLEAR = "voud/login/PRE_AUTH_REQUEST_CARD_CLEAR";
const PRE_AUTH_FAILURE = "voud/login/PRE_AUTH_FAILURE";
const PRE_AUTH_CLEAR = "voud/login/PRE_AUTH_CLEAR";

const LOGIN = "voud/login/LOGIN";
const LOGIN_SUCCESS = "voud/login/LOGIN_SUCCESS";
const LOGIN_FAILURE = "voud/login/LOGIN_FAILURE";
const LOGIN_CLEAR = "voud/login/LOGIN_CLEAR";
const LOGIN_FORCE_UPDATE_PROFILE = "voud/login/LOGIN_FORCE_UPDATE_PROFILE";
const LOGIN_USER_BLOCKED = "voud/login/LOGIN_USER_BLOCKED";

const LOGOUT = "voud/login/LOGOUT";

const RECOVER_PASSWORD = "voud/login/RECOVER_PASSWORD";
const RECOVER_PASSWORD_SUCCESS = "voud/login/RECOVER_PASSWORD_SUCCESS";
const RECOVER_PASSWORD_FAILURE = "voud/login/RECOVER_PASSWORD_FAILURE";
const RECOVER_PASSWORD_CLEAR = "voud/login/RECOVER_PASSWORD_CLEAR";

const CHANGE_PASSWORD = "voud/login/CHANGE_PASSWORD";
const CHANGE_PASSWORD_SUCCESS = "voud/login/CHANGE_PASSWORD_SUCCESS";
const CHANGE_PASSWORD_FAILURE = "voud/login/CHANGE_PASSWORD_FAILURE";
const CHANGE_PASSWORD_CLEAR = "voud/login/CHANGE_PASSWORD_CLEAR";

const CHECK_PASSWORD = "voud/login/CHECK_PASSWORD";
const CHECK_PASSWORD_SUCCESS = "voud/login/CHECK_PASSWORD_SUCCESS";
const CHECK_PASSWORD_FAILURE = "voud/login/CHECK_PASSWORD_FAILURE";
const CHECK_PASSWORD_CLEAR = "voud/login/CHECK_PASSWORD_CLEAR";

const SET_SESSION_EXPIRED = "voud/login/SET_SESSION_EXPIRED";

export const loginActions = {
  PRE_AUTH,
  PRE_AUTH_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT,
  RECOVER_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_SUCCESS,
  CHECK_PASSWORD_SUCCESS,
  LOGIN_FORCE_UPDATE_PROFILE,
  LOGIN_USER_BLOCKED
};

// Reducer
const initialState = {
  preAuth: {
    isFetching: false,
    error: ""
  },
  login: {
    isFetching: false,
    error: ""
  },
  recoverPassword: {
    isFetching: false,
    error: ""
  },
  changePassword: {
    isFetching: false,
    error: ""
  },
  checkPassword: {
    isFetching: false,
    error: ""
  },
  hasSessionExpired: false,
  preAuthRequestCard: {
    isRequestCard: false
  },
  forceUpdateProfile: false
};

function reducer(state = initialState, action) {
  switch (action.type) {
    // PRE AUTH
    case PRE_AUTH:
      return {
        ...state,
        preAuth: {
          isFetching: true,
          isRequestCard: false,
          error: ""
        }
      };
    case PRE_AUTH_FAILURE:
      return {
        ...state,
        preAuth: {
          isFetching: false,
          isRequestCard: false,
          error: action.error
        }
      };
    case PRE_AUTH_SUCCESS:
      return {
        ...state,
        preAuth: {
          isFetching: false,
          error: action.error
        }
      };

    case PRE_AUTH_REQUEST_CARD_SUCCESS:
      return {
        ...state,
        preAuthRequestCard: {
          isRequestCard: true
        }
      };

    case PRE_AUTH_REQUEST_CARD_CLEAR:
      return {
        ...state,
        preAuthRequestCard: {
          isRequestCard: false
        }
      };

    case PRE_AUTH_CLEAR:
      return {
        ...state,
        preAuth: {
          isFetching: false,
          error: ""
        }
      };

    // LOGIN
    case LOGIN:
      return {
        ...state,
        login: {
          isFetching: true,
          error: ""
        }
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        login: {
          isFetching: false,
          error: action.error
        }
      };
    case LOGIN_SUCCESS:
    case LOGIN_USER_BLOCKED:
    case LOGIN_CLEAR:
      return {
        ...state,
        login: {
          isFetching: false,
          error: ""
        }
      };

    case LOGIN_FORCE_UPDATE_PROFILE:
      return {
        ...state,
        login: {
          isFetching: false,
          error: ""
        },
        forceUpdateProfile: true
      };

    // RECOVER PASSWORD
    case RECOVER_PASSWORD:
      return {
        ...state,
        recoverPassword: {
          isFetching: true,
          error: ""
        }
      };
    case RECOVER_PASSWORD_FAILURE:
      return {
        ...state,
        recoverPassword: {
          isFetching: false,
          error: action.error
        }
      };
    case RECOVER_PASSWORD_SUCCESS:
    case RECOVER_PASSWORD_CLEAR:
      return {
        ...state,
        recoverPassword: {
          isFetching: false,
          error: ""
        }
      };

    // CHANGE PASSWORD
    case CHANGE_PASSWORD:
      return {
        ...state,
        changePassword: {
          isFetching: true,
          error: ""
        }
      };
    case CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        changePassword: {
          isFetching: false,
          error: action.error
        }
      };
    case CHANGE_PASSWORD_SUCCESS:
    case CHANGE_PASSWORD_CLEAR:
      return {
        ...state,
        changePassword: {
          isFetching: false,
          error: ""
        }
      };
    // CHECK PASSWORD
    case CHECK_PASSWORD:
      return {
        ...state,
        checkPassword: {
          isFetching: true,
          error: ""
        }
      };
    case CHECK_PASSWORD_FAILURE:
      return {
        ...state,
        checkPassword: {
          isFetching: false,
          error: action.error
        }
      };
    case CHECK_PASSWORD_SUCCESS:
    case CHECK_PASSWORD_CLEAR:
      return {
        ...state,
        checkPassword: {
          isFetching: false,
          error: ""
        }
      };

    case SET_SESSION_EXPIRED:
      return {
        ...state,
        hasSessionExpired: true
      };

    case LOGOUT:
      return {
        ...state,
        hasSessionExpired: false
      };

    default:
      return state;
  }
}

export default reducer;

// Actions creators

// PRE AUTH ACTIONS
function preAuth(cpf) {
  return {
    type: PRE_AUTH,
    cpf
  };
}
function preAuthSuccess(response) {
  return {
    type: PRE_AUTH_SUCCESS,
    response
  };
}

function preAuthRequestCardSuccess() {
  return {
    type: PRE_AUTH_REQUEST_CARD_SUCCESS
  };
}

function preAuthRequestCardClear() {
  return {
    type: PRE_AUTH_REQUEST_CARD_CLEAR
  };
}

function preAuthFailure(error) {
  return {
    type: PRE_AUTH_FAILURE,
    error
  };
}
export function preAuthClear() {
  return { type: PRE_AUTH_CLEAR };
}

// LOGIN ACTIONS
function login() {
  return { type: LOGIN };
}
function loginSuccess(response) {
  return {
    type: LOGIN_SUCCESS,
    response
  };
}
function loginFailure(error) {
  return {
    type: LOGIN_FAILURE,
    error
  };
}
export function loginClear() {
  return { type: LOGIN_CLEAR };
}

export function logout() {
  clearProfileStorage();
  clearCardDataStorage();
  clearSessionToken();
  if (Platform.OS === "ios") {
    firebase.notifications().setBadge(0);
  }
  return { type: LOGOUT };
}

// RECOVER PASSWORD ACTION CREATORS
function recoverPassword() {
  return { type: RECOVER_PASSWORD };
}
function recoverPasswordSuccess(response) {
  return {
    type: RECOVER_PASSWORD_SUCCESS,
    response
  };
}
function recoverPasswordFailure(error) {
  return {
    type: RECOVER_PASSWORD_FAILURE,
    error
  };
}
export function recoverPasswordClear() {
  return { type: RECOVER_PASSWORD_CLEAR };
}

// CHANGE PASSWORD ACTION CREATORS
function changePassword() {
  return { type: CHANGE_PASSWORD };
}
function changePasswordSuccess(response) {
  return {
    type: CHANGE_PASSWORD_SUCCESS,
    response
  };
}
function changePasswordFailure(error) {
  return {
    type: CHANGE_PASSWORD_FAILURE,
    error
  };
}
export function changePasswordClear() {
  return { type: CHANGE_PASSWORD_CLEAR };
}

// CHECK PASSWORD ACTION CREATORS
function checkPassword() {
  return { type: CHECK_PASSWORD };
}
function checkPasswordSuccess(response) {
  return {
    type: CHECK_PASSWORD_SUCCESS,
    response
  };
}
function checkPasswordFailure(error) {
  return {
    type: CHECK_PASSWORD_FAILURE,
    error
  };
}
export function checkPasswordClear() {
  return { type: CHECK_PASSWORD_CLEAR };
}

function forceUpdateProfileSucess(response) {
  return {
    type: LOGIN_FORCE_UPDATE_PROFILE,
    response
  };
}

function userBlocked(response) {
  return {
    type: LOGIN_USER_BLOCKED,
    response
  };
}

// thunk action creators

export function fetchPreAuth(cpf, preAuthrequestCard) {
  return async dispatch => {
    // dispatch request action
    dispatch(preAuth(cpf));

    try {
      const requestBody = {
        cpf
      };

      const response = await voudRequest(
        "/customer/pre-auth",
        "POST",
        requestBody
      );

      const {
        categories: { FORM },
        actions: { SUBMIT },
        labels: { SUBMIT_PRE_AUTH }
      } = GAEventParams;
      GATrackEvent(FORM, SUBMIT, SUBMIT_PRE_AUTH);

      dispatch(preAuthSuccess(response));

      if (preAuthrequestCard != undefined)
        dispatch(preAuthRequestCardSuccess());

      return {
        isRegistered:
          response.payload && response.payload.isRegistered
            ? response.payload.isRegistered
            : false
      };
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      requestErrorHandler(dispatch, error, preAuthFailure(error.message));
      throw error;
    }
  };
}

export function fetchLogin(
  cpf,
  password,
  fcmToken,
  facebookId,
  facebookAccessToken
) {
  return async (dispatch, getState) => {
    // dispatch request action
    dispatch(login());

    const { latitude, longitude } = getState().profile.position;
    let location;

    if (latitude && longitude) {
      location = `${latitude},${longitude}`;
    }

    try {
      const customerDeviceId = getState().config.deviceId;
      const customerDeviceModel = getState().config.deviceModel;
      const customerDeviceBrand = getState().config.deviceBrand;
      const ip = getState().config.deviceIP;

      const requestBody = {
        ...(cpf ? { cpf } : {}),
        ...(password ? { password: base64.encode(password) } : {}),
        ...(facebookId ? { facebookId } : {}),
        ...(facebookAccessToken ? { facebookAccessToken } : {}),
        fcmToken,
        devicePlatform: Platform.OS,
        ...(customerDeviceId ? { customerDeviceId } : {}),
        ...(customerDeviceModel ? { customerDeviceModel } : {}),
        ...(customerDeviceBrand ? { customerDeviceBrand } : {}),
        ...(ip ? { ip } : {}),
        ...(location ? { location } : {}),
        channel: "VOUD"
      };

      const response = await voudRequest(
        "/customer/auth/login",
        "POST",
        requestBody
      );
      if (__DEV__) console.tron.log(response);

      // Set GA User-ID
      const userId = response.payload.id
        ? response.payload.id.toString()
        : null;
      if (__DEV__) console.tron.log(`GA - setUser - id: ${userId}`);
      if (userId) {
        GASetUser(userId);
        firebase.analytics().setUserId(userId);
      }

      const {
        categories: { FORM },
        actions: { SUBMIT },
        labels: {
          SUBMIT_LOGIN,
          SUBMIT_LOGIN_BLOCKED,
          SUBMIT_LOGIN_FORCE_UPDATE_PROFILE
        }
      } = GAEventParams;

      clearProfileStorage();

      if (response.payload.isBlocked) {
        GATrackEvent(FORM, SUBMIT, SUBMIT_LOGIN_BLOCKED);

        // User BLOCKED
        dispatch(userBlocked(response));
      } else if (response.payload.forceUpdateProfile) {
        GATrackEvent(FORM, SUBMIT, SUBMIT_LOGIN_FORCE_UPDATE_PROFILE);

        // Update name, birthDate
        persistProfile(getState());
        dispatch(forceUpdateProfileSucess(response));
      } else if (
        !response.payload.isBlocked &&
        !response.payload.forceUpdateProfile
      ) {
        GATrackEvent(FORM, SUBMIT, SUBMIT_LOGIN);

        dispatch(loginSuccess(response));
        persistProfile(getState());
      }
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      requestErrorHandler(dispatch, error, loginFailure(error.message));
      throw error;
    }
  };
}

export function fetchRecoverPassword(cpf, mobile, last3Digits, email, isEmail) {
  return function(dispatch) {
    // dispatch request action
    dispatch(recoverPassword());

    let url = !isEmail
      ? "/customer/reset-password-request"
      : "/customer/reset-password-email-request";
    let requestBody = !isEmail
      ? {
          cpf,
          mobile: mobile.slice(0, -3) + last3Digits
        }
      : {
          cpf,
          email: email
        };

    (async () => {
      try {
        const response = await voudRequest(url, "POST", requestBody);

        const {
          categories: { FORM },
          actions: { SUBMIT },
          labels: { SUBMIT_RECOVER_PW }
        } = GAEventParams;
        GATrackEvent(FORM, SUBMIT, SUBMIT_RECOVER_PW);
        dispatch(recoverPasswordSuccess(response));
      } catch (error) {
        if (__DEV__) console.tron.log(error.message, true);
        requestErrorHandler(
          dispatch,
          error,
          recoverPasswordFailure(error.message)
        );
      }
    })();
  };
}

export function fetchChangePassword(cpf, password, verificationCode) {
  return async dispatch => {
    // dispatch request action
    dispatch(changePassword());

    try {
      const requestBody = {
        cpf,
        password: base64.encode(password),
        verificationCode: `V-${verificationCode}`
      };
      const response = await voudRequest(
        "/customer/reset-password",
        "POST",
        requestBody
      );
      dispatch(changePasswordSuccess(response));
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      requestErrorHandler(
        dispatch,
        error,
        changePasswordFailure(error.message)
      );
      throw error;
    }
  };
}

export function fetchCheckPassword(cpf, password, fcmToken) {
  return async (dispatch, getState) => {
    // dispatch request action
    dispatch(checkPassword());

    try {
      const customerDeviceId = getState().config.deviceId;
      const requestBody = {
        cpf,
        password: base64.encode(password),
        fcmToken,
        devicePlatform: Platform.OS,
        ...(customerDeviceId ? { customerDeviceId } : {})
      };

      const response = await voudRequest(
        "/customer/auth/login",
        "POST",
        requestBody
      );
      if (__DEV__) console.tron.log(response);

      dispatch(checkPasswordSuccess(response));
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      requestErrorHandler(dispatch, error, checkPasswordFailure(error.message));
      throw error;
    }
  };
}

// Session Expired

function _setSessionExpired() {
  return {
    type: SET_SESSION_EXPIRED
  };
}

export function setSessionExpired() {
  return async (dispatch, getState) => {
    const hasSessionExpired = getState().login.hasSessionExpired;
    dispatch(_setSessionExpired());
    return hasSessionExpired;
  };
}

export function clearPreAuthRequestCardClear() {
  return async dispatch => {
    dispatch(preAuthRequestCardClear());
  };
}
