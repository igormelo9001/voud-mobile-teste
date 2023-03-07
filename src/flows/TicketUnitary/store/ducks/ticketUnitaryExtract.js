import { voudRequest } from "../../../../shared/services";
import { requestErrorHandler } from "../../../../shared/request-error-handler";

const Types = {
  EXTRACT_TICKET_UNITARY: "voud/TicketUnitary/EXTRACT_TICKET_UNITARY",
  EXTRACT_TICKET_UNITARY_FAILURE:
    "voud/TicketUnitary/EXTRACT_TICKET_UNITARY_FAILURE",
  EXTRACT_TICKET_UNITARY_SUCCESS:
    "voud/TicketUnitary/EXTRACT_TICKET_UNITARY_SUCCESS",
  EXTRACT_TICKET_UNITARY_CLEAR:
    "voud/TicketUnitary/EXTRACT_TICKET_UNITARY_CLEAR"
};

const initialState = {
  isFetching: false,
  error: "",
  data: []
};

function listExtract() {
  return {
    type: Types.EXTRACT_TICKET_UNITARY
  };
}

function listExtractSuccess(response) {
  return {
    type: Types.EXTRACT_TICKET_UNITARY_SUCCESS,
    payload: response
  };
}

function listExtractFailure(response) {
  return {
    type: Types.EXTRACT_TICKET_UNITARY_FAILURE,
    error: response
  };
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case Types.EXTRACT_TICKET_UNITARY:
      return {
        ...state,
        isFetching: true
      };
    case Types.EXTRACT_TICKET_UNITARY_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.payload
      };
    case Types.EXTRACT_TICKET_UNITARY_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case Types.EXTRACT_TICKET_UNITARY_CLEAR:
      return state;

    default:
      return state;
  }
}

export default reducer;

export function clearTicketUnitaryListExtract() {
  return {
    type: Types.EXTRACT_TICKET_UNITARY_CLEAR
  };
}

// Thunk action creators

export function fetchTicketUnitaryListExtract() {
  // eslint-disable-next-line func-names
  return async function(dispatch) {
    dispatch(listExtract());
    try {
      const response = await voudRequest(
        "/customer/qrcode/findExtrato",
        "POST",
        null,
        true
      );
      dispatch(listExtractSuccess(response.payload));

      return response.payload;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(dispatch, error, listExtractFailure(error.message))
      ) {
        throw error;
      }
    }
  };
}
