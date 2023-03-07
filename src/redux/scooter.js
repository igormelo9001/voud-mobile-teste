
import { initActions, asyncStorageKeys, persistData, clearData, } from './init';
import { voudRequest } from '../shared/services';
import { requestErrorHandler } from '../shared/request-error-handler';
import Moment from 'moment';

const types = {

    START_RIDE: 'voud/scooter/START_RIDE',
    START_RIDE_SUCCESS: 'voud/scooter/START_RIDE_SUCCESS',
    START_RIDE_FAILARE: 'voud/scooter/START_RIDE_FAILARE',

    END_RIDE: 'voud/scooter/END_RIDE',
    END_RIDE_SUCCESS: 'voud/scooter/END_RIDE_SUCCESS',
    END_RIDE_FAILURE: 'voud/scooter/END_RIDE_FAILURE',

    AUTH_RIDE: 'voud/scooter/AUTH_RIDE',
    AUTH_RIDE_SUCCESS: 'voud/scooter/AUTH_RIDE_SUCCESS',
    AUTH_RIDE_FAILURE: 'voud/scooter/AUTH_RIDE_FAILURE',

    PENDING_RIDE: "voud/scooter/PENDING_RIDE",
    PENDING_RIDE_SUCCESS: "voud/scooter/PENDING_RIDE_SUCCESS",
    PENDING_RIDE_FAILURE: "voud/scooter/PENDING_RIDE_FAILURE",
    PENDING_RIDE_START_SUCCESS: "voud/scooter/PENDING_RIDE_START_SUCCESS",

    PENDING_TRANSACTION_RIDE: "voud/scooter/PENDING_TRANSACTION_RIDE",
    PENDING_TRANSACTION_RIDE_SUCCESS: "voud/scooter/PENDING_TRANSACTION_RIDE_SUCCESS",
    PENDING_TRANSACTION_RIDE_FAILURE: "voud/scooter/PENDING_TRANSACTION_RIDE_FAILURE",

    PAYMENT_PENDING_TRANSACTION_RIDE: "voud/scooter/PAYMENT_PENDING_TRANSACTION_RIDE",
    PAYMENT_PENDING_TRANSACTION_RIDE_SUCCESS: "voud/scooter/PAYMENT_PENDING_TRANSACTION_RIDE_SUCCESS",
    PAYMENT_PENDING_TRANSACTION_RIDE_FAILURE: "voud/scooter/PAYMENT_PENDING_TRANSACTION_RIDE_FAILURE",

}

export const resultCodeTransaction = {
  PAYMENT_CONFIRMED : "PAYMENT_CONFIRMED",
  DENIED : "DENIED",
};

const messageError = {
  DENIED: 'Ocorreu um erro no processamento, tente novamente utilizando um cartão diferente.'
}

// Reducer
const initialState = {
    isActive: false,
    startDate: null,
    initialValue: 4.3,
    valuePerMinute: 0.45,
    minuteFree: 15,
    error: "",
    isFetching: false,
    idRide: null,
    pendingRide: false,
    pendingTransactionRide: {},
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case initActions.HYDRATE:
            if (action.data.scooterData)
                return {
                    ...state,
                    ...action.data.scooterData,
                    isActive: true,
                };
            else
                return {
                    ...state,
                    isActive: false
                };
        case types.START_RIDE:
            return {
                ...state,
                isFetching: true,
                isActive: true,
                startDate: new Date(),
            };
        case types.START_RIDE_FAILARE:
            return {
                ...state,
                isActive: false,
                startDate: null,
                isFetching: false,
                error: action.error
            }

        case types.START_RIDE_SUCCESS:
            persistData(asyncStorageKeys.scooterData, { ...state, isActive: true,  idRide : action.payload.id,});
            return {
                ...state,
                isFetching: false,
                isActive: true,
                idRide: action.payload.id,
            }

        case types.END_RIDE:
            return {
                ...state,
                isFetching: true,
            };

        case types.END_RIDE_SUCCESS:
        clearData(asyncStorageKeys.scooterData);
            return {
                ...state,
                isFetching: false,
                isActive: false,
                error: '',
            };

        case types.END_RIDE_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: action.error,
            }

        case types.AUTH_RIDE:
            return {
                ...state,
                    isFetching: true,
                    error: '',
             };

        case types.AUTH_RIDE_FAILURE:
            return {
                ...state,
                    isFetching: false,
                    error: action.error,
            };

        case types.AUTH_RIDE_SUCCESS:
        return {
            ...state,
                isFetching: false,
                error: '',
         };
         case types.PENDING_RIDE:
            return {
              ...state,
              isFetching: true,
              error: ""
            };
          case types.PENDING_RIDE_FAILURE:
            return {
              ...state,
              isFetching: false,
              error: action.error
            };
          case types.PENDING_RIDE_SUCCESS:
            return {
              ...state,
              isFetching: false,
              error: "",
              pendingRide: action.payload.response.pendingRide,
            };
          case types.PENDING_RIDE_START_SUCCESS:

          const dateStartPoint = action.payload.response.data.startPoint.date.split(" ");
          const hour = dateStartPoint[1].split(':');
          const dateStartPointAux = dateStartPoint[0].split("-");
          const dateStartPointNew = `${dateStartPointAux[2]}-${dateStartPointAux[1]}-${dateStartPointAux[0]}`;

          persistData(asyncStorageKeys.scooterData, {
            idRide: action.payload.response.data.id,
            initialValue: 4.3,
            valuePerMinute: 0.45,
            minuteFree: 15,
            startDate: Moment(new Date(dateStartPointNew)).add(hour[0],'hours').add(hour[1],'minutes').add(3,"hours"),
            isActive: true,
          });

          return {
            ...state,
            isFetching: false,
            error: "",
            pendingRide: action.payload.response.pendingRide,
            startDate: Moment(new Date(dateStartPointNew)).add(hour[0],'hours').add(hour[1],'minutes').add(3,"hours"),
            idRide: action.payload.response.data.id,
            initialValue: 4.3,
            valuePerMinute: 0.45,
            minuteFree: 15,
            isActive: true,
          };

          case types.PENDING_TRANSACTION_RIDE:
          return {
            ...state,
            isFetching: true,
            error: ""
          };
        case types.PENDING_TRANSACTION_RIDE_FAILURE:
          return {
            ...state,
            isFetching: false,
            error: action.error
          };
        case types.PENDING_TRANSACTION_RIDE_SUCCESS:
          return {
            ...state,
            isFetching: false,
            error: "",
            pendingTransactionRide: action.payload.response,
          };

          case types.PAYMENT_PENDING_TRANSACTION_RIDE:
          return {
            ...state,
            isFetching: true,
            isActive: false,
            pendingRide: false,
            error: ""
          };
        case types.PAYMENT_PENDING_TRANSACTION_RIDE_FAILURE:
          return {
            ...state,
            isFetching: false,
            error: action.error
          };
        case types.PAYMENT_PENDING_TRANSACTION_RIDE_SUCCESS:
          return {
            ...state,
            isFetching: false,
            pendingTransactionRide: {},
          };

        default:
            return state;
    }
}

export default reducer;

//Actions creators

// AUTH _RIDE ACTION CREATORS
function authRide() {
    return { type: types.AUTH_RIDE };
}

function authRideSuccess(response) {
    return {
        type: types.AUTH_RIDE_SUCCESS,
        response
    };
}

function authRideFailure(error) {
    return {
        type: types.AUTH_RIDE_FAILURE,
        error
    };
}

// START_RIDE ACTION CREATORS
function startRide() {
    return { type: types.START_RIDE };
}

function startRideSuccess(payload) {
    return {
        type: types.START_RIDE_SUCCESS ,
        payload,
    };
}

function startRideFailure(error) {
    clearData(asyncStorageKeys.scooterData);
    return {
        type: types.START_RIDE_FAILARE,
        error,
    }
}

//END_RIDE ACTIONS CREATORS

function endRide() {
    return { type: types.END_RIDE };
}

function endRideSuccess(payload) {
    return {
        type:  types.END_RIDE_SUCCESS ,
        payload,
    }
}

function endRideFailure(error) {
    return {
        type: types.END_RIDE_FAILURE,
        error,
    }
}

function pendingRide() {
  return {
    type: types.PENDING_RIDE
  };
}

function pendingRideSuccess(response) {
  return {
    type: types.PENDING_RIDE_SUCCESS,
    payload: {
      response
    }
  };
}

function pendingRideFailure(error) {
  return {
      type: types.PENDING_RIDE_FAILURE,
      error,
  }
}

function pendingRideStartSuccess(response) {
  return {
    type: types.PENDING_RIDE_START_SUCCESS,
    payload: {
      response
    }
  };
}

function pendingTransactionRide(response) {
  return {
    type: types.PENDING_TRANSACTION_RIDE,
    payload: {
      response
    }
  };
}

function pendingTransactionRideFailure(error) {
  return {
      type: types.PENDING_TRANSACTION_RIDE_FAILURE,
      error,
  }
}

function pendingTransactionRideSuccess(response) {
  return {
    type: types.PENDING_TRANSACTION_RIDE_SUCCESS,
    payload: {
      response
    }
  };
}

function paymentPendingTransactionRide(response) {
  return {
    type: types.PAYMENT_PENDING_TRANSACTION_RIDE ,
    payload: {
      response
    }
  };
}

function paymentPendingTransactionRideFailure(error) {
  return {
      type: types.PAYMENT_PENDING_TRANSACTION_RIDE_FAILURE,
      error,
  }
}

function paymentPendingTransactionRideSuccess(response) {
  return {
    type: types.PAYMENT_PENDING_TRANSACTION_RIDE_SUCCESS,
    payload: {
      response
    }
  };
}


// Thunk action creators

export function fetchAuthRide(name, cpf, email) {
    return async function (dispatch) {
        // dispatch request action
        dispatch(authRide());

        try {
            const requestBody = {
                name,
                email,
                cpf,
            };

            const response = await voudRequest('/scoo/authToken', 'POST', requestBody, true);
            dispatch(authRideSuccess(response));
            persistData(asyncStorageKeys.scooterToken, response.payload);

            return response;

        } catch (error) {
            if (__DEV__) console.tron.log(error.message, true);
            if (!requestErrorHandler(dispatch, error,
                dispatch(authRideFailure("Ocorreu um erro na autenticação tente novamente.")))) {
                throw error;
            }
        }
    }
}

// START_RIDE
export function fetchStartRide(code) {

    return async function (dispatch) {
        dispatch(startRide());

        try {

            const requestBody = { code };
            const response = await voudRequest('/scoo/rides', 'POST', requestBody, true, true);

            dispatch(startRideSuccess(response.payload));

        } catch (error) {
            if (__DEV__) console.tron.log(error.message, true);
                dispatch(startRideFailure("O QrCode informando não é válido! Por favor, tente novamente ou procure um operador da SCOO se o problema persistir."))
                throw error;
        }
    }
}

// END_RIDE

export function fetchEndRide( code, idRide){
   return async function(dispatch){
    dispatch(endRide());

    try {

        const requestBody = { code };
        const response = await voudRequest(`/scoo/rides/${idRide}/end`, 'POST', requestBody, true, true);

        dispatch(endRideSuccess(response.payload));

        return response.payload;

    } catch (error) {
        if (__DEV__) console.tron.log(error.message, true);
            if (!requestErrorHandler(dispatch, error, endRideFailure("O QrCode informando não é válido! Por favor, tente novamente ou procure um operador da SCOO se o problema persistir."))) {
                throw error;
            }
    }
   }
}

export function fetchPendingRide(idCustomer, isMenuService) {
  return async function(dispatch) {
    dispatch(pendingRide());

    try {

      const response = await voudRequest(`/scoo/rides/${idCustomer}`, "GET",null,true,true);
      const dataStartPoint = response.payload.id !== undefined ?  {
        pendingRide: true,
        data: response.payload,
      } : {
        pendingRide: false,
        data: {},
      }

      if(isMenuService && dataStartPoint.pendingRide){
        dispatch(pendingRideStartSuccess(dataStartPoint));
      } else {
        dispatch(pendingRideSuccess(dataStartPoint));
      }
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(
          dispatch,
          error,
          dispatch(
            pendingRideFailure(
              "Ocorreu um erro na autenticação tente novamente."
            )
          )
        )
      ) {
        throw error;
      }
    }
  };
}

export function fetchPendingTransactionRide() {
  return async function(dispatch) {
    dispatch(pendingTransactionRide());

    try {

      const response = await voudRequest(
        `/scoo/hasPendingTransaction/`,
        "GET",
        null,
        true,
        true
      );

      dispatch(pendingTransactionRideSuccess(response.payload));
      return;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(
          dispatch,
          error,
          dispatch(
            pendingTransactionRideFailure(
              "Ocorreu um erro na autenticação tente novamente."
            )
          )
        )
      ) {
        throw error;
      }
    }
  };
}

async function _requestVoudTransactionConfirmation(params) {

  const { id, rideValue } = params;

  const paymentInfo =
      {
          paymentMethod: {
              id
          },
      };

  const requestBody = {
      type: "CREDIT",
      ...paymentInfo,
      rideValue: rideValue
  };
  return voudRequest(`/scoo/lastPayment`, 'POST', requestBody, true,true);
}

export function fetchPaymentPendingTransaction(params) {
  return async function (dispatch) {
      dispatch(paymentPendingTransactionRide());
      try {

          const response = await _requestVoudTransactionConfirmation(params);
          const { acquirerStatusDescription } = response.payload;

          if(acquirerStatusDescription === resultCodeTransaction.DENIED){
              dispatch(paymentPendingTransactionRideFailure(messageError.DENIED));
              return acquirerStatusDescription;
          } else if (acquirerStatusDescription === undefined){
              dispatch(paymentPendingTransactionRideFailure(messageError.DENIED));
              return  {
                  acquirerStatusDescription: "DENIED",
              };
          }
          dispatch(paymentPendingTransactionRideSuccess(acquirerStatusDescription));
          return acquirerStatusDescription;

      } catch (error) {
          if (__DEV__) console.tron.log(error.message, true);
          if (!requestErrorHandler(dispatch, error, paymentPendingTransactionRideFailure(messageError.DENIED))) {
              throw error;
          }
      }
  }
}
