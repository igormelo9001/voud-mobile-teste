import { voudRequest } from "../../../../shared/services";
import { requestErrorHandler } from "../../../../shared/request-error-handler";

import { getEncryptionConfig } from "../../../../redux/selectors";
import { buildEncryptedCardData } from "../../../../utils/crypto-util";
import { formatCieloExpirationDate } from "../../../../utils/parsers-formaters";

// Types
const Types = {
  FINANCIAL_RIDE: "voud/scooter/FINANCIAL_RIDE",
  FINANCIAL_RIDE_SUCCESS: "voud/scooter/FINANCIAL_RIDE_SUCCESS",
  FINANCIAL_RIDE_FAILURE: "voud/scooter/FINANCIAL_RIDE_FAILURE",

  FINANCIAL_CANCEL_REFUND_RIDE: "voud/scooter/FINANCIAL_CANCEL_REFUND_RIDE",
  FINANCIAL_CANCEL_REFUND_RIDE_SUCCESS:
    "voud/scooter/FINANCIAL_CANCEL_REFUND_RIDE_SUCCESS",
  FINANCIAL_CANCEL_REFUND_RIDE_FAILURE:
    "voud/scooter/FINANCIAL_CANCEL_REFUND_RIDE_FAILURE"
};

const paymentCardTypes = {
  CREDIT: "CREDIT"
};

export const resultCodeTransaction = {
  PAYMENT_CONFIRMED: "PAYMENT_CONFIRMED",
  DENIED: "DENIED"
};

const messageError = {
  DENIED:
    "Tivemos uma falha ao processar seu pagamento, tente novamente utilizando um cartão diferente."
};

// Reducer
const initialState = {
  error: "",
  isFetching: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Types.FINANCIAL_RIDE:
      return {
        ...state,
        isFetching: true,
        error: ""
      };
    case Types.FINANCIAL_RIDE_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case Types.FINANCIAL_RIDE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: ""
      };
    default:
      return state;
  }
}

// Action creators
function financialRide() {
  return {
    type: Types.FINANCIAL_RIDE
  };
}

function financialRideSuccess(response) {
  return {
    type: Types.FINANCIAL_RIDE_SUCCESS,
    payload: {
      response
    }
  };
}

function financialRideFailure(error) {
  return {
    type: Types.FINANCIAL_RIDE_FAILURE,
    error
  };
}

function financialCancelRefundRide() {
  return {
    type: Types.FINANCIAL_CANCEL_REFUND_RIDE
  };
}

function financialCancelRefundRideSuccess(response) {
  return {
    type: Types.FINANCIAL_CANCEL_REFUND_RIDE_SUCCESS,
    payload: {
      response
    }
  };
}

function financialCancelRefundRideFailure(error) {
  return {
    type: Types.FINANCIAL_CANCEL_REFUND_RIDE_FAILURE,
    error
  };
}

async function _requestVoudPayment(params, { cieloPK, adyenPK }) {
  const { isTemporaryCard, items, saveCreditCard, rideValue } = params;

  const financialCardObj = {
    ...(saveCreditCard
      ? {
          alias: params.name
        }
      : {}),
    saveCard: saveCreditCard ? saveCreditCard : false,
    cardNumber: !items.cardNumber ? null : items.cardNumber,
    expirationDate: formatCieloExpirationDate(items.expirationDate),
    securityCode: params.creditCardSecurityCode,
    brand: items.cardFlag,
    holder: items.cardHolder
  };

  const paymentInfo = !isTemporaryCard
    ? {
        paymentMethod: {
          id: params.id
        },
        securityCode: params.creditCardSecurityCode
      }
    : {
        paymentMethod: await buildEncryptedCardData(
          financialCardObj,
          cieloPK,
          adyenPK
        )
      };

  const requestBody = {
    type: paymentCardTypes.CREDIT,
    ...paymentInfo,
    rideValue: rideValue
  };
  return voudRequest("/scoo/scooPreAuth", "POST", requestBody, true, true);
}

export function fetchPaymentTransaction(params) {
  return async function(dispatch, getState) {
    dispatch(financialRide());
    try {
      const encryptConfig = getEncryptionConfig(getState());
      const response = await _requestVoudPayment(params, encryptConfig);

      if (
        response.payload.acquirerStatusDescription ===
        resultCodeTransaction.DENIED
      ) {
        dispatch(financialRideFailure(messageError.DENIED));
        return response.payload;
      } else if (response.payload.acquirerStatusDescription === undefined) {
        dispatch(financialRideFailure(messageError.DENIED));
        return {
          acquirerStatusDescription: "DENIED"
        };
      }

      dispatch(financialRideSuccess(response));
      return response.payload.acquirerStatusDescription;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(
          dispatch,
          error,
          financialRideFailure(error.message)
        )
      ) {
        throw error;
      }
    }
  };
}

async function _requestVoudTransactionConfirmation(params, isStartRide) {
  const { id, rideValue } = params;

  const paymentInfo = {
    paymentMethod: {
      id
    }
  };

  const requestBody = {
    type: paymentCardTypes.CREDIT,
    ...paymentInfo,
    rideValue: rideValue
  };

  const url = isStartRide ? "firstPayment" : "lastPayment";
  return voudRequest(`/scoo/${url}`, "POST", requestBody, true, true);
}

async function _requestVoudTransactionConfirmationRefund(params) {
  const { id } = params;

  const paymentInfo = {
    paymentMethod: {
      id
    }
  };

  const requestBody = {
    type: paymentCardTypes.CREDIT,
    ...paymentInfo
  };

  return voudRequest("/scoo/cancelRefund", "POST", requestBody, true, true);
}

export function fetchRidePaymentTransaction(
  params,
  isStartRide,
  scooId,
  idCustomer
) {
  return async function(dispatch) {
    dispatch(financialRide());
    try {
      const response = await _requestVoudTransactionConfirmation(
        params,
        isStartRide
      );
      const { acquirerStatusDescription, id } = response.payload;

      if (!isStartRide) {
        const requestBody = {
          idCustomer,
          idScooTransaction: id,
          scooId
        };

        await voudRequest(
          "/scoo/rides/update",
          "POST",
          requestBody,
          true,
          true
        );
      }

      if (acquirerStatusDescription === resultCodeTransaction.DENIED) {
        dispatch(financialRideFailure(messageError.DENIED));
        return {
          acquirerStatusDescription,
          id
        };
      } else if (acquirerStatusDescription === undefined) {
        dispatch(financialRideFailure(messageError.DENIED));
        return {
          acquirerStatusDescription: "DENIED",
          id
        };
      }
      dispatch(financialRideSuccess(acquirerStatusDescription));
      return {
        acquirerStatusDescription,
        id
      };
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(
          dispatch,
          error,
          financialRideFailure(messageError.DENIED)
        )
      ) {
        throw error;
      }
    }
  };
}

export function fetchPaymentCancelRefundTransaction(params) {
  return async function(dispatch) {
    dispatch(financialCancelRefundRide());
    try {
      const response = await _requestVoudTransactionConfirmationRefund(params);
      const { acquirerStatusDescription } = response.payload;

      if (acquirerStatusDescription === resultCodeTransaction.DENIED) {
        dispatch(financialCancelRefundRide(messageError.DENIED));
        return acquirerStatusDescription;
      } else if (acquirerStatusDescription === undefined) {
        dispatch(financialCancelRefundRide(messageError.DENIED));
        return {
          acquirerStatusDescription: "DENIED"
        };
      }
      dispatch(financialCancelRefundRideSuccess(acquirerStatusDescription));
      return acquirerStatusDescription;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(
          dispatch,
          error,
          financialCancelRefundRide(messageError.DENIED)
        )
      ) {
        throw error;
      }
    }
  };
}
