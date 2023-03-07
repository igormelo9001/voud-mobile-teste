import { voudRequest } from "../../../../shared/services";
import { requestErrorHandler } from "../../../../shared/request-error-handler";
import { trackPurchaseEvent } from "../../../../utils/tracking-util";

// Actitons Types

const Types = {
  ADD_TICKET_UNITARY: "voud/TicketUnitary/ADD_TICKET_UNITARY",
  ADD_TICKET_UNITARY_SUCCESS: "voud/TicketUnitary/ADD_TICKET_UNITARY_SUCCESS",
  ADD_TICKET_UNITARY_FAILURE: "voud/TicketUnitary/ADD_TICKET_UNITARY_FAILURE",

  LIST_TICKET_UNITARY: "voud/TicketUnitary/LIST_TICKET_UNITARY",
  LIST_TICKET_UNITARY_SUCCESS: "voud/TicketUnitary/LIST_TICKET_UNITARY_SUCCESS",
  LIST_TICKET_UNITARY_FAILURE: "voud/TicketUnitary/LIST_TICKET_UNITARY_FAILURE"
};

// Reducer
const initialState = {
  error: "",
  isFetching: false,
  data: []
};

export const paymentCardTypes = {
  CREDIT: "CREDIT",
  DEBIT: "DEBIT"
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case Types.ADD_TICKET_UNITARY:
      return {
        ...state,
        isFetching: true,
        error: ""
      };
    case Types.ADD_TICKET_UNITARY_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case Types.ADD_TICKET_UNITARY_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: ""
      };

    case Types.LIST_TICKET_UNITARY:
      return {
        ...state,
        isFetching: true,
        error: ""
      };
    case Types.LIST_TICKET_UNITARY_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case Types.LIST_TICKET_UNITARY_SUCCESS:
      return {
        data: action.payload,
        isFetching: false,
        error: ""
      };

    default:
      return state;
  }
}

export default reducer;

// Action creators
function addTicket() {
  return {
    type: Types.ADD_TICKET_UNITARY
  };
}

function addTicketSucess(response) {
  return {
    type: Types.ADD_TICKET_UNITARY_SUCCESS,
    payload: response
  };
}

function addTicketFailure(error) {
  return {
    type: Types.ADD_TICKET_UNITARY_FAILURE,
    error
  };
}

// Action creators
function listTicket() {
  return {
    type: Types.LIST_TICKET_UNITARY
  };
}

function listTicketSucess(data) {
  return {
    type: Types.LIST_TICKET_UNITARY_SUCCESS,
    payload: data
  };
}

function lisTicketFailure(error) {
  return {
    type: Types.LIST_TICKET_UNITARY_FAILURE,
    error
  };
}

// Thunk action creators

async function _requestVoudPayment(params) {
  const qtdQrcode = params.rechargeValue / 430;
  const rechargeValue = params.rechargeValue / 100;
  const paymentInfo = {
    paymentMethod: {
      id: params.paymentMethodId
    },
    securityCode: params.creditCardSecurityCode,
    rechargeValue,
    qtdQrcode,
    serviceValue: 0,
    issuerType: "QRCODE"
  };

  const requestBody = {
    type: paymentCardTypes.CREDIT,
    ...paymentInfo
  };
  return voudRequest("/financial/credit", "POST", requestBody, true);
}

export function fetchTicketUnitary(params) {
  // eslint-disable-next-line func-names
  return async function(dispatch) {
    dispatch(addTicket());
    try {
      const response = await _requestVoudPayment(params);
      const merchantOrderId =
        response && response.payload && response.payload.initiatorTransactionKey
          ? response.payload.initiatorTransactionKey
          : null;

      if (merchantOrderId) {
        trackPurchaseEvent(
          merchantOrderId,
          Number(params.rechargeValue) / 100,
          0,
          "QRCODE"
        );
      }

      dispatch(addTicketSucess(response.payload));
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(dispatch, error, addTicketFailure(error.message))
      ) {
        throw error;
      }
    }
  };
}

export function fetchTicketUnitaryList() {
  // eslint-disable-next-line func-names
  return async function(dispatch) {
    dispatch(listTicket());
    try {
      const response = await voudRequest(
        "/customer/qrcode/find",
        "POST",
        null,
        true
      );
      dispatch(listTicketSucess(response.payload));

      return response.payload;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(dispatch, error, lisTicketFailure(error.message))
      ) {
        throw error;
      }
    }
  };
}
