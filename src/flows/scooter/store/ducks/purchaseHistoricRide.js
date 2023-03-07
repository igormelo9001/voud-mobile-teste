import { voudRequest } from '../../../../shared/services';
import { requestErrorHandler } from '../../../../shared/request-error-handler';

// Actitons Types

const Types = {
  PURCHASE_HISTORIC_RIDE: 'voud/scooter/PURCHASE_HISTORIC_RIDE',
  PURCHASE_HISTORIC_RIDE_SUCCESS: 'voud/scooter/PURCHASE_HISTORIC_RIDE_SUCCESS',
  PURCHASE_HISTORIC_RIDE_FAILURE: 'voud/scooter/PURCHASE_HISTORIC_RIDE_FAILURE',
};

// Reducer
const initialState = {
  data: {},
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case Types.PURCHASE_HISTORIC_RIDE:
      return {
        ...state,
      };
    case Types.PURCHASE_HISTORIC_RIDE_FAILURE:
      return {
        ...state,
        data: {},
      };
    case Types.PURCHASE_HISTORIC_RIDE_SUCCESS:
      return {
        ...state,
        data: action.payload.response,
      };
    default:
      return state;
  }
}

export default reducer;

// Action creators
function purchaseHistoricRide() {
  return {
    type: Types.PURCHASE_HISTORIC_RIDE,
  };
}

function purchaseHistoricSuccess(response) {
  return {
    type: Types.PURCHASE_HISTORIC_RIDE_SUCCESS,
    payload: {
      response,
    },
  };
}

function purchaseHistoricFailure(error) {
  return {
    type: Types.PURCHASE_HISTORIC_RIDE_FAILURE,
    error,
  };
}

// Thunk action creators

export function fetchPurchaseHistoricRide(idCustomer, idScooTransaction) {
  return async function(dispatch) {
    dispatch(purchaseHistoricRide());
    try {
      const requestBody = {
        idCustomer,
        idScooTransaction,
      };
      const response = await voudRequest(
        '/scoo/rides/findByTransaction/',
        'POST',
        requestBody,
        true
      );
      dispatch(purchaseHistoricSuccess(response.payload));
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(
          dispatch,
          error,
          dispatch(purchaseHistoricFailure('Ocorreu um erro na autenticação tente novamente.'))
        )
      ) {
        throw error;
      }
    }
  };
}
