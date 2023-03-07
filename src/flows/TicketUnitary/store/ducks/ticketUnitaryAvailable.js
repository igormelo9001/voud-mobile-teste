import base64 from "base-64";
import axios from "axios";

// const realm = "dev.voud.com.br"; // Autopass DEV;
// const realm = "hom.voud.com.br"; // Autopass HML;
// const realm = 'voud.com.br'; // Autopass PROD;

import { getQrCodeVisible } from "../../../../shared/remote-config";

// Reducer
const initialState = {
  data: {}
};

// Actitons Types
const Types = {
  AVAILABLE_TICKET_UNITARY:
    "voud/ticketUnitaryAvailable/AVAILABLE_TICKET_UNITARY",
  AVAILABLE_TICKET_UNITARY_SUCCESS:
    "voud/ticketUnitaryAvailable/AVAILABLE_TICKET_UNITARY_SUCCESS",
  AVAILABLE_TICKET_UNITARY_FAILURE:
    "voud/ticketUnitaryAvailable/AVAILABLE_TICKET_UNITARY_FAILURE"
};

// LOGIN ACTIONS
function availableTicket() {
  return { type: Types.AVAILABLE_TICKET_UNITARY };
}
function availableTicketSuccess(response) {
  return {
    type: Types.AVAILABLE_TICKET_UNITARY_SUCCESS,
    payload: response
  };
}
function availableTicketFailure(response) {
  return {
    type: Types.AVAILABLE_TICKET_UNITARY_FAILURE,
    payload: response
  };
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case Types.AVAILABLE_TICKET_UNITARY:
      return {
        ...state,
        data: {}
      };
    case Types.AVAILABLE_TICKET_UNITARY_FAILURE:
      return {
        ...state,
        data: action.payload
      };
    case Types.AVAILABLE_TICKET_UNITARY_SUCCESS:
      return {
        ...state,
        data: action.payload
      };
    default:
      return state;
  }
}

export default reducer;

// thunk action creators
export function fetchUnitaryAvailable() {
  return async dispatch => {
    // dispatch request action
    dispatch(availableTicket());

    try {
      const response = await getQrCodeVisible();
      const qrcode = JSON.parse(response);

      const dataItem = {
        name: "QRCODE",
        visible: qrcode.visible
      };
      dispatch(availableTicketSuccess(dataItem));
    } catch (error) {
      dispatch(
        availableTicketFailure({
          name: "QRCODE",
          visible: false
        })
      );
    }
  };
}
