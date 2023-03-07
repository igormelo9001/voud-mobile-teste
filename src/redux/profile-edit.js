// NPM imports
import Moment from "moment";
import base64 from "base-64";

// VouD imports
import { voudRequest } from "../shared/services";
import { persistProfile, clearProfileStorage } from "./profile";
import { requestErrorHandler } from "../shared/request-error-handler";

// Actions
const EDIT_PERSONAL_DATA = "voud/profile/EDIT_PERSONAL_DATA";
const EDIT_PERSONAL_DATA_SUCCESS = "voud/profile/EDIT_PERSONAL_DATA_SUCCESS";
const EDIT_PERSONAL_DATA_FAILURE = "voud/profile/EDIT_PERSONAL_DATA_FAILURE";
const EDIT_PERSONAL_DATA_CLEAR = "voud/profile/EDIT_PERSONAL_DATA_CLEAR";

const EDIT_PASSWORD = "voud/profile/EDIT_PASSWORD";
const EDIT_PASSWORD_SUCCESS = "voud/profile/EDIT_PASSWORD_SUCCESS";
const EDIT_PASSWORD_FAILURE = "voud/profile/EDIT_PASSWORD_FAILURE";
const EDIT_PASSWORD_CLEAR = "voud/profile/EDIT_PASSWORD_CLEAR";

const TO_EMAIL_EDIT = "voud/profile/TO_EMAIL_EDIT";
const CANCEL_EMAIL_EDIT = "voud/profile/CANCEL_EMAIL_EDIT";
const EDIT_EMAIL = "voud/profile/EDIT_EMAIL";
const EDIT_EMAIL_SUCCESS = "voud/profile/EDIT_EMAIL_SUCCESS";
const EDIT_EMAIL_FAILURE = "voud/profile/EDIT_EMAIL_FAILURE";
const EDIT_EMAIL_CLEAR = "voud/profile/EDIT_EMAIL_CLEAR";

const TO_MOBILE_EDIT = "voud/profile/TO_MOBILE_EDIT";
const CANCEL_MOBILE_EDIT = "voud/profile/CANCEL_MOBILE_EDIT";
const EDIT_MOBILE = "voud/profile/EDIT_MOBILE";
const EDIT_MOBILE_SUCCESS = "voud/profile/EDIT_MOBILE_SUCCESS";
const EDIT_MOBILE_FAILURE = "voud/profile/EDIT_MOBILE_FAILURE";
const EDIT_MOBILE_CLEAR = "voud/profile/EDIT_MOBILE_CLEAR";

const EDIT_EMAIL_PREFERENCES = "voud/profile/EDIT_EMAIL_PREFERENCES";
const EDIT_EMAIL_PREFERENCES_SUCCESS =
  "voud/profile/EDIT_EMAIL_PREFERENCES_SUCCESS";
const EDIT_EMAIL_PREFERENCES_FAILURE =
  "voud/profile/EDIT_EMAIL_PREFERENCES_FAILURE";
const EDIT_EMAIL_PREFERENCES_CLEAR =
  "voud/profile/EDIT_EMAIL_PREFERENCES_CLEAR";

const EDIT_ADDRESS = "voud/profile/EDIT_ADDRESS";
const EDIT_ADDRESS_SUCCESS = "voud/profile/EDIT_ADDRESS_SUCCESS";
const EDIT_ADDRESS_FAILURE = "voud/profile/EDIT_ADDRESS_FAILURE";
const EDIT_ADDRESS_CLEAR = "voud/profile/EDIT_ADDRESS_CLEAR";

export const profileEditActions = {
  EDIT_PERSONAL_DATA_SUCCESS,
  EDIT_PASSWORD_SUCCESS,
  EDIT_EMAIL_SUCCESS,
  EDIT_MOBILE_SUCCESS,
  EDIT_EMAIL_PREFERENCES_SUCCESS,
  EDIT_ADDRESS_SUCCESS
};

// Consts
export const emailEditingSteps = {
  INITIAL: 0,
  EDITING: 1
};

export const mobileEditingSteps = {
  INITIAL: 0,
  EDITING: 1
};

// Reducer
const initialState = {
  personalData: {
    isFetching: false,
    error: ""
  },
  password: {
    isFetching: false,
    error: ""
  },
  email: {
    isFetching: false,
    error: "",
    currentStep: emailEditingSteps.INITIAL
  },
  mobile: {
    isFetching: false,
    error: "",
    currentStep: mobileEditingSteps.INITIAL
  },
  address: {
    isFetching: false,
    error: ""
  },
  editEmailPreferences: {
    isFetching: false,
    error: ""
  }
};

function reducer(state = initialState, action) {
  switch (action.type) {
    // Edit personal data
    case EDIT_PERSONAL_DATA:
      return {
        ...state,
        personalData: {
          isFetching: true,
          error: ""
        }
      };
    case EDIT_PERSONAL_DATA_FAILURE:
      return {
        ...state,
        personalData: {
          isFetching: false,
          error: action.error
        }
      };
    case EDIT_PERSONAL_DATA_SUCCESS:
    case EDIT_PERSONAL_DATA_CLEAR:
      return {
        ...state,
        personalData: {
          isFetching: false,
          error: ""
        }
      };

    // Edit password
    case EDIT_PASSWORD:
      return {
        ...state,
        password: {
          isFetching: true,
          error: ""
        }
      };
    case EDIT_PASSWORD_FAILURE:
      return {
        ...state,
        password: {
          isFetching: false,
          error: action.error
        }
      };
    case EDIT_PASSWORD_SUCCESS:
    case EDIT_PASSWORD_CLEAR:
      return {
        ...state,
        password: {
          isFetching: false,
          error: ""
        }
      };

    // Edit e-mail
    case TO_EMAIL_EDIT:
      return {
        ...state,
        email: {
          ...state.email,
          currentStep: emailEditingSteps.EDITING
        }
      };
    case CANCEL_EMAIL_EDIT:
      return {
        ...state,
        email: {
          ...state.email,
          currentStep: emailEditingSteps.INITIAL
        }
      };
    case EDIT_EMAIL:
      return {
        ...state,
        email: {
          ...state.email,
          isFetching: true,
          error: ""
        }
      };
    case EDIT_EMAIL_SUCCESS:
      return {
        ...state,
        email: {
          isFetching: false,
          error: "",
          currentStep: emailEditingSteps.INITIAL
        }
      };
    case EDIT_EMAIL_FAILURE:
      return {
        ...state,
        email: {
          ...state.email,
          isFetching: false,
          error: action.error
        }
      };
    case EDIT_EMAIL_CLEAR:
      return {
        ...state,
        email: {
          ...state.email,
          isFetching: false,
          error: ""
        }
      };

    // Edit mobile
    case TO_MOBILE_EDIT:
      return {
        ...state,
        mobile: {
          ...state.mobile,
          currentStep: mobileEditingSteps.EDITING
        }
      };
    case CANCEL_MOBILE_EDIT:
      return {
        ...state,
        mobile: {
          ...state.mobile,
          currentStep: mobileEditingSteps.INITIAL
        }
      };
    case EDIT_MOBILE:
      return {
        ...state,
        mobile: {
          ...state.mobile,
          isFetching: true,
          error: ""
        }
      };
    case EDIT_MOBILE_SUCCESS:
      return {
        ...state,
        mobile: {
          isFetching: false,
          error: "",
          currentStep: mobileEditingSteps.INITIAL
        }
      };
    case EDIT_MOBILE_FAILURE:
      return {
        ...state,
        mobile: {
          ...state.mobile,
          isFetching: false,
          error: action.error
        }
      };
    case EDIT_MOBILE_CLEAR:
      return {
        ...state,
        mobile: {
          ...state.mobile,
          isFetching: false,
          error: ""
        }
      };

    // Edit address
    case EDIT_ADDRESS:
      return {
        ...state,
        address: {
          isFetching: true,
          error: ""
        }
      };
    case EDIT_ADDRESS_FAILURE:
      return {
        ...state,
        address: {
          isFetching: false,
          error: action.error
        }
      };
    case EDIT_ADDRESS_SUCCESS:
    case EDIT_ADDRESS_CLEAR:
      return {
        ...state,
        address: {
          isFetching: false,
          error: ""
        }
      };

    // Edit email preferences
    case EDIT_EMAIL_PREFERENCES:
      return {
        ...state,
        editEmailPreferences: {
          ...state.editEmailPreferences,
          isFetching: true,
          error: ""
        }
      };
    case EDIT_EMAIL_PREFERENCES_SUCCESS:
      return {
        ...state,
        editEmailPreferences: {
          isFetching: false,
          error: ""
        }
      };
    case EDIT_EMAIL_PREFERENCES_FAILURE:
      return {
        ...state,
        editEmailPreferences: {
          ...state.editEmailPreferences,
          isFetching: false,
          error: action.error
        }
      };
    case EDIT_EMAIL_PREFERENCES_CLEAR:
      return {
        ...state,
        editEmailPreferences: {
          ...state.editEmailPreferences,
          isFetching: false,
          error: ""
        }
      };

    default:
      return state;
  }
}

export default reducer;

// Action creators

// Edit name actions
function editPersonalData() {
  return {
    type: EDIT_PERSONAL_DATA
  };
}

function editPersonalDataSuccess(response) {
  return {
    type: EDIT_PERSONAL_DATA_SUCCESS,
    response
  };
}

function editPersonalDataFailure(error) {
  return {
    type: EDIT_PERSONAL_DATA_FAILURE,
    error
  };
}
export function editPersonalDataClear() {
  return {
    type: EDIT_PERSONAL_DATA_CLEAR
  };
}

// Edit password actions
function editPassword() {
  return {
    type: EDIT_PASSWORD
  };
}

function editPasswordSuccess(response) {
  return {
    type: EDIT_PASSWORD_SUCCESS,
    response
  };
}

function editPasswordFailure(error) {
  return {
    type: EDIT_PASSWORD_FAILURE,
    error
  };
}
export function editPasswordClear() {
  return {
    type: EDIT_PASSWORD_CLEAR
  };
}

// Edit email actions
export function toEmailEdit() {
  return {
    type: TO_EMAIL_EDIT
  };
}
export function cancelEmailEdit() {
  return {
    type: CANCEL_EMAIL_EDIT
  };
}

function editEmail() {
  return {
    type: EDIT_EMAIL
  };
}

function editEmailSuccess(response) {
  return {
    type: EDIT_EMAIL_SUCCESS,
    response
  };
}

function editEmailFailure(error) {
  return {
    type: EDIT_EMAIL_FAILURE,
    error
  };
}
export function editEmailClear() {
  return {
    type: EDIT_EMAIL_CLEAR
  };
}

// Edit mobile actions
export function toMobileEdit() {
  return {
    type: TO_MOBILE_EDIT
  };
}
export function cancelMobileEdit() {
  return {
    type: CANCEL_MOBILE_EDIT
  };
}

function editMobile() {
  return {
    type: EDIT_MOBILE
  };
}

function editMobileSuccess(response) {
  return {
    type: EDIT_MOBILE_SUCCESS,
    response
  };
}

function editMobileFailure(error) {
  return {
    type: EDIT_MOBILE_FAILURE,
    error
  };
}
export function editMobileClear() {
  return {
    type: EDIT_MOBILE_CLEAR
  };
}

// Edit email preferences actions
function editEmailPreferences() {
  return {
    type: EDIT_EMAIL_PREFERENCES
  };
}

function editEmailPreferencesSuccess(response) {
  return {
    type: EDIT_EMAIL_PREFERENCES_SUCCESS,
    response
  };
}

function editEmailPreferencesFailure(error) {
  return {
    type: EDIT_EMAIL_PREFERENCES_FAILURE,
    error
  };
}

export function editEmailPreferencesClear() {
  return {
    type: EDIT_EMAIL_PREFERENCES_CLEAR
  };
}

// Edit address actions
function editAddress() {
  return {
    type: EDIT_ADDRESS
  };
}

function editAddressSuccess(response) {
  return {
    type: EDIT_ADDRESS_SUCCESS,
    response
  };
}

function editAddressFailure(error) {
  return {
    type: EDIT_ADDRESS_FAILURE,
    error
  };
}
export function editAddressClear() {
  return {
    type: EDIT_ADDRESS_CLEAR
  };
}

// Thunk action creators

export function fetchEditPersonalData(
  name,
  lastName,
  birthDate,
  mobile,
  email,
  motherName
) {
  return async (dispatch, getState) => {
    // dispatch request action
    dispatch(editPersonalData());

    try {
      const requestBody = {
        name,
        lastName,
        birthDate: Moment(birthDate, "DDMMYYYY").format("YYYY-MM-DD"),
        mobile,
        email,
        motherName,
        isUpdateAddress: true
      };

      const response = await voudRequest(
        "/customer/update",
        "POST",
        requestBody,
        true
      );

      dispatch(editPersonalDataSuccess(response));
      clearProfileStorage();
      persistProfile(getState());

      // dispatch(editUserBlocked(response));
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(
          dispatch,
          error,
          editPersonalDataFailure(error.message)
        )
      ) {
        throw error;
      }
    }
  };
}

export function fetchEditPassword(password, newPassword) {
  return async dispatch => {
    // dispatch request action
    dispatch(editPassword());

    try {
      const requestBody = {
        password: base64.encode(password),
        newPassword: base64.encode(newPassword)
      };

      const response = await voudRequest(
        "/customer/change-password",
        "POST",
        requestBody,
        true
      );
      dispatch(editPasswordSuccess(response));
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(
          dispatch,
          error,
          editPasswordFailure(error.message)
        )
      ) {
        throw error;
      }
    }
  };
}

export function fetchEditEmail(name, mobile, email, password) {
  return async (dispatch, getState) => {
    // dispatch request action
    dispatch(editEmail());

    try {
      const requestBody = {
        name,
        mobile,
        email,
        password: password ? base64.encode(password) : null
      };

      const response = await voudRequest(
        "/customer/update",
        "POST",
        requestBody,
        true
      );
      dispatch(editEmailSuccess(response));
      persistProfile(getState());
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(dispatch, error, editEmailFailure(error.message))
      ) {
        throw error;
      }
    }
  };
}

export function fetchEditMobile(name, mobile, email, password) {
  return async (dispatch, getState) => {
    // dispatch request action
    dispatch(editMobile());

    try {
      const requestBody = {
        name,
        mobile: `+55${mobile}`,
        email,
        password: password ? base64.encode(password) : null
      };

      const response = await voudRequest(
        "/customer/update",
        "POST",
        requestBody,
        true
      );
      dispatch(editMobileSuccess(response));
      persistProfile(getState());
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(dispatch, error, editMobileFailure(error.message))
      ) {
        throw error;
      }
    }
  };
}

export function fetchEditEmailPreferences(
  name,
  mobile,
  email,
  isAllowSendEmail
) {
  return async (dispatch, getState) => {
    // dispatch request action
    dispatch(editEmailPreferences());
    try {
      const requestBody = {
        name,
        mobile,
        email,
        isAllowSendEmail
      };

      const response = await voudRequest(
        "/customer/update",
        "POST",
        requestBody,
        true
      );
      dispatch(editEmailPreferencesSuccess(response));
      persistProfile(getState());
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(
          dispatch,
          error,
          editEmailPreferencesFailure(error.message)
        )
      ) {
        throw error;
      }
    }
  };
}

export function fetchEditAddress(
  name,
  mobile,
  email,
  addressFields,
  addressShippingFields
) {
  return async (dispatch, getState) => {
    // dispatch request action
    dispatch(editAddress());
    try {
      const requestBody = !addressShippingFields
        ? {
            name,
            mobile,
            email,
            address: { ...addressFields },
            isUpdateAddress: true
          }
        : {
            name,
            mobile,
            email,
            shippingAddress: { ...addressShippingFields },
            isUpdateAddress: true
          };

      const response = await voudRequest(
        "/customer/update",
        "POST",
        requestBody,
        true
      );
      dispatch(editAddressSuccess(response));
      persistProfile(getState());
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(dispatch, error, editAddressFailure(error.message))
      ) {
        throw error;
      }
    }
  };
}
