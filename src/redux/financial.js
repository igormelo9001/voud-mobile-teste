// VouD imports
import { voudRequest } from "../shared/services";
import { requestErrorHandler } from "../shared/request-error-handler";
import { FBEventsConstants, FBLogEvent } from "../shared/facebook";
import { formatCieloExpirationDate } from "../utils/parsers-formaters";
import { getIssuerType, issuerTypes } from "../redux/transport-card";
import { trackPurchaseEvent } from "../utils/tracking-util";
import { formatPaymentMethodName } from "../utils/payment-card";
import { buildEncryptedCardData } from "../utils/crypto-util";
import { getEncryptionConfig } from "./selectors";

// Actions

const SET_PURCHASE_TRANSPORT_CARD =
  "voud/financial/SET_PURCHASE_TRANSPORT_CARD";
const CLEAR_PURCHASE_TRANSPORT_CARD =
  "voud/financial/CLEAR_PURCHASE_TRANSPORT_CARD";

const REQUEST_PURCHASE_LIST = "voud/financial/REQUEST_PURCHASE_LIST";
const REQUEST_PURCHASE_LIST_SUCCESS =
  "voud/financial/REQUEST_PURCHASE_LIST_SUCCESS";
const REQUEST_PURCHASE_LIST_FAILURE =
  "voud/financial/REQUEST_PURCHASE_LIST_FAILURE";
const REQUEST_PURCHASE_LIST_CLEAR =
  "voud/financial/REQUEST_PURCHASE_LIST_CLEAR";

const VIEW_PURCHASE_DETAILS = "voud/financial/VIEW_PURCHASE_DETAILS";

const REQUEST_PAYMENT_TRANSACTION =
  "voud/financial/REQUEST_PAYMENT_TRANSACTION";
const REQUEST_PAYMENT_TRANSACTION_SUCCESS =
  "voud/financial/REQUEST_PAYMENT_TRANSACTION_SUCCESS";
const REQUEST_PAYMENT_TRANSACTION_FAILURE =
  "voud/financial/REQUEST_PAYMENT_TRANSACTION_FAILURE";
const REQUEST_PAYMENT_TRANSACTION_CLEAR =
  "voud/financial/REQUEST_PAYMENT_TRANSACTION_CLEAR";

const CALCULATE_TAX = "voud/financial/CALCULATE_TAX";
const CALCULATE_TAX_SUCCESS = "voud/financial/CALCULATE_TAX_SUCCESS";
const CALCULATE_TAX_FAILURE = "voud/financial/CALCULATE_TAX_FAILURE";
const CALCULATE_TAX_CLEAR = "voud/financial/CALCULATE_TAX_CLEAR";

export const financialActions = {
  REQUEST_PAYMENT_TRANSACTION_SUCCESS
};

// Cielo Payment Status Code
export const cieloPaymentStatusCode = {
  NOT_FINISHED: 0,
  AUTHORIZED_CODE: 1,
  PAYMENT_CONFIRMED: 2,
  DENIED: 3,
  PENDING: 12
};

export const paymentCardTypes = {
  CREDIT: "CREDIT",
  DEBIT: "DEBIT"
};

export const productTypes = {
  BOM: "BOM",
  BU: "BU",
  PHONE_RECHARGE: "PHONE_RECHARGE",
  REQUEST_CARD: "REQUEST_CARD",
  TICKET_UNITY: "TICKET_UNITY",
  QRCODE: "QRCODE",
  LEGAL: "LEGAL"
};

export const getProductTypeLabel = productType => {
  switch (productType) {
    case productTypes.BOM:
      return "BOM";
    case productTypes.BU:
      return "Bilhete Único";
    case productTypes.PHONE_RECHARGE:
      return "Recarga de celular";
    case productTypes.QRCODE:
      return "QrCode";
    case productTypes.LEGAL:
      return "LEGAL";
  }
};

// Reducer
const initialState = {
  purchaseList: {
    isFetching: false,
    error: "",
    reachedEnd: false,
    page: 0,
    data: []
  },
  purchaseDetailId: null,
  paymentTransaction: {
    isFetching: false,
    error: ""
  },
  purchaseTax: {
    isFetching: false,
    error: "",
    data: 0
  },
  purchaseTransportCardId: null
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_PURCHASE_TRANSPORT_CARD:
      return {
        ...state,
        purchaseTransportCardId: action.cardId
      };
    case CLEAR_PURCHASE_TRANSPORT_CARD:
      return {
        ...state,
        purchaseTransportCardId: null
      };
    case REQUEST_PURCHASE_LIST:
      return {
        ...state,
        purchaseList: {
          ...state.purchaseList,
          isFetching: true
        }
      };
    case REQUEST_PURCHASE_LIST_SUCCESS:
      return {
        ...state,
        purchaseList: {
          ...state.purchaseList,
          isFetching: false,
          error: "",
          page: ++action.response.payload.currentPage,
          data: action.response.payload.data
            ? state.purchaseList.data
                .filter(el =>
                  action.response.payload.data &&
                  action.response.payload.data.find(
                    curPurchase => el.id === curPurchase.id
                  )
                    ? false
                    : true
                )
                .concat(action.response.payload.data)
            : state.purchaseList.data,
          reachedEnd:
            action.response.payload.currentPage >=
            action.response.payload.maxPage
        }
      };
    case REQUEST_PURCHASE_LIST_FAILURE:
      return {
        ...state,
        purchaseList: {
          ...state.purchaseList,
          isFetching: false,
          error: action.error
        }
      };
    case REQUEST_PURCHASE_LIST_CLEAR:
      return {
        ...state,
        purchaseList: {
          ...state.purchaseList,
          page: 0,
          data: []
        }
      };
    case VIEW_PURCHASE_DETAILS:
      return {
        ...state,
        purchaseDetailId: action.purchaseId
      };
    case REQUEST_PAYMENT_TRANSACTION:
      return {
        ...state,
        paymentTransaction: {
          ...state.paymentTransaction,
          isFetching: true,
          error: ""
        }
      };
    case REQUEST_PAYMENT_TRANSACTION_SUCCESS:
      return {
        ...state,
        paymentTransaction: {
          ...state.paymentTransaction,
          isFetching: false,
          error: ""
        }
      };
    case REQUEST_PAYMENT_TRANSACTION_FAILURE:
      return {
        ...state,
        paymentTransaction: {
          ...state.paymentTransaction,
          isFetching: false,
          error: action.error
        }
      };
    case REQUEST_PAYMENT_TRANSACTION_CLEAR:
      return {
        ...state,
        paymentTransaction: {
          ...state.paymentTransaction,
          isFetching: false,
          error: ""
        }
      };
    case CALCULATE_TAX:
      return {
        ...state,
        purchaseTax: {
          ...state.purchaseTax,
          isFetching: true,
          error: ""
        }
      };
    case CALCULATE_TAX_SUCCESS:
      return {
        ...state,
        purchaseTax: {
          isFetching: false,
          error: "",
          data: {
            taxValue: action.response.payload.taxValue * 100,
            isExempt: action.response.payload.exempt
          }
        }
      };
    case CALCULATE_TAX_FAILURE:
      return {
        ...state,
        purchaseTax: {
          ...state.purchaseTax,
          isFetching: false,
          error: action.error
        }
      };
    case CALCULATE_TAX_CLEAR:
      return {
        ...state,
        purchaseTax: {
          isFetching: false,
          error: "",
          data: {
            taxValue: 0,
            isExempt: false
          }
        }
      };
    default:
      return state;
  }
}

export default reducer;

// Actions creators

// Set Purchase Transport Card
export function setPurchaseTransportCard(cardId) {
  return {
    type: SET_PURCHASE_TRANSPORT_CARD,
    cardId
  };
}

export function clearPurchaseTransportCard() {
  return {
    type: CLEAR_PURCHASE_TRANSPORT_CARD
  };
}

// Request purchase history
function requestPurchaseList() {
  return { type: REQUEST_PURCHASE_LIST };
}
function requestPurchaseListSuccess(response) {
  return {
    type: REQUEST_PURCHASE_LIST_SUCCESS,
    response
  };
}
function requestPurchaseListFailure(error) {
  return {
    type: REQUEST_PURCHASE_LIST_FAILURE,
    error
  };
}

export function requestPurchaseListClear() {
  return { type: REQUEST_PURCHASE_LIST_CLEAR };
}

// Request payment transaction
function requestPaymentTransaction() {
  return { type: REQUEST_PAYMENT_TRANSACTION };
}
export function requestPaymentTransactionSuccess() {
  return {
    type: REQUEST_PAYMENT_TRANSACTION_SUCCESS
  };
}
function requestPaymentTransactionFailure(error) {
  return {
    type: REQUEST_PAYMENT_TRANSACTION_FAILURE,
    error
  };
}

export function requestPaymentTransactionClear() {
  return { type: REQUEST_PAYMENT_TRANSACTION_CLEAR };
}

// View details
export function viewPurchaseDetails(purchaseId) {
  return {
    type: VIEW_PURCHASE_DETAILS,
    purchaseId
  };
}

// Request Calculate Tax
function calculateTax() {
  return { type: CALCULATE_TAX };
}
function calculateTaxSuccess(response) {
  return {
    type: CALCULATE_TAX_SUCCESS,
    response
  };
}
function calculateTaxFailure(error) {
  return {
    type: CALCULATE_TAX_FAILURE,
    error
  };
}
export function calculateTaxClear() {
  return { type: CALCULATE_TAX_CLEAR };
}

// Thunk action creators

export function fetchPurchaseList(customerId, page) {
  return async dispatch => {
    // dispatch request action
    dispatch(requestPurchaseList());

    try {
      const requestBody = {
        page,
        size: 10,
        paginationData: {
          customerId
        }
      };

      const response = await voudRequest(
        "/financial/statement",
        "POST",
        requestBody,
        true
      );
      dispatch(requestPurchaseListSuccess(response));
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(
          dispatch,
          error,
          requestPurchaseListFailure(error.message)
        )
      ) {
        throw error;
      }
    }
  };
}

// Product Info

function _getTransportCardInfo(params) {
  const issuerType = getIssuerType(params.transportCardIssuer);
  const buInfo =
    issuerType === issuerTypes.BU
      ? {
          idTransportCardWallet: params.buAdditionalData.idTransportCardWallet,
          productQuantity: !params.buAdditionalData.productQuantity
            ? 1
            : params.buAdditionalData.productQuantity
        }
      : {};
  const rechargeValue = Number(params.rechargeValue);

  return {
    rechargeValue: (rechargeValue / 100).toFixed(2),
    serviceValue: 0,
    transportCard: {
      uuid: params.transportCardId
    },
    issuerType,
    ...buInfo
  };
}

function _getPhoneRechargeInfo(params) {
  return {
    rechargeValue: Number(params.rechargeValue / 100).toFixed(2),
    rechargeProductId: params.rechargeProductId,
    operator: params.phoneCarrierName,
    mobilePhone: {
      countryCode: 55,
      stateCode: Number(params.phoneNumber.slice(0, 2)),
      number: Number(params.phoneNumber.slice(2))
    }
  };
}

function _getProductInfo(params) {
  const { productType } = params;
  switch (productType) {
    case productTypes.BOM:
    case productTypes.BU:
    case productTypes.LEGAL:
      return _getTransportCardInfo(params);
    case productTypes.PHONE_RECHARGE:
      return _getPhoneRechargeInfo(params);
    default:
      return {};
  }
}

async function _requestVoudPayment(params, { cieloPK, adyenPK }) {
  const financialCardObj = {
    ...(params.saveCreditCard
      ? {
          alias: formatPaymentMethodName(
            params.creditCardBrand,
            params.creditCardNumber
          )
        }
      : {}),
    saveCard: params.saveCreditCard ? params.saveCreditCard : false,
    cardNumber: params.creditCardNumber,
    expirationDate: formatCieloExpirationDate(params.creditCardExpirationDate),
    securityCode: params.creditCardSecurityCode,
    brand: params.creditCardBrand,
    holder: params.creditCardHolder
  };

  const paymentInfo = params.paymentMethodId
    ? {
        paymentMethod: {
          id: params.paymentMethodId
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
  const productInfo = _getProductInfo(params);
  const requestBody = {
    type: paymentCardTypes.CREDIT,
    ...paymentInfo,
    ...productInfo,
    ...(params.scheduledDay
      ? {
          recurrentPayment: {
            scheduledDay: params.scheduledDay
          }
        }
      : {}),
    ...(params.promocode && params.promocode.code
      ? {
          promocode: {
            code: params.promocode.code,
            rechargeValue: params.promocode.rechargeValue,
            idCustomer: params.promocode.idCustomer,
            brandcard: params.promocode.brandcard
          }
        }
      : null)
  };
  const paymentEndpoint =
    params.productType === productTypes.PHONE_RECHARGE
      ? "/mobile/recharge/credit"
      : "/financial/credit";

  return voudRequest(paymentEndpoint, "POST", requestBody, true);
}

export function fetchPaymentTransaction(params) {
  return async function(dispatch, getState) {
    // dispatch payment transaction request action
    dispatch(requestPaymentTransaction());

    try {
      FBLogEvent(FBEventsConstants.ADDED_PAYMENT_INFO);

      const encryptConfig = getEncryptionConfig(getState());

      const voudFinancialResponse = await _requestVoudPayment(
        params,
        encryptConfig
      );

      const merchantOrderId =
        voudFinancialResponse &&
        voudFinancialResponse.payload &&
        voudFinancialResponse.payload.initiatorTransactionKey
          ? voudFinancialResponse.payload.initiatorTransactionKey
          : null;

      if (merchantOrderId) {
        trackPurchaseEvent(
          merchantOrderId,
          Number(params.rechargeValue) / 100,
          0,
          params.productType
        );
      }

      dispatch(requestPaymentTransactionSuccess());

      return voudFinancialResponse;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(
          dispatch,
          error,
          requestPaymentTransactionFailure(error.message)
        )
      ) {
        throw error;
      }
    }
  };
}

export function calculatePurchaseTax(params) {
  return async dispatch => {
    // dispatch request action
    dispatch(calculateTax());

    const { value, uuid, issuerType, idTransportCardWallet } = params;

    try {
      const requestBody = {
        rechargeValue: value,
        transportCard: {
          uuid
        },
        issuerType,
        ...(idTransportCardWallet ? { idTransportCardWallet } : {})
      };
      const response = await voudRequest(
        "/financial/service-value",
        "POST",
        requestBody,
        true
      );
      dispatch(calculateTaxSuccess(response));
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(
          dispatch,
          error,
          calculateTaxFailure(error.message)
        )
      ) {
        throw error;
      }
    }
  };
}
