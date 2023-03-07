// NPM imports
import { voudRequest } from "../shared/services";
import { requestErrorHandler } from "../shared/request-error-handler";

// consts
const DEFAULT_SERVICE_UNAVAILABLE_TITLE =
  "Serviço temporariamente indisponível";
const DEFAULT_SERVICE_UNAVAILABLE_MESSAGE =
  "Nossos servidores estão passando por uma manutenção preventiva. Voltaremos em breve. Desculpe-nos pelo transtorno.";

const getServiceUnavailableTitle = title =>
  title && title !== "" ? title : DEFAULT_SERVICE_UNAVAILABLE_TITLE;
const getServiceUnavailableMessage = message =>
  message && message !== "" ? message : DEFAULT_SERVICE_UNAVAILABLE_MESSAGE;

// Actions
const REQUEST_API_STATUS = "voud/api-status/REQUEST_API_STATUS";
const REQUEST_API_STATUS_SUCCESS = "voud/api-status/REQUEST_API_STATUS_SUCCESS";
const REQUEST_API_STATUS_FAILURE = "voud/api-status/REQUEST_API_STATUS_FAILURE";

const UPDATE_API_STATUS = "voud/api-status/UPDATE_API_STATUS";

// Reducer

const initialState = {
  isFetching: false,
  error: "",
  data: {
    available: true,
    title: "",
    message: "",
    lastCheck: null,
    lastRecurrentPaymentFire: null
  }
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_API_STATUS:
      return {
        ...state,
        isFetching: true,
        error: ""
      };
    case REQUEST_API_STATUS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: "",
        data: {
          available: action.response.available,
          title: getServiceUnavailableTitle(action.response.title),
          message: getServiceUnavailableMessage(action.response.message),
          lastCheck: new Date(),
          lastRecurrentPaymentFire: action.response.lastRecurrentPaymentFire
        }
      };
    case REQUEST_API_STATUS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };

    case UPDATE_API_STATUS:
      return {
        ...state,
        isFetching: false,
        error: "",
        data: {
          available: action.available,
          title: getServiceUnavailableTitle(action.title),
          message: getServiceUnavailableMessage(action.message),
          lastCheck: new Date()
        }
      };
    default:
      return state;
  }
}

export default reducer;

// Actions creators

// Request api status
function requestAPIStatus() {
  return { type: REQUEST_API_STATUS };
}
function requestAPIStatusSuccess(response) {
  return { type: REQUEST_API_STATUS_SUCCESS, response };
}
function requestAPIStatusFailure(error) {
  return { type: REQUEST_API_STATUS_FAILURE, error };
}

export function updateAPIStatus(available, title, message) {
  return { type: UPDATE_API_STATUS, available, title, message };
}

// Thunk action creators

export function fetchAPIStatus() {
  return async dispatch => {
    // dispatch request action
    dispatch(requestAPIStatus());

    try {
      const response = await voudRequest("/status", "GET");
      dispatch(requestAPIStatusSuccess(response));
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      requestErrorHandler(
        dispatch,
        error,
        requestAPIStatusFailure(error.message)
      );
      throw error;
    }
  };
}
