// VouD imports
import moment from "moment";
import { voudRequest, httpStatusCodes } from "../shared/services";
import { requestErrorHandler } from "../shared/request-error-handler";
import { initActions, asyncStorageKeys, persistData } from "./init";
import { getDiscountCode } from "../utils/member-get-member";
import { isLoggedIn } from "../utils/auth";
import { loginActions } from "./login";
// import { saveObject, hasObject } from '../utils/realm-utils';

// Actions

const REQUEST_CONTENT = "voud/config/REQUEST_CONTENT";
const REQUEST_CONTENT_SUCCESS = "voud/config/REQUEST_CONTENT_SUCCESS";
const REQUEST_CONTENT_FAILURE = "voud/config/REQUEST_CONTENT_FAILURE";

const ADD_DISCOUNT_CODE = "voud/config/ADD_DISCOUNT_CODE";
const CLEAR_DISCOUNT_CODE = "voud/config/CLEAR_DISCOUNT_CODE";
const SET_IS_SERVICE_MENU_COLLAPSED =
  "voud/config/SET_IS_SERVICE_MENU_COLLAPSED";

const SET_DEVICE_ID = "voud/config/SET_DEVICE_ID";
const SET_DEVICE_MODEL = "voud/config/SET_DEVICE_MODEL";
const SET_DEVICE_BRAND = "voud/config/SET_DEVICE_BRAND";
const SET_DEVICE_IP = "voud/config/SET_DEVICE_IP";

export const configActions = {
  REQUEST_CONTENT_SUCCESS
};

const hasConfigUiError = configUi =>
  configUi.error !== "" &&
  configUi.errorStatusCode !== httpStatusCodes.UNSUPPORTED_VERSION &&
  configUi.errorStatusCode !== httpStatusCodes.SERVICE_UNAVAILABLE;

const hasCheckLastTermAcceptedUiError = termsAcceptedUi =>
  termsAcceptedUi.error !== "" &&
  termsAcceptedUi.errorStatusCode !== httpStatusCodes.UNSUPPORTED_VERSION &&
  termsAcceptedUi.errorStatusCode !== httpStatusCodes.SERVICE_UNAVAILABLE &&
  termsAcceptedUi.errorStatusCode !== httpStatusCodes.SESSION_EXPIRED;

export const hasConfigError = (configUi, termsAcceptedUi) =>
  hasConfigUiError(configUi) ||
  hasCheckLastTermAcceptedUiError(termsAcceptedUi);

// Reducer
const initialState = {
  isFetching: false,
  requested: null,
  error: "",
  errorStatusCode: null,
  content: null,
  activeDiscountCode: null,
  isServiceMenuCollapsed: false,
  serviceMenuType: "card",
  deviceId: null,
  deviceModel: null,
  deviceBrand: null,
  deviceIP: null
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case initActions.HYDRATE:
      return {
        ...state,
        isServiceMenuCollapsed: action.data.isServiceMenuCollapsed
          ? action.data.isServiceMenuCollapsed
          : state.isServiceMenuCollapsed,
        serviceMenuType: action.data.serviceMenuType
          ? action.data.serviceMenuType
          : state.serviceMenuType
      };
    case REQUEST_CONTENT:
      return {
        ...state,
        requested: new Date(),
        isFetching: true
      };
    case REQUEST_CONTENT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: "",
        errorStatusCode: null,
        content: action.response
      };
    case REQUEST_CONTENT_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
        errorStatusCode: action.errorStatusCode
      };
    case ADD_DISCOUNT_CODE:
      return {
        ...state,
        activeDiscountCode: action.discountCode
      };
    case CLEAR_DISCOUNT_CODE: {
      return {
        ...state,
        activeDiscountCode: null
      };
    }
    case SET_IS_SERVICE_MENU_COLLAPSED:
      return {
        ...state,
        isServiceMenuCollapsed: action.state.toggle,
        serviceMenuType: action.state.type
      };

    case loginActions.LOGOUT:
      return {
        ...state,
        isServiceMenuCollapsed: initialState.isServiceMenuCollapsed,
        serviceMenuType: initialState.serviceMenuType
      };

    case SET_DEVICE_ID:
      return {
        ...state,
        deviceId: action.deviceId
      };

    case SET_DEVICE_MODEL:
      return {
        ...state,
        deviceModel: action.payload
      };

    case SET_DEVICE_BRAND:
      return {
        ...state,
        deviceBrand: action.payload
      };

    case SET_DEVICE_IP:
      return {
        ...state,
        deviceIP: action.payload
      };

    default:
      return state;
  }
}

export default reducer;

// Actions creators

// Request service points
function requestContent() {
  return { type: REQUEST_CONTENT };
}
function requestContentSuccess(response) {
  return {
    type: REQUEST_CONTENT_SUCCESS,
    response
  };
}
function requestContentFailure(error, errorStatusCode) {
  return {
    type: REQUEST_CONTENT_FAILURE,
    error,
    errorStatusCode
  };
}

// Discount code
export function addDiscountCode(discountCode) {
  return {
    type: ADD_DISCOUNT_CODE,
    discountCode
  };
}

export function clearDiscountCode() {
  return {
    type: CLEAR_DISCOUNT_CODE
  };
}

// Service Menu
export function setIsServiceMenuCollapsed(state) {
  persistData(asyncStorageKeys.isServiceMenuCollapsed, state.toggle);
  persistData(asyncStorageKeys.serviceMenuType, state.type);
  return { type: SET_IS_SERVICE_MENU_COLLAPSED, state };
}

export function setDeviceId(deviceId) {
  return {
    type: SET_DEVICE_ID,
    deviceId
  };
}

export const setDeviceModel = payload => ({
  type: SET_DEVICE_MODEL,
  payload
});

export const setDeviceBrand = payload => ({
  type: SET_DEVICE_BRAND,
  payload
});

export const setDeviceIP = payload => ({
  type: SET_DEVICE_IP,
  payload
});

// Thunk action creators
export function fetchContent() {
  return function(dispatch) {
    dispatch(requestContent());
    (async () => {
      try {
        // const contentList = await hasObject('ContentList');
        // if (typeof contentList === 'object' && Object.keys(contentList).length > 0) {
        //   dispatch(requestContentSuccess(contentList));
        //   return;
        // }

        const response = await voudRequest("/content/list", "GET");
        if (!response.payload) response.payload = [];

        const result = response.payload.sort((a, b) => a.id - b.id);

        // const dateToExpire = moment(new Date())
        //   .add(30, "days")
        //   .parseZone(new Date())
        //   .local()
        //   .format("YYYY-MM-DDTHH:mm:ss");

        // await saveObject("ContentList", result, null, dateToExpire);

        dispatch(requestContentSuccess(result));
      } catch (error) {
        if (__DEV__) console.tron.log(error.message, true);
        requestErrorHandler(
          dispatch,
          error,
          requestContentFailure(error.message, error.statusCode)
        );
      }
    })();
  };
}

export function handleDiscountCode(openedLink = null) {
  return async function(dispatch, getState) {
    const { data } = getState().profile;
    const { viewed } = getState().onboarding;

    const userIsLoggedIn = isLoggedIn(data);
    const discountCode = await getDiscountCode(openedLink);

    const isDiscountUseInvalid = userIsLoggedIn && discountCode;

    if (isDiscountUseInvalid) {
      dispatch(clearDiscountCode());
    } else {
      dispatch(addDiscountCode(discountCode));
    }

    return {
      userIsLoggedIn,
      discountCode,
      onboardingViewed: viewed
    };
  };
}
