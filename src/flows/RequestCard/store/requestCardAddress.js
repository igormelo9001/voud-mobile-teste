import { requestErrorHandler } from '../../../shared/request-error-handler';
import { voudRequest } from '../../../shared/services';

// Actions
const REQUEST_CARD_ADDRESS = 'voud/login/REQUEST_CARD_ADDRESS';
const REQUEST_CARD_ADDRESS_SUCCESS = 'voud/login/REQUEST_CARD_ADDRESS_SUCCESS';
const REQUEST_CARD_ADDRESS_FAILURE = 'voud/login/REQUEST_CARD_ADDRESS_FAILURE';

const initialState = {
  isFetching: false,
  error: '',
  data: [],
};

function reducer(state = initialState, action) {
  switch (action.type) {
    // PRE AUTH
    case REQUEST_CARD_ADDRESS:
      return {
        ...state,
        isFetching: true,
        error: '',
      };
    case REQUEST_CARD_ADDRESS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    case REQUEST_CARD_ADDRESS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: '',
        data: action.response,
      };
    default:
      return state;
  }
}

export default reducer;

// Actions creators

// PRE AUTH ACTIONS
function requestCardAddress() {
  return {
    type: REQUEST_CARD_ADDRESS,
  };
}
function requestCardAddressSuccess(response) {
  return {
    type: REQUEST_CARD_ADDRESS_SUCCESS,
    response,
  };
}
function requestCardAddressFailure(error) {
  return {
    type: REQUEST_CARD_ADDRESS_FAILURE,
    error,
  };
}

export function fetchCardAddressRequested() {
  return async dispatch => {
    // dispatch request action
    dispatch(requestCardAddress());

    try {
      const response = await voudRequest(
        `/content/service-point/address/take-card/list/`,
        'GET',
        null,
        true
      );

      const listAddress = [];
      response.payload.map(item => {
        const address = {
          name: item.name,
          shortAddress: item.shortAddress,
        };

        // listAddress.push(`${item.name} ${item.shortAddress}`);
        listAddress.push(address);
      });

      dispatch(requestCardAddressSuccess(listAddress));
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      requestErrorHandler(dispatch, error, requestCardAddressFailure(error.message));
      throw error;
    }
  };
}
