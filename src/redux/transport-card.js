// NPM imports
import Moment from "moment";
import { compose, map, prop, sortBy, toLower } from "ramda";

// VouD imports
import { voudRequest } from "../shared/services";
import { requestErrorHandler } from "../shared/request-error-handler";
import { loginActions } from "./login";
import { initActions, asyncStorageKeys, persistData, clearData } from "./init";

// actions
const CHANGE_CURRENT_CARD_ID = "voud/card/CHANGE_CURRENT_CARD_ID";

const REQUEST_CARD_LIST = "voud/card/REQUEST_CARD_LIST";
const REQUEST_CARD_LIST_SUCCESS = "voud/card/REQUEST_CARD_LIST_SUCCESS";
const REQUEST_CARD_LIST_FAILURE = "voud/card/REQUEST_CARD_LIST_FAILURE";

const REQUEST_CARD_LIST_REAL_BALANCE =
  "voud/card/REQUEST_CARD_LIST_REAL_BALANCE";
const REQUEST_CARD_LIST_REAL_BALANCE_SUCCESS =
  "voud/card/REQUEST_CARD_LIST_REAL_BALANCE_SUCCESS";
const REQUEST_CARD_LIST_REAL_BALANCE_FAILURE =
  "voud/card/REQUEST_CARD_LIST_REAL_BALANCE_FAILURE";

const ADD_CARD = "voud/card/ADD_CARD";
const ADD_CARD_SUCCESS = "voud/card/ADD_CARD_SUCCESS";
const ADD_CARD_FAILURE = "voud/card/ADD_CARD_FAILURE";
const ADD_CARD_CLEAR = "voud/card/ADD_CARD_CLEAR";

const REMOVE_CARD = "voud/card/REMOVE_CARD";
const REMOVE_CARD_SUCCESS = "voud/card/REMOVE_CARD_SUCCESS";
const REMOVE_CARD_FAILURE = "voud/card/REMOVE_CARD_FAILURE";
const REMOVE_CARD_CLEAR = "voud/card/REMOVE_CARD_CLEAR";

const UPDATE_CARD = "voud/card/UPDATE_CARD";
const UPDATE_CARD_SUCCESS = "voud/card/UPDATE_CARD_SUCCESS";
const UPDATE_CARD_FAILURE = "voud/card/UPDATE_CARD_FAILURE";
const UPDATE_CARD_CLEAR = "voud/card/UPDATE_CARD_CLEAR";

const VIEW_DETAILS = "voud/card/VIEW_DETAILS";

const REQUEST_STATEMENT = "voud/card/REQUEST_STATEMENT";
const REQUEST_STATEMENT_SUCCESS = "voud/card/REQUEST_STATEMENT_SUCCESS";
const REQUEST_STATEMENT_FAILURE = "voud/card/REQUEST_STATEMENT_FAILURE";
const REQUEST_STATEMENT_CLEAR = "voud/card/REQUEST_STATEMENT_CLEAR";

const REQUEST_NEXT_RECHARGES = "voud/card/REQUEST_NEXT_RECHARGES";
const REQUEST_NEXT_RECHARGES_SUCCESS =
  "voud/card/REQUEST_NEXT_RECHARGES_SUCCESS";
const REQUEST_NEXT_RECHARGES_FAILURE =
  "voud/card/REQUEST_NEXT_RECHARGES_FAILURE";

export const cardActions = {
  ADD_CARD_SUCCESS,
  REMOVE_CARD_SUCCESS,
  UPDATE_CARD_SUCCESS,
  REQUEST_CARD_LIST_FAILURE
};

// Card
export const transportCardTypes = {
  BOM_COMUM: "Comum",
  BOM_VT: "VT",
  BOM_VT_EXPRESS: "VT Express",
  BOM_ESCOLAR: "Escolar",
  BOM_ESCOLAR_GRATUIDADE: "Escolar gratuidade",
  BU: "Bilhete Único",
  BILHETE_UNITARIO: "Bilhete Unitário",
  LEGAL: "Cartão Legal"
};

export const actionsAddTransCard = {
  ADD: "ADD",
  TAXI: "TAXI",
  CARRO: "CARRO",
  ADD_BOM: "ADD_BOM",
  ADD_BU: "ADD_BU",
  ADD_BIUN: "ADD_BIUN",
  ADD_LEGAL: "ADD_LEGAL"
};

const issuerTypeCodes = {
  BOM: 31,
  BU: 59,
  LEGAL: 22
};

export const issuerTypes = {
  BOM: "BOM",
  BU: "BU",
  BIUN: "BIUN",
  LEGAL: "LEGAL"
};

export const getIssuerType = code => {
  switch (code) {
    case issuerTypeCodes.BOM:
      return issuerTypes.BOM;

    case issuerTypeCodes.BU:
      return issuerTypes.BU;

    case issuerTypeCodes.LEGAL:
      return issuerTypes.LEGAL;

    default:
      return "";
  }
};

const getTransportCardLayout = ({ type, issuer, wallets }) => {
  if (issuer === issuerTypeCodes.BU) return transportCardTypes.BU;
  if (issuer === issuerTypeCodes.LEGAL) return transportCardTypes.LEGAL;

  switch (type) {
    case 4:
    case 17: {
      wallets = wallets || [];
      const expressWallet = wallets.find(
        wallet => wallet.applicationId === walletApplicationId.BOM_VT_EXPRESS
      );
      return expressWallet && expressWallet.balance
        ? transportCardTypes.BOM_VT_EXPRESS
        : transportCardTypes.BOM_VT;
    }
    case 3:
    case 6:
    case 7:
    case 19: {
      wallets = wallets || [];
      const escolarWallet = wallets.find(
        wallet => wallet.applicationId === walletApplicationId.BOM_ESCOLAR
      );
      return escolarWallet && Moment(escolarWallet.expiryDate).isAfter()
        ? transportCardTypes.BOM_ESCOLAR
        : transportCardTypes.BOM_ESCOLAR_GRATUIDADE;
    }
    case 8:
    case 20:
    default:
      return transportCardTypes.BOM_COMUM;
  }
};

export const isSupportedTransportCard = type => {
  switch (type) {
    case "04":
    case "17":
    case "03":
    case "06":
    case "07":
    case "19":
    case "08":
    case "20":
    case "22":
      return true;
    default:
      return false;
  }
};

// Status

export const transportCardWalletStatus = {
  ACTIVE: "A",
  NOT_REVALIDATED: "NR",
  EXPIRED: "EX"
};

// Wallet

const sortByNickCaseInsensitive = sortBy(
  compose(
    toLower,
    prop("nick")
  )
);

const formatTransportCard = card => ({
  ...card,
  layoutType: getTransportCardLayout(card)
});

const formatList = compose(
  sortByNickCaseInsensitive,
  map(formatTransportCard)
);

export const walletApplicationId = {
  BOM_COMUM: 500,
  BOM_VT: 400,
  BOM_VT_EXPRESS: 405,
  BOM_ESCOLAR: 900,
  BOM_ESCOLAR_GRATUIDADE: 910,
  LEGAL: 0
};

export const walletApplicationIdToShortname = type => {
  type = Number(type);
  switch (type) {
    case walletApplicationId.BOM_COMUM:
      return transportCardTypes.BOM_COMUM;
    case walletApplicationId.BOM_VT:
      return transportCardTypes.BOM_VT;
    case walletApplicationId.BOM_VT_EXPRESS:
      return transportCardTypes.BOM_VT_EXPRESS;
    case walletApplicationId.BOM_ESCOLAR:
      return transportCardTypes.BOM_ESCOLAR;
    case walletApplicationId.BOM_ESCOLAR_GRATUIDADE:
      return transportCardTypes.BOM_ESCOLAR_GRATUIDADE;
    case walletApplicationId.LEGAL:
      return transportCardTypes.LEGAL;
    default:
  }
};

// Transaction
export const transactionTypes = {
  RECARGA: "C",
  USO: "D",
  GRATUIDADE: "G"
};

export const transactionTypeToDescription = type => {
  switch (type) {
    case transactionTypes.RECARGA:
      return "Recarga";
    case transactionTypes.USO:
      return "Passagem";
    case transactionTypes.GRATUIDADE:
      return "Passagem gratuita";
    default:
      return "";
  }
};

export const transactionTypeToIcon = type => {
  // return type === transactionTypes.RECARGA ? 'credit' : 'bus';
  return type === transactionTypes.RECARGA ? "recarga" : "recarga-2";
};

// reducer
const initialState = {
  list: [],
  listDetails: [],
  add: {
    isFetching: false,
    error: ""
  },
  remove: {
    isFetching: false,
    error: ""
  },
  update: {
    isFetching: false,
    error: ""
  },
  cardList: {
    isFetching: false,
    error: ""
  },
  currentDetailId: null,
  statement: {
    isFetching: false,
    error: "",
    data: []
  },
  nextRecharges: []
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case initActions.HYDRATE:
      return {
        ...state,
        list: action.data.transportCardList,
        currentDetailId: action.data.currentTransportCardId
      };

    case REQUEST_CARD_LIST:
      return {
        ...state,
        cardList: {
          isFetching: true,
          error: ""
        },
        nextRecharges: []
      };
    case REQUEST_CARD_LIST_SUCCESS: {
      const formattedList = formatList(action.response.payload);
      const transportCardsList = formattedList || [];

      return {
        ...state,
        list: transportCardsList,
        currentDetailId: state.currentDetailId
          ? state.currentDetailId
          : transportCardsList.length > 0
          ? transportCardsList[0].uuid
            ? transportCardsList[0].uuid
            : transportCardsList[0].id
          : null,
        cardList: {
          isFetching: false,
          error: ""
        }
      };
    }
    case REQUEST_CARD_LIST_FAILURE:
      return {
        ...state,
        cardList: {
          isFetching: false,
          error: ""
        }
      };

    case REQUEST_CARD_LIST_REAL_BALANCE:
      return {
        ...state,
        cardList: {
          isFetching: true,
          error: ""
        },
        nextRecharges: []
      };
    case REQUEST_CARD_LIST_REAL_BALANCE_SUCCESS: {
      const formattedList = formatList(action.response.payload);
      const transportCardsList = formattedList || [];

      return {
        ...state,
        currentDetailId: state.currentDetailId
          ? state.currentDetailId
          : transportCardsList.length > 0
          ? transportCardsList[0].uuid
          : null,
        cardList: {
          isFetching: false,
          error: ""
        },
        listDetails: formattedList
      };
    }
    case REQUEST_CARD_LIST_REAL_BALANCE_FAILURE:
      return {
        ...state,
        cardList: {
          isFetching: false
        }
      };

    case ADD_CARD:
      return {
        ...state,
        add: {
          isFetching: true,
          error: ""
        }
      };
    case ADD_CARD_SUCCESS: {
      const formattedList = sortByNickCaseInsensitive([
        ...state.list,
        formatTransportCard(action.response.payload)
      ]);
      const transportCardsList = formattedList || [];
      return {
        ...state,
        list: transportCardsList,
        currentDetailId: action.response.payload.uuid,
        add: {
          isFetching: false,
          error: ""
        }
      };
    }
    case ADD_CARD_FAILURE:
      return {
        ...state,
        add: {
          isFetching: false,
          error: action.error
        }
      };
    case ADD_CARD_CLEAR:
      return {
        ...state,
        add: {
          isFetching: false,
          error: ""
        }
      };
    case REMOVE_CARD:
      return {
        ...state,
        remove: {
          isFetching: true,
          error: ""
        }
      };
    case REMOVE_CARD_SUCCESS: {
      const newCardList = state.list.filter(
        card => card.uuid !== action.response.payload.uuid
      );
      let currentDetailId = state.currentDetailId;
      if (action.response.payload.uuid === currentDetailId) {
        if (newCardList.length > 0) {
          const cardPosition = state.list
            .map(el => el.uuid)
            .indexOf(action.response.payload.uuid);
          const nextCardPosition = (cardPosition + 1) % state.list.length;
          currentDetailId =
            cardPosition === -1 ? null : state.list[nextCardPosition].uuid;
        } else {
          currentDetailId = null;
        }
      }

      return {
        ...state,
        list: newCardList,
        currentDetailId,
        remove: {
          isFetching: false,
          error: ""
        }
      };
    }
    case REMOVE_CARD_FAILURE:
      return {
        ...state,
        remove: {
          isFetching: false,
          error: action.error
        }
      };
    case REMOVE_CARD_CLEAR:
      return {
        ...state,
        remove: {
          isFetching: false,
          error: ""
        }
      };
    case UPDATE_CARD:
      return {
        ...state,
        update: {
          isFetching: true,
          error: ""
        }
      };
    case UPDATE_CARD_SUCCESS:
      return {
        ...state,
        list: state.list.map(card =>
          card.uuid === action.response.payload.uuid
            ? {
                ...card,
                nick: action.response.payload.nick
              }
            : card
        ),
        update: {
          isFetching: false,
          error: ""
        }
      };
    case UPDATE_CARD_FAILURE:
      return {
        ...state,
        update: {
          isFetching: false,
          error: action.error
        }
      };
    case UPDATE_CARD_CLEAR:
      return {
        ...state,
        update: {
          isFetching: false,
          error: ""
        }
      };
    case CHANGE_CURRENT_CARD_ID:
    case VIEW_DETAILS:
      return {
        ...state,
        currentDetailId: action.cardId
      };
    case REQUEST_STATEMENT:
      return {
        ...state,
        statement: {
          ...state.statement,
          isFetching: true,
          error: ""
        }
      };
    case REQUEST_STATEMENT_SUCCESS:
      // Note - Using 'cardId' instead of 'currentDetailId' because user can leave the screen
      // while there is a request for statement
      return {
        ...state,
        statement: {
          isFetching: false,
          error: "",
          data: state.statement.data.find(item => item.cardId === action.cardId)
            ? state.statement.data.map(item =>
                item.cardId === action.cardId
                  ? {
                      ...item,
                      statementList: action.response.payload.transactions
                        ? action.response.payload.transactions
                        : []
                    }
                  : item
              )
            : [
                ...state.statement.data,
                {
                  cardId: action.cardId,
                  statementList: action.response.payload.transactions
                    ? action.response.payload.transactions
                    : []
                }
              ]
        }
      };
    case REQUEST_STATEMENT_CLEAR:
      return {
        ...state,
        statement: {
          isFetching: false,
          error: "",
          data: []
        }
      };
    case REQUEST_STATEMENT_FAILURE:
      return {
        ...state,
        statement: {
          ...state.statement,
          isFetching:
            action.cardId === state.currentDetailId
              ? false
              : state.statement.isFetching,
          error:
            action.cardId === state.currentDetailId
              ? action.error
              : state.statement.error
        }
      };
    case REQUEST_NEXT_RECHARGES:
      return {
        ...state,
        nextRecharges: state.nextRecharges.find(
          item => item.cardId === action.cardId
        )
          ? state.nextRecharges.map(item =>
              item.cardId === action.cardId
                ? {
                    ...item,
                    isFetching: true,
                    error: ""
                  }
                : item
            )
          : [
              ...state.nextRecharges,
              {
                cardId: action.cardId,
                isFetching: true,
                error: "",
                list: []
              }
            ]
      };
    case REQUEST_NEXT_RECHARGES_SUCCESS:
      return {
        ...state,
        nextRecharges: state.nextRecharges.find(
          item => item.cardId === action.cardId
        )
          ? state.nextRecharges.map(item =>
              item.cardId === action.cardId
                ? {
                    ...item,
                    isFetching: false,
                    error: "",
                    list: action.response.payload ? action.response.payload : []
                  }
                : item
            )
          : [
              ...state.nextRecharges,
              {
                cardId: action.cardId,
                isFetching: false,
                error: "",
                list: action.response.payload ? action.response.payload : []
              }
            ]
      };
    case REQUEST_NEXT_RECHARGES_FAILURE:
      return {
        ...state,
        nextRecharges: state.nextRecharges.find(
          item => item.cardId === action.cardId
        )
          ? state.nextRecharges.map(item =>
              item.cardId === action.cardId
                ? {
                    ...item,
                    isFetching: false,
                    error: action.error,
                    list: []
                  }
                : item
            )
          : [
              ...state.nextRecharges,
              {
                cardId: action.cardId,
                isFetching: false,
                error: action.error,
                list: []
              }
            ]
      };

    case loginActions.LOGOUT:
      return {
        ...state,
        list: [],
        currentDetailId: null
      };

    default:
      return state;
  }
}

export default reducer;

// actions creators

export function viewDetails(cardId) {
  persistCurrentCardId(cardId);

  return {
    type: VIEW_DETAILS,
    cardId
  };
}

export function changeCurrentCardId(cardId) {
  persistCurrentCardId(cardId);

  return {
    type: CHANGE_CURRENT_CARD_ID,
    cardId
  };
}

// Card List
function requestCardList() {
  return { type: REQUEST_CARD_LIST };
}
function requestCardListSuccess(response) {
  return {
    type: REQUEST_CARD_LIST_SUCCESS,
    response
  };
}
function requestCardListFailure(error) {
  return {
    type: REQUEST_CARD_LIST_FAILURE,
    error
  };
}

// Card List Real Balance
function requestCardListRealBalance() {
  return { type: REQUEST_CARD_LIST_REAL_BALANCE };
}
function requestCardListRealBalanceSuccess(response) {
  return {
    type: REQUEST_CARD_LIST_REAL_BALANCE_SUCCESS,
    response
  };
}
function requestCardListRealBalanceFailure(error) {
  return {
    type: REQUEST_CARD_LIST_REAL_BALANCE_FAILURE,
    error
  };
}

// Add card
function addCard() {
  return { type: ADD_CARD };
}
function addCardSuccess(response) {
  return {
    type: ADD_CARD_SUCCESS,
    response
  };
}
function addCardFailure(error) {
  return {
    type: ADD_CARD_FAILURE,
    error
  };
}
export function addCardClear() {
  return { type: ADD_CARD_CLEAR };
}

// Remove card
function removeCard() {
  return { type: REMOVE_CARD };
}
function removeCardSuccess(response) {
  return {
    type: REMOVE_CARD_SUCCESS,
    response
  };
}
function removeCardFailure(error) {
  return {
    type: REMOVE_CARD_FAILURE,
    error
  };
}
export function removeCardClear() {
  return { type: REMOVE_CARD_CLEAR };
}

// Update card
function updateCard() {
  return { type: UPDATE_CARD };
}
function updateCardSuccess(response) {
  return {
    type: UPDATE_CARD_SUCCESS,
    response
  };
}
function updateCardFailure(error) {
  return {
    type: UPDATE_CARD_FAILURE,
    error
  };
}
export function updateCardClear() {
  return { type: UPDATE_CARD_CLEAR };
}

// Statement
function requestCardStatement() {
  return { type: REQUEST_STATEMENT };
}
function requestCardStatementSuccess(cardId, response) {
  return {
    type: REQUEST_STATEMENT_SUCCESS,
    cardId,
    response
  };
}

function requestCardStatementClear() {
  return { type: REQUEST_STATEMENT_CLEAR };
}
function requestCardStatementFailure(cardId, error) {
  return {
    type: REQUEST_STATEMENT_FAILURE,
    cardId,
    error
  };
}

// Next Recharges
function requestNextRecharges(cardId) {
  return {
    type: REQUEST_NEXT_RECHARGES,
    cardId
  };
}
function requestNextRechargesSuccess(cardId, response) {
  return {
    type: REQUEST_NEXT_RECHARGES_SUCCESS,
    cardId,
    response
  };
}
function requestNextRechargesFailure(cardId, error) {
  return {
    type: REQUEST_NEXT_RECHARGES_FAILURE,
    cardId,
    error
  };
}

// thunk action creators

export function fetchCardList() {
  return async (dispatch, getState) => {
    // dispatch request action
    dispatch(requestCardList());

    try {
      const response = await voudRequest(
        "/customer/card/find-v2",
        "POST",
        {},
        true
      );

      if (!response.payload) response.payload = [];

      dispatch(requestCardListSuccess(response));
      persistTransportCard(getState());

      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(
          dispatch,
          error,
          requestCardListFailure(error.message)
        )
      ) {
        throw error;
      }
    }
  };
}

export function fetchCardListRealBalance(cardId) {
  return async (dispatch, getState) => {
    dispatch(requestCardListRealBalance());

    try {
      const response = await voudRequest(
        "/customer/card/update",
        "POST",
        { uuid: cardId },
        true
      );

      if (!response.payload) response.payload = [];

      dispatch(requestCardListRealBalanceSuccess(response));
      persistTransportCard(getState());

      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(
          dispatch,
          error,
          requestCardListRealBalanceFailure(error.message)
        )
      ) {
        throw error;
      }
    }
  };
}

export function fetchAddCard(cardNumber, nick, issuerType) {
  return function(dispatch, getState) {
    // dispatch request action
    dispatch(addCard());

    const requestBody = {
      cardNumber,
      nick,
      issuerType
    };

    (async () => {
      try {
        const response = await voudRequest(
          "/customer/card/add",
          "POST",
          requestBody,
          true
        );
        dispatch(addCardSuccess(response));
        persistTransportCard(getState());
      } catch (error) {
        if (__DEV__) console.tron.log(error.message, true);
        if (
          !requestErrorHandler(dispatch, error, addCardFailure(error.message))
        ) {
          throw error;
        }
      }
    })();
  };
}

export function fetchRemoveCard(uuid) {
  return async (dispatch, getState) => {
    // dispatch request action
    dispatch(removeCard());

    try {
      const requestBody = {
        uuid
      };
      const response = await voudRequest(
        "/customer/card/remove",
        "POST",
        requestBody,
        true
      );
      dispatch(removeCardSuccess(response));
      persistTransportCard(getState());
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (
        !requestErrorHandler(dispatch, error, removeCardFailure(error.message))
      ) {
        throw error;
      }
    }
  };
}

export function fetchUpdateCard(uuid, nick) {
  return function(dispatch, getState) {
    // dispatch request action
    dispatch(updateCard());

    const requestBody = {
      uuid,
      nick
    };

    (async () => {
      try {
        const response = await voudRequest(
          "/customer/card/update/nick",
          "POST",
          requestBody,
          true
        );

        dispatch(updateCardSuccess(response));
        persistTransportCard(getState());
      } catch (error) {
        if (__DEV__) console.tron.log(error.message, true);
        if (
          !requestErrorHandler(
            dispatch,
            error,
            updateCardFailure(error.message)
          )
        ) {
          throw error;
        }
      }
    })();
  };
}

export function fetchCardStatement(cardId) {
  return function(dispatch) {
    // dispatch request action
    dispatch(requestCardStatement());

    const requestBody = {
      transportCard: {
        uuid: cardId
      }
    };

    (async () => {
      try {
        const response = await voudRequest(
          "/customer/card/statement",
          "POST",
          requestBody,
          true
        );
        dispatch(requestCardStatementSuccess(cardId, response));
      } catch (error) {
        if (__DEV__) console.tron.log(error.message, true);
        if (
          !requestErrorHandler(
            dispatch,
            error,
            requestCardStatementFailure(cardId, error.message)
          )
        ) {
          throw error;
        }
      }
    })();
  };
}

export function fetchClearCardStatement() {
  return function(dispatch) {
    dispatch(requestCardStatementClear());
  };
}

export function fetchNextRecharges(cardId) {
  return function(dispatch) {
    // dispatch request action
    dispatch(requestNextRecharges(cardId));

    const requestBody = {
      transportCard: {
        uuid: cardId
      }
    };

    (async () => {
      try {
        const response = await voudRequest(
          "/customer/card/pending-recharge",
          "POST",
          requestBody,
          true
        );
        dispatch(requestNextRechargesSuccess(cardId, response));
      } catch (error) {
        if (__DEV__) console.tron.log(error.message, true);
        if (
          !requestErrorHandler(
            dispatch,
            error,
            requestNextRechargesFailure(cardId, error.message)
          )
        ) {
          throw error;
        }
      }
    })();
  };
}

// Utility functions

function persistTransportCard(state) {
  persistData(asyncStorageKeys.transportCardList, state.transportCard.list);
  persistCurrentCardId(state.transportCard.currentDetailId);
}

function persistCurrentCardId(uuid) {
  persistData(asyncStorageKeys.currentTransportCardId, uuid);
}

export function clearCardDataStorage() {
  clearData(asyncStorageKeys.transportCardList);
  clearData(asyncStorageKeys.currentTransportCardId);
}
