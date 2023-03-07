import { requestErrorHandler } from '../../../shared/request-error-handler';
import { voudRequest } from '../../../shared/services';
import { GATrackEvent, GAEventParams } from '../../../shared/analytics';
import { getEncryptionConfig } from '../../../redux/selectors';

// Actions
const REQUEST_CARD = 'voud/requestCard/REQUEST_CARD';
const REQUEST_CARD_SUCCESS = 'voud/requestCard/REQUEST_CARD_SUCCESS';
const REQUEST_CARD_FAILURE = 'voud/requestCard/REQUEST_CARD_FAILURE';

const REQUEST_CARD_PRICE_DELIVERY = 'voud/requestCard/REQUEST_CARD_PRICE_DELIVERY';
const REQUEST_CARD_PRICE_DELIVERY_SUCCESS = 'voud/requestCard/REQUEST_CARD_PRICE_DELIVERY_SUCCESS';
const REQUEST_CARD_PRICE_DELIVERY_FAILURE = 'voud/requestCard/REQUEST_CARD_PRICE_DELIVERY_FAILURE';

const REQUEST_CARD_REGISTER = 'voud/requestCard/REQUEST_CARD_REGISTER';
const REQUEST_CARD_REGISTER_SUCCESS = 'voud/requestCard/REQUEST_CARD_REGISTER_SUCCESS';
const REQUEST_CARD_REGISTER_FAILURE = 'voud/requestCard/REQUEST_CARD_REGISTER_FAILURE';

export const productTypes = {
  REQUEST_CARD: 'REQUEST_CARD',
  BOM: 'BOM',
};

// Reducer
const initialState = {
  isFetching: false,
  error: '',
  price: 0,
  register: false,
  consultingError: false,
};

let isRegister = false;

function reducer(state = initialState, action) {
  switch (action.type) {
    // PRE AUTH
    case REQUEST_CARD:
      return {
        ...state,
        isFetching: true,
        error: '',
      };
    case REQUEST_CARD_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: '',
        consultingError: true,
        ...action.response,
      };
    case REQUEST_CARD_SUCCESS:
      isRegister = parseInt(action.payload.returnCode) !== 200;
      const isConsultingError = parseInt(action.payload.returnCode) === 1;
      return {
        ...state,
        isFetching: false,
        register: isRegister,
        consultingError: isConsultingError,
        error: isConsultingError ? 'Falha na consulta do cartão. Tente novamente mais tarde.' : '',
        ...action.response,
      };
    case REQUEST_CARD_PRICE_DELIVERY:
      return {
        ...state,
        isFetching: true,
        error: '',
        price: 0,
      };
    case REQUEST_CARD_PRICE_DELIVERY_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: '',
        price: action.response.items.REQUEST_CARD_PARAMETER_VALUE,
      };
    case REQUEST_CARD_PRICE_DELIVERY_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: '',
        price: 0,
        error: action.error,
      };
    case REQUEST_CARD_REGISTER:
      return {
        ...state,
        isFetching: true,
        error: '',
      };
    case REQUEST_CARD_REGISTER_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    case REQUEST_CARD_REGISTER_SUCCESS:
      isRegister = parseInt(action.payload.returnCode) === 201;
      return {
        ...state,
        isFetching: false,
        error: '',
        register: isRegister,
        ...action.response,
      };

    default:
      return state;
  }
}

export default reducer;

// Actions creators

// PRE AUTH ACTIONS
function requestCard() {
  return {
    type: REQUEST_CARD,
  };
}
function requestCardSuccess(response) {
  return {
    type: REQUEST_CARD_SUCCESS,
    payload: response,
  };
}
function requestCardFailure(response) {
  return {
    type: REQUEST_CARD_FAILURE,
    response,
  };
}

// PRICE DELIVERY RESIDENCE
function requestPriceDeliveryResidence() {
  return {
    type: REQUEST_CARD_PRICE_DELIVERY,
  };
}
function requestPriceDeliveryResidenceSuccess(response) {
  return {
    type: REQUEST_CARD_PRICE_DELIVERY_SUCCESS,
    response,
  };
}
function requestPriceDeliveryResidenceFailure(error) {
  return {
    type: REQUEST_CARD_PRICE_DELIVERY_FAILURE,
    error,
  };
}

// REGISTER
function registerCard() {
  return {
    type: REQUEST_CARD_REGISTER,
  };
}
function registerCardSuccess(response) {
  return {
    type: REQUEST_CARD_REGISTER_SUCCESS,
    payload: response,
  };
}
function registerCardFailure(error) {
  return {
    type: REQUEST_CARD_REGISTER_FAILURE,
    error,
  };
}

async function _requestVoudPayment(data, creditCardSecurityCode) {
  const { userData, params } = data;

  const requestBody = {
    customer: {
      id: userData.customer.id,
      motherName: userData.customer.motherName,
      fatherName: userData.customer.fatherName,
      mobile: userData.customer.mobile,
      phone: userData.customer.phone,
      rg: userData.customer.rg,
      cpf: userData.customer.cpf,
      email: userData.customer.email,
      address: userData.address,
      shippingAddress: userData.addressDelivery,
      productType: 'REQUEST_CARD',
      issuerType: 'BOM',
    },
    transactionValue: userData.value.replace(',', '.'),
    securityCode: creditCardSecurityCode,
    paymentMethod: {
      id: params.paymentMethodId,
    },
  };
  return voudRequest('/card/request/bom/', 'POST', requestBody, true);
}

export function fetchVerifyCardRequested(cpf) {
  return async dispatch => {
    // dispatch request action
    dispatch(requestCard(cpf));
    let response = {};
    try {
      response = await voudRequest(`/card/request/bom/user/${cpf}`, 'GET', null, true);

      const payload = response.payload ? response.payload : response;
      // const { categories: { FORM }, actions: { SUBMIT }, labels: { SUBMIT_REQUEST_CARD_PRE_AUTH } } = GAEventParams;
      // GATrackEvent(FORM, SUBMIT, SUBMIT_REQUEST_CARD_PRE_AUTH);

      dispatch(requestCardSuccess(payload));
      return response.payload;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      dispatch(requestCardFailure());
      return {
        returnCode: 1,
      };
    }
  };
}

export function fetchRegisterComplementaryData(params) {
  return async dispatch => {
    // dispatch request action
    dispatch(registerCard());

    try {
      const requestBody = {
        customer: {
          id: params.customer.id,
          motherName: params.customer.motherName,
          fatherName: params.customer.fatherName,
          mobile: params.customer.mobile,
          phone: params.customer.phone,
          rg: params.customer.rg,
          email: params.customer.email,
          address: params.address,
        },
      };

      const response = await voudRequest('/card/request/bom', 'POST', requestBody, true);

      // const { categories: { FORM }, actions: { SUBMIT }, labels: { SUBMIT_REQUEST_CARD_PRE_AUTH } } = GAEventParams;
      // GATrackEvent(FORM, SUBMIT, SUBMIT_REQUEST_CARD_PRE_AUTH);

      dispatch(registerCardSuccess(response));
      return response.payload;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      requestErrorHandler(dispatch, error, registerCardFailure(error.message));
      throw error;
    }
  };
}

export function fetchPaymentRegisterComplementaryData(params, creditCardSecurityCode) {
  return async dispatch => {
    // dispatch request action
    dispatch(registerCard());

    try {
      const response = await _requestVoudPayment(params, creditCardSecurityCode);
      // const { categories: { FORM }, actions: { SUBMIT }, labels: { SUBMIT_REQUEST_CARD_PRE_AUTH } } = GAEventParams;
      // GATrackEvent(FORM, SUBMIT, SUBMIT_REQUEST_CARD_PRE_AUTH);

      dispatch(registerCardSuccess(response));

      return response.payload;
    } catch (error) {
      if (__DEV__) console.tron.log(error, true);
      requestErrorHandler(dispatch, error, registerCardFailure(error.message));
      throw error;
    }
  };
}

export function fetchPriceDeliveryResidence() {
  return async dispatch => {
    // dispatch request action
    dispatch(requestPriceDeliveryResidence());

    const requestBody = { key: 'REQUEST_CARD_PARAMETER_VALUE' };

    try {
      const response = await voudRequest(`/content/item-key/`, 'POST', requestBody, true);

      dispatch(requestPriceDeliveryResidenceSuccess(response.payload));
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      requestErrorHandler(dispatch, error, requestPriceDeliveryResidenceFailure(error.message));
      throw error;
    }
  };
}
