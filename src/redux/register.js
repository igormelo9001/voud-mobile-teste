// NPM imports
import base64 from 'base-64';
import Moment from 'moment';
import { Platform } from 'react-native';

// VouD imports
import { voudRequest } from '../shared/services';
import { persistProfile } from './profile';
import { GAEventParams, GATrackEvent } from '../shared/analytics';
import { FBEventsConstants, FBLogEvent } from '../shared/facebook';
import { requestErrorHandler } from '../shared/request-error-handler';

// Actions
const REGISTER = 'voud/register/REGISTER';
const REGISTER_SUCCESS = 'voud/register/REGISTER_SUCCESS';
const REGISTER_FAILURE = 'voud/register/REGISTER_FAILURE';
const REGISTER_CLEAR = 'voud/register/REGISTER_CLEAR';

const CONFIRM_MOBILE = 'voud/register/CONFIRM_MOBILE';
const CONFIRM_MOBILE_SUCCESS = 'voud/register/CONFIRM_MOBILE_SUCCESS';
const CONFIRM_MOBILE_FAILURE = 'voud/register/CONFIRM_MOBILE_FAILURE';
const CONFIRM_MOBILE_CLEAR = 'voud/register/CONFIRM_MOBILE_CLEAR';

const RESEND_MOBILE_CONFIRMATION = 'voud/register/RESEND_MOBILE_CONFIRMATION';
const RESEND_MOBILE_CONFIRMATION_SUCCESS = 'voud/register/RESEND_MOBILE_CONFIRMATION_SUCCESS';
const RESEND_MOBILE_CONFIRMATION_FAILURE = 'voud/register/RESEND_MOBILE_CONFIRMATION_FAILURE';

const CONFIRM_EMAIL = 'voud/register/CONFIRM_EMAIL';
const CONFIRM_EMAIL_SUCCESS = 'voud/register/CONFIRM_EMAIL_SUCCESS';
const CONFIRM_EMAIL_FAILURE = 'voud/register/CONFIRM_EMAIL_FAILURE';
const CONFIRM_EMAIL_CLEAR = 'voud/register/CONFIRM_EMAIL_CLEAR';

const RESEND_EMAIL_CONFIRMATION = 'voud/register/RESEND_EMAIL_CONFIRMATION';
const RESEND_EMAIL_CONFIRMATION_SUCCESS = 'voud/register/RESEND_EMAIL_CONFIRMATION_SUCCESS';
const RESEND_EMAIL_CONFIRMATION_FAILURE = 'voud/register/RESEND_EMAIL_CONFIRMATION_FAILURE';

export const registerActions = {
  REGISTER_SUCCESS,
  CONFIRM_MOBILE_SUCCESS,
  CONFIRM_EMAIL_SUCCESS,
  RESEND_MOBILE_CONFIRMATION_SUCCESS,
  RESEND_MOBILE_CONFIRMATION_FAILURE,
  RESEND_EMAIL_CONFIRMATION_SUCCESS,
  RESEND_EMAIL_CONFIRMATION_FAILURE,
};

// Reducer
const initialState = {
  register: {
    isFetching: false,
    error: '',
  },
  confirmMobile: {
    isFetching: false,
    error: '',
  },
  resendMobileConfirmation: {
    isFetching: false,
    error: '',
  },
  confirmEmail: {
    isFetching: false,
    error: '',
  },
  resendEmailConfirmation: {
    isFetching: false,
    error: '',
  },
};

function reducer(state = initialState, action) {
  switch (action.type) {
    // REGISTER
    case REGISTER:
      return {
        ...state,
        register: {
          isFetching: true,
          error: '',
        },
      };
    case REGISTER_FAILURE:
      return {
        ...state,
        register: {
          isFetching: false,
          error: action.error,
        },
      };
    case REGISTER_SUCCESS:
    case REGISTER_CLEAR:
      return {
        ...state,
        register: {
          isFetching: false,
          error: '',
        },
      };

    // CONFIRM MOBILE
    case CONFIRM_MOBILE:
      return {
        ...state,
        confirmMobile: {
          isFetching: true,
          error: '',
        },
      };
    case CONFIRM_MOBILE_FAILURE:
      return {
        ...state,
        confirmMobile: {
          isFetching: false,
          error: action.error,
        },
      };
    case CONFIRM_MOBILE_SUCCESS:
    case CONFIRM_MOBILE_CLEAR:
      return {
        ...state,
        confirmMobile: {
          isFetching: false,
          error: '',
        },
      };

    // RESEND MOBILE CONFIRMATION
    case RESEND_MOBILE_CONFIRMATION:
      return {
        ...state,
        resendMobileConfirmation: {
          isFetching: true,
          error: '',
        },
      };
    case RESEND_MOBILE_CONFIRMATION_SUCCESS:
      return {
        ...state,
        resendMobileConfirmation: {
          isFetching: false,
          error: '',
        },
      };
    case RESEND_MOBILE_CONFIRMATION_FAILURE:
      return {
        ...state,
        resendMobileConfirmation: {
          isFetching: false,
          error: action.error,
        },
      };

    // CONFIRM EMAIL
    case CONFIRM_EMAIL:
      return {
        ...state,
        confirmEmail: {
          isFetching: true,
          error: '',
        },
      };
    case CONFIRM_EMAIL_FAILURE:
      return {
        ...state,
        confirmEmail: {
          isFetching: false,
          error: action.error,
        },
      };
    case CONFIRM_EMAIL_SUCCESS:
    case CONFIRM_EMAIL_CLEAR:
      return {
        ...state,
        confirmEmail: {
          isFetching: false,
          error: '',
        },
      };

    // RESEND EMAIL CONFIRMATION
    case RESEND_EMAIL_CONFIRMATION:
      return {
        ...state,
        resendEmailConfirmation: {
          isFetching: true,
          error: '',
        },
      };
    case RESEND_EMAIL_CONFIRMATION_SUCCESS:
      return {
        ...state,
        resendEmailConfirmation: {
          isFetching: false,
          error: '',
        },
      };
    case RESEND_EMAIL_CONFIRMATION_FAILURE:
      return {
        ...state,
        resendEmailConfirmation: {
          isFetching: false,
          error: action.error,
        },
      };

    default:
      return state;
  }
}

export default reducer;

// Actions creators

// REGISTER ACTION CREATORS
function register() {
  return { type: REGISTER };
}
function registerSuccess(response) {
  return {
    type: REGISTER_SUCCESS,
    response,
  };
}
function registerFailure(error) {
  return {
    type: REGISTER_FAILURE,
    error,
  };
}
export function registerClear() {
  return { type: REGISTER_CLEAR };
}

// CONFIRM MOBILE ACTION CREATORS
function confirmMobile() {
  return { type: CONFIRM_MOBILE };
}
function confirmMobileSuccess(response) {
  return {
    type: CONFIRM_MOBILE_SUCCESS,
    response,
  };
}
function confirmMobileFailure(error) {
  return {
    type: CONFIRM_MOBILE_FAILURE,
    error,
  };
}
export function confirmMobileClear() {
  return { type: CONFIRM_MOBILE_CLEAR };
}

// RESEND MOBILE CONFIRMATION ACTION CREATORS
function resendMobileConfirmation() {
  return { type: RESEND_MOBILE_CONFIRMATION };
}
function resendMobileConfirmationSuccess(response) {
  return {
    type: RESEND_MOBILE_CONFIRMATION_SUCCESS,
    response,
  };
}
function resendMobileConfirmationFailure(error) {
  return {
    type: RESEND_MOBILE_CONFIRMATION_FAILURE,
    error,
  };
}

// CONFIRM EMAIL ACTION CREATORS
function confirmEmail() {
  return { type: CONFIRM_EMAIL };
}
function confirmEmailSuccess(response) {
  return {
    type: CONFIRM_EMAIL_SUCCESS,
    response,
  };
}
function confirmEmailFailure(error) {
  return {
    type: CONFIRM_EMAIL_FAILURE,
    error,
  };
}
export function confirmEmailClear() {
  return { type: CONFIRM_EMAIL_CLEAR };
}

// RESEND EMAIL CONFIRMATION ACTION CREATORS
function resendEmailConfirmation() {
  return { type: RESEND_EMAIL_CONFIRMATION };
}
function resendEmailConfirmationSuccess(response) {
  return {
    type: RESEND_EMAIL_CONFIRMATION_SUCCESS,
    response,
  };
}
function resendEmailConfirmationFailure(error) {
  return {
    type: RESEND_EMAIL_CONFIRMATION_FAILURE,
    error,
  };
}

// Thunk action creators

export function fetchRegister(
  name,
  lastName,
  cpf,
  password,
  email,
  discountCode,
  mobile,
  isAllowSendEmail = false,
  fcmToken,
  birthDate,
  motherName,
  addressFields,
  facebookId,
  facebookAccessToken
) {
  return async function(dispatch, getState) {
    // dispatch request action
    dispatch(register());

    try {
      const customerDeviceId = getState().config.deviceId;
      const requestBody = {
        name,
        lastName,
        birthDate: Moment(birthDate, 'DDMMYYYY').format('YYYY-MM-DD'),
        motherName,
        cpf,
        password: base64.encode(password),
        email,
        mobile: `+55${mobile}`,
        isAllowSendEmail,
        fcmToken,
        devicePlatform: Platform.OS,
        ...(customerDeviceId ? { customerDeviceId } : {}),
        ...(facebookId ? { facebookId } : {}),
        ...(facebookAccessToken ? { facebookAccessToken } : {}),
        address: { ...addressFields },
        details: {
          referredByCode: discountCode || '',
        },
      };

      const response = await voudRequest('/customer/register', 'POST', requestBody);

      const {
        categories: { FORM },
        actions: { SUBMIT },
        labels: { SUBMIT_REGISTER },
      } = GAEventParams;
      GATrackEvent(FORM, SUBMIT, SUBMIT_REGISTER);
      FBLogEvent(FBEventsConstants.COMPLETED_REGISTRATION);

      dispatch(registerSuccess(response));
      persistProfile(getState());

      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (!requestErrorHandler(dispatch, error, registerFailure(error.message))) {
        throw error;
      }
    }
  };
}

export function fetchConfirmMobile(verificationCode, fromRegisterFlow = false) {
  return async (dispatch, getState) => {
    // dispatch request action
    dispatch(confirmMobile());

    const requestBody = {
      verificationCode: `V-${verificationCode}`,
    };

    try {
      const response = await voudRequest('/customer/confirm-mobile', 'POST', requestBody, true);

      if (fromRegisterFlow) {
        const {
          categories: { FORM },
          actions: { SUBMIT },
          labels: { SUBMIT_MOBILE_VALIDATION_CODE },
        } = GAEventParams;
        GATrackEvent(FORM, SUBMIT, SUBMIT_MOBILE_VALIDATION_CODE);
      }

      dispatch(confirmMobileSuccess(response));
      persistProfile(getState());

      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (!requestErrorHandler(dispatch, error, confirmMobileFailure(error.message))) {
        throw error;
      }
    }
  };
}

export function fetchResendMobileConfirmation() {
  return async dispatch => {
    // dispatch request action
    dispatch(resendMobileConfirmation());

    try {
      const response = await voudRequest('/customer/resend-sms', 'POST', {}, true);
      dispatch(resendMobileConfirmationSuccess(response));

      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (!requestErrorHandler(dispatch, error, resendMobileConfirmationFailure(error.message))) {
        throw error;
      }
    }
  };
}

export function fetchConfirmEmail(verificationCode) {
  return async (dispatch, getState) => {
    // dispatch request action
    dispatch(confirmEmail());

    const requestBody = {
      verificationCode: `V-${verificationCode}`,
    };

    try {
      const response = await voudRequest('/customer/confirm-email', 'POST', requestBody, true);
      dispatch(confirmEmailSuccess(response));
      persistProfile(getState());

      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (!requestErrorHandler(dispatch, error, confirmEmailFailure(error.message))) {
        throw error;
      }
    }
  };
}

export function fetchResendEmailConfirmation() {
  return async dispatch => {
    // dispatch request action
    dispatch(resendEmailConfirmation());

    try {
      const response = await voudRequest('/customer/resend-email', 'POST', {}, true);
      dispatch(resendEmailConfirmationSuccess(response));

      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (!requestErrorHandler(dispatch, error, resendEmailConfirmationFailure(error.message))) {
        throw error;
      }
    }
  };
}
