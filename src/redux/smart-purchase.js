// VouD imports
import { voudRequest } from "../shared/services";
import { requestErrorHandler } from "../shared/request-error-handler";
import { getIssuerType, issuerTypes } from "./transport-card";

// Actions

const REQUEST_LIST = "voud/smart-purchase/REQUEST_LIST";
const REQUEST_LIST_SUCCESS = "voud/smart-purchase/REQUEST_LIST_SUCCESS";
const REQUEST_LIST_FAILURE = "voud/smart-purchase/REQUEST_LIST_FAILURE";
const REQUEST_LIST_CLEAR = "voud/smart-purchase/REQUEST_LIST_CLEAR";

const SAVE = "voud/smart-purchase/SAVE";
const SAVE_SUCCESS = "voud/smart-purchase/SAVE_SUCCESS";
const SAVE_FAILURE = "voud/smart-purchase/SAVE_FAILURE";
const SAVE_CLEAR = "voud/smart-purchase/SAVE_CLEAR";

const REMOVE = "voud/smart-purchase/REMOVE";
const REMOVE_SUCCESS = "voud/smart-purchase/REMOVE_SUCCESS";
const REMOVE_FAILURE = "voud/smart-purchase/REMOVE_FAILURE";
const REMOVE_CLEAR = "voud/smart-purchase/REMOVE_CLEAR";

export const smartPurchaseProcessLocations = {
  PRE_PROCESS: "PRE_PROCESS",
  ACQUIRER_AUTHORIZATION: "ACQUIRER_AUTHORIZATION",
  ACQUIRER_CAPTURE: "ACQUIRER_CAPTURE",
  PROCESSING: "PROCESSING",
  SUCCESS: "SUCCESS"
};

export const isPaymentMethodProcessLocation = status =>
  status === smartPurchaseProcessLocations.ACQUIRER_AUTHORIZATION ||
  status === smartPurchaseProcessLocations.ACQUIRER_CAPTURE;

export const smartPurchaseStatus = {
  ERROR: "ERRO",
  SUCCESS: "SUCESSO"
};

// Reducer

const initialState = {
  list: {
    isFetching: false,
    error: "",
    data: []
  },
  save: {
    isFetching: false,
    error: ""
  },
  remove: {
    isFetching: false,
    error: ""
  }
};

function reducer(state = initialState, action) {
  switch (action.type) {
    // list
    case REQUEST_LIST:
      return {
        ...state,
        list: {
          ...state.list,
          isFetching: true
        }
      };
    case REQUEST_LIST_SUCCESS:
      return {
        ...state,
        list: {
          ...state.list,
          isFetching: false,
          error: "",
          data: action.response.payload
        }
      };
    case REQUEST_LIST_FAILURE:
      return {
        ...state,
        list: {
          ...state.list,
          isFetching: false,
          error: action.error
        }
      };
    case REQUEST_LIST_CLEAR:
      return {
        ...state,
        list: {
          ...state.list,
          isFetching: false,
          error: ""
        }
      };

    // save
    case SAVE:
      return {
        ...state,
        save: {
          ...state.save,
          isFetching: true
        }
      };
    case SAVE_SUCCESS:
      return {
        ...state,
        save: {
          ...state.save,
          isFetching: false,
          error: ""
        },
        list: {
          ...state.list,
          data: state.list.data.find(el => el.id === action.response.payload.id)
            ? state.list.data.map(el =>
                el.id === action.response.payload.id
                  ? action.response.payload
                  : el
              )
            : [...state.list.data, action.response.payload]
        }
      };
    case SAVE_FAILURE:
      return {
        ...state,
        save: {
          ...state.save,
          isFetching: false,
          error: action.error
        }
      };
    case SAVE_CLEAR:
      return {
        ...state,
        save: {
          ...state.save,
          isFetching: false,
          error: ""
        }
      };

    // remove
    case REMOVE:
      return {
        ...state,
        remove: {
          ...state.remove,
          isFetching: true
        }
      };
    case REMOVE_SUCCESS:
      return {
        ...state,
        remove: {
          ...state.remove,
          isFetching: false,
          error: ""
        },
        list: {
          ...state.list,
          data: state.list.data.filter(
            el => el.id !== action.response.payload.id
          )
        }
      };
    case REMOVE_FAILURE:
      return {
        ...state,
        remove: {
          ...state.remove,
          isFetching: false,
          error: action.error
        }
      };
    case REMOVE_CLEAR:
      return {
        ...state,
        remove: {
          ...state.remove,
          isFetching: false,
          error: ""
        }
      };

    // default
    default:
      return state;
  }
}

export default reducer;

// Actions creators

// Request list
function _requestSmartPurchases() {
  return { type: REQUEST_LIST };
}
function _requestSmartPurchasesSuccess(response) {
  return {
    type: REQUEST_LIST_SUCCESS,
    response
  };
}
function _requestSmartPurchasesFailure(error) {
  return {
    type: REQUEST_LIST_FAILURE,
    error
  };
}

// Save
function _save() {
  return { type: SAVE };
}
function _saveSuccess(response) {
  return { type: SAVE_SUCCESS, response };
}
function _saveFailure(error) {
  return {
    type: SAVE_FAILURE,
    error
  };
}
export function saveClear() {
  return { type: SAVE_CLEAR };
}

// Remove
function _remove() {
  return { type: REMOVE };
}
function _removeSuccess(response) {
  return { type: REMOVE_SUCCESS, response };
}
function _removeFailure(error) {
  return {
    type: REMOVE_FAILURE,
    error
  };
}
export function removeClear() {
  return { type: REMOVE_CLEAR };
}

// Thunk action creators

// List smart purchases
export function fetchSmartPurchases() {
  return async function(dispatch) {
    // dispatch request action
    dispatch(_requestSmartPurchases());

    try {
      const response = await voudRequest("/recurrent-payment", "GET", "", true);
      if (!response.payload) response.payload = [];
      dispatch(_requestSmartPurchasesSuccess(response));
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(
          dispatch,
          error,
          _requestSmartPurchasesFailure(error.message)
        )
      ) {
        throw error;
      }
    }
  };
}

// Save smart purchase
export function fetchSaveSmartPurchase(params) {
  return async function(dispatch) {
    // dispatch request action
    dispatch(_save());

    try {
      const {
        smartPurchaseId,
        rechargeValue,
        transportCardId,
        paymentMethodId,
        scheduledDay,
        activateSmartPurchase
      } = params;
      const rechargeValueFloat = Number(rechargeValue) / 100;
      const issuerType = getIssuerType(params.transportCardIssuer);
      const buInfo =
        issuerType === issuerTypes.BU
          ? {
              idTransportCardWallet:
                params.buAdditionalData.idTransportCardWallet,
              productQuantity: params.buAdditionalData.productQuantity
            }
          : {};

      const requestBody = {
        ...(smartPurchaseId ? { id: smartPurchaseId } : {}),
        transportCard: {
          uuid: transportCardId
        },
        paymentMethod: {
          id: paymentMethodId
        },
        rechargeValue: rechargeValueFloat.toFixed(2),
        serviceValue: 0,
        transactionValue: rechargeValueFloat.toFixed(2),
        scheduledDay,
        active: activateSmartPurchase,
        ...buInfo
      };
      const response = await voudRequest(
        "/recurrent-payment",
        "POST",
        requestBody,
        true
      );
      dispatch(_saveSuccess(response));
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (!requestErrorHandler(dispatch, error, _saveFailure(error.message))) {
        throw error;
      }
    }
  };
}

// Remove smart purchase
export function fetchRemoveSmartPurchase(id) {
  return async function(dispatch) {
    // dispatch request action
    dispatch(_remove());

    try {
      const response = await voudRequest(
        `/recurrent-payment/${id}`,
        "DELETE",
        null,
        true
      );
      dispatch(_removeSuccess(response));
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(dispatch, error, _removeFailure(error.message))
      ) {
        throw error;
      }
    }
  };
}
