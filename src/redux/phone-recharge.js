import { voudRequest } from "../shared/services";
import { requestErrorHandler } from "../shared/request-error-handler";

// Actions
const FETCH_CARRIERS = 'voud/phone-recharge/FETCH_CARRIERS';
const FETCH_CARRIERS_SUCCESS = 'voud/phone-recharge/FETCH_CARRIERS_SUCCESS';
const FETCH_CARRIERS_FAILURE = 'voud/phone-recharge/FETCH_CARRIERS_FAILURE';

const FETCH_CARRIER_VALUES = 'voud/phone-recharge/FETCH_CARRIER_VALUES';
const FETCH_CARRIER_VALUES_SUCCESS = 'voud/phone-recharge/FETCH_CARRIER_VALUES_SUCCESS';
const FETCH_CARRIER_VALUES_FAILURE = 'voud/phone-recharge/FETCH_CARRIER_VALUES_FAILURE';

// Reducer
const initialState = {
  carriers: {
    isFetching: false,
    error: '',
    data: [],
  },
  carrierValues: {
    isFetching: false,
    error: '',
    data: [],
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // FETCH CARRIERS
    case FETCH_CARRIERS: {
      return {
        ...state,
        carriers: {
          ...state.carriers,
          isFetching: true,
          error: '',
        }
      }
    }

    case FETCH_CARRIERS_SUCCESS: {
      return {
        ...state,
        carriers: {
          ...state.carriers,
          isFetching: false,
          data: action.payload ? action.payload : [],
        }
      }
    }

    case FETCH_CARRIERS_FAILURE: {
      return {
        ...state,
        carriers: {
          ...state.carriers,
          isFetching: false,
          error: action.error,
        }
      }
    }

    // FETCH CARRIER VALUES
    case FETCH_CARRIER_VALUES: {
      return {
        ...state,
        carrierValues: {
          ...state.carrierValues,
          isFetching: true,
          error: '',
        }
      }
    }

    case FETCH_CARRIER_VALUES_SUCCESS: {
      return {
        ...state,
        carrierValues: {
          ...state.carrierValues,
          isFetching: false,
          data: action.payload ? action.payload : [],
        }
      }
    }

    case FETCH_CARRIER_VALUES_FAILURE: {
      return {
        ...state,
        carrierValues: {
          ...state.carrierValues,
          isFetching: false,
          error: action.error,
        }
      }
    }

    // DEFAULT
    default:
      return state;
  }
}

// Private action creators
function _fetchCarriers() {
  return { type: FETCH_CARRIERS }
}

function _fetchCarriersSuccess(payload) {
  return { type: FETCH_CARRIERS_SUCCESS, payload };
}

function _fetchCarriersFailure(error) {
  return { type: FETCH_CARRIERS_FAILURE, error };
}

function _fetchCarrierValues() {
  return { type: FETCH_CARRIER_VALUES }
}

function _fetchCarrierValuesSuccess(payload) {
  return { type: FETCH_CARRIER_VALUES_SUCCESS, payload };
}

function _fetchCarrierValuesFailure(error) {
  return { type: FETCH_CARRIER_VALUES_FAILURE, error };
}

// Thunks
export function fetchCarriers(phoneNumber) {
  return async dispatch => {
    dispatch(_fetchCarriers());

    try {
      const ddd = phoneNumber.substring(0, 2);
      const response = await voudRequest(`/mobile/recharge/operators/${ddd}`, 'GET', null, true);
      dispatch(_fetchCarriersSuccess(response.payload));
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (!requestErrorHandler(dispatch, error, _fetchCarriersFailure(error.message))) {
        throw error;
      }
    }
  }
}

export function fetchCarrierValues(ddd, operator) {
  return async dispatch => {
    dispatch(_fetchCarrierValues());

    try {
      const requestBody = {
        ddd,
        operator,
      };
      const response = await voudRequest('/mobile/recharge/products', 'POST', requestBody, true);
      dispatch(_fetchCarrierValuesSuccess(response.payload));
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (!requestErrorHandler(dispatch, error, _fetchCarrierValuesFailure(error.message))) {
        throw error;
      }
    }
  }
}