// VouD imports
import { voudRequest } from '../shared/services';
import { requestErrorHandler } from '../shared/request-error-handler';
import { GAEventParams, GATrackEvent } from '../shared/analytics';
import { formatCieloExpirationDate, extractLastFourDigits } from '../utils/parsers-formaters';
import { sha256 } from 'js-sha256';
import { formatPaymentMethodName } from '../utils/payment-card';
import { getEncryptionConfig } from './selectors';
import { buildEncryptedCardData } from '../utils/crypto-util';

// Actions

const REQUEST_SAVED_METHODS = 'voud/payment-method/REQUEST_SAVED_METHODS';
const REQUEST_SAVED_METHODS_SUCCESS = 'voud/payment-method/REQUEST_SAVED_METHODS_SUCCESS';
const REQUEST_SAVED_METHODS_FAILURE = 'voud/payment-method/REQUEST_SAVED_METHODS_FAILURE';
const REQUEST_SAVED_METHODS_CLEAR = 'voud/payment-method/REQUEST_SAVED_METHODS_CLEAR';

export const SAVE = 'voud/payment-method/SAVE';
export const SAVE_SUCCESS = 'voud/payment-method/SAVE_SUCCESS';
export const SAVE_FAILURE = 'voud/payment-method/SAVE_FAILURE';
export const SAVE_CLEAR = 'voud/payment-method/SAVE_CLEAR';

const REMOVE = 'voud/payment-method/REMOVE';
const REMOVE_SUCCESS = 'voud/payment-method/REMOVE_SUCCESS';
const REMOVE_FAILURE = 'voud/payment-method/REMOVE_FAILURE';
const REMOVE_CLEAR = 'voud/payment-method/REMOVE_CLEAR';

const SELECT = 'voud/payment-method/SELECT';
const SELECT_FIRST = 'voud/payment-method/SELECT_FIRST';
const UNSELECT = 'voud/payment-method/UNSELECT';

const GET_ACTIVE_DISCOUNTS = 'voud/payment-method/GET_ACTIVE_DISCOUNTS';
const GET_ACTIVE_DISCOUNTS_SUCCESS = 'voud/payment-method/GET_ACTIVE_DISCOUNTS_SUCCESS';
const GET_ACTIVE_DISCOUNTS_FAILURE = 'voud/payment-method/GET_ACTIVE_DISCOUNTS_FAILURE';

const SELECT_TEMPORARY_CARD = 'voud/payment-method/SELECT_TEMPORARY_CARD';
const CLEAR_TEMPORARY_CARD = 'voud/payment-method/CLEAR_TEMPORARY_CARD';

export const exemptionTypes = {
	QUANTITY: 'QUANTITY',
	TIME: 'TIME'
};

// Reducer
export const initialState = {
	saved: {
		data: [],
		selected: null,
		isFetching: false,
		error: ''
	},
	selectedTemporaryCard: null,
	save: {
		isFetching: false,
		error: ''
	},
	remove: {
		id: null,
		isFetching: false,
		error: ''
	},
	activeDiscounts: {
		isFetching: false,
		error: '',
		data: []
	}
};

function reducer(state = initialState, action) {
	switch (action.type) {
		//request saved payment methods

		case REQUEST_SAVED_METHODS:
			return {
				...state,
				saved: {
					...state.saved,
					isFetching: true,
					error: ''
				}
			};

		case REQUEST_SAVED_METHODS_SUCCESS:
			return {
				...state,
				saved: {
					...state.saved,
					data: action.response.payload
						? action.response.payload.map((el) => ({
								...el,
								items: el.items.reduce(
									(acc, cur) => ({
										...acc,
										[cur.key]: cur.value
									}),
									{}
								)
							}))
						: [],
					isFetching: false,
					error: ''
				}
			};

		case REQUEST_SAVED_METHODS_FAILURE:
			return {
				...state,
				saved: {
					...state.saved,
					isFetching: false,
					error: action.error
				}
			};

		case REQUEST_SAVED_METHODS_CLEAR:
			return {
				...state,
				saved: {
					...state.saved,
					isFetching: false,
					error: ''
				}
			};

		// save payment method

		case SAVE:
			return {
				...state,
				save: {
					...state.save,
					isFetching: true,
					error: ''
				}
			};

		case SAVE_SUCCESS:
			return {
				...state,
				save: {
					...state.save,
					isFetching: false,
					error: ''
				},
				saved: {
					...state.saved,
					selected: action.response.payload.id,
					data: [
						...state.saved.data,
						{
							...action.response.payload,
							items: action.response.payload.items.reduce(
								(acc, cur) => ({
									...acc,
									[cur.key]: cur.value
								}),
								{}
							)
						}
					]
				},
				selectedTemporaryCard: null
			};

		case SAVE_FAILURE:
			return {
				...state,
				save: {
					...state.save,
					isFetching: false,
					error: action.error
				}
			};

		case SAVE_CLEAR:
			return {
				...state,
				save: {
					...state.save,
					isFetching: false,
					error: ''
				}
			};

		// remove payment method

		case REMOVE:
			return {
				...state,
				remove: {
					...state.remove,
					id: action.id,
					isFetching: true,
					error: ''
				}
			};

		case REMOVE_SUCCESS:
			return {
				...state,
				saved: {
					...state.saved,
					data: state.saved.data.filter((method) => method.id !== action.response.payload.id),
					selected: state.saved.selected === action.response.payload.id ? null : state.saved.selected
				},
				remove: {
					...state.remove,
					id: null,
					isFetching: false,
					error: ''
				}
			};

		case REMOVE_FAILURE:
			return {
				...state,
				remove: {
					...state.remove,
					id: null,
					isFetching: false,
					error: action.error
				}
			};

		case REMOVE_CLEAR:
			return {
				...state,
				remove: {
					...state.remove,
					id: null,
					isFetching: false,
					error: ''
				}
			};

		// select

		case SELECT:
			return {
				...state,
				saved: {
					...state.saved,
					selected: action.id
				},
				selectedTemporaryCard: null
			};

		case SELECT_FIRST:
			return {
				...state,
				saved: {
					...state.saved,
					selected: state.saved.data && state.saved.data.length > 0 ? state.saved.data[0].id : null
				},
				selectedTemporaryCard: null
			};

		case UNSELECT:
			return {
				...state,
				saved: {
					...state.saved,
					selected: null
				},
				selectedTemporaryCard: null
			};

		// get active discounts

		case GET_ACTIVE_DISCOUNTS:
			return {
				...state,
				activeDiscounts: {
					...state.activeDiscounts,
					isFetching: true,
					error: ''
				}
			};

		case GET_ACTIVE_DISCOUNTS_SUCCESS:
			return {
				...state,
				activeDiscounts: {
					...state.activeDiscounts,
					isFetching: false,
					data: action.response.payload ? action.response.payload.filter((el) => el.active) : []
				}
			};

		case GET_ACTIVE_DISCOUNTS_FAILURE:
			return {
				...state,
				activeDiscounts: {
					...state.activeDiscounts,
					isFetching: false,
					error: action.error
				}
			};

		// Temporary Card

		case SELECT_TEMPORARY_CARD:
			return {
				...state,
				saved: {
					...state.saved,
					selected: null
				},
				selectedTemporaryCard: {
					id: sha256(
						`${action.paymentMethodInfo.creditCardNumber}${action.paymentMethodInfo
							.creditCardExpirationDate}`
					),
					name: action.paymentMethodInfo.name,
					isTemporaryCard: true,
					saveCreditCard: action.paymentMethodInfo.saveCreditCard,
					items: {
						cardNumber: action.paymentMethodInfo.creditCardNumber,
						finalDigits: extractLastFourDigits(action.paymentMethodInfo.creditCardNumber),
						cardFlag: action.paymentMethodInfo.creditCardBrand,
						expirationDate: action.paymentMethodInfo.creditCardExpirationDate,
						securityCode: action.paymentMethodInfo.creditCardSecurityCode,
						cardHolder: action.paymentMethodInfo.creditCardHolder
					}
				}
			};

		case CLEAR_TEMPORARY_CARD:
			return {
				...state,
				selectedTemporaryCard: null
			};

		// default

		default:
			return state;
	}
}

export default reducer;

// Actions creators

// Request saved payment methods

function requestSavedMethods() {
	return { type: REQUEST_SAVED_METHODS };
}

function requestSavedMethodsSuccess(response) {
	return {
		type: REQUEST_SAVED_METHODS_SUCCESS,
		response
	};
}

function requestSavedMethodsFailure(error) {
	return {
		type: REQUEST_SAVED_METHODS_FAILURE,
		error
	};
}

export function requestSavedPaymentMethodsClear() {
	return { type: REQUEST_SAVED_METHODS_CLEAR };
}

// Save payment method

export function save() {
	return { type: SAVE };
}

export function saveSuccess(response) {
	return {
		type: SAVE_SUCCESS,
		response
	};
}

export function saveFailure(error) {
	return {
		type: SAVE_FAILURE,
		error
	};
}

export function savePaymentMethodClear() {
	return { type: SAVE_CLEAR };
}

// Remove payment method

function remove(id) {
	return {
		type: REMOVE,
		id
	};
}

function removeSuccess(response) {
	return {
		type: REMOVE_SUCCESS,
		response
	};
}

function removeFailure(error) {
	return {
		type: REMOVE_FAILURE,
		error
	};
}

export function removePaymentMethodClear() {
	return { type: REMOVE_CLEAR };
}

// select payment method
export function selectFirstPaymentMethod() {
	return {
		type: SELECT_FIRST
	};
}

export function selectPaymentMethod(id) {
	return {
		type: SELECT,
		id
	};
}

export function unselectPaymentMethod() {
	return { type: UNSELECT };
}

// get active disciounts

function _getActiveDiscounts() {
	return { type: GET_ACTIVE_DISCOUNTS };
}

function _getActiveDiscountsSuccess(response) {
	return {
		type: GET_ACTIVE_DISCOUNTS_SUCCESS,
		response
	};
}

function _getActiveDiscountsFailure(error) {
	return {
		type: GET_ACTIVE_DISCOUNTS_FAILURE,
		error
	};
}

// Temporary Card

export function selectTemporaryCard(paymentMethodInfo) {
	return {
		type: SELECT_TEMPORARY_CARD,
		paymentMethodInfo
	};
}

export function clearSelectedTemporaryCard() {
	return {
		type: CLEAR_TEMPORARY_CARD
	};
}

// Thunk action creators

export function fetchSavedPaymentMethods() {
	return async (dispatch) => {
		// dispatch request action
		dispatch(requestSavedMethods());

		try {
			const response = await voudRequest('/customer/payment-method/find', 'POST', {}, true);

			dispatch(requestSavedMethodsSuccess(response));
			return response;
		} catch (error) {
			if (__DEV__) console.tron.log(error.message, true);
			if (!requestErrorHandler(dispatch, error, requestSavedMethodsFailure(error.message))) {
				throw error;
			}
		}
	};
}

export function fetchSavePaymentMethod(paymentMethodInfo) {
	return async (dispatch, getState) => {
		// dispatch request action
		dispatch(save());

		try {
			const { adyenPK, cieloPK } = getEncryptionConfig(getState());
			const {
				creditCardBrand,
				creditCardNumber,
				creditCardHolder,
				creditCardExpirationDate,
				creditCardSecurityCode
			} = paymentMethodInfo;
			const financialCardObj = {
				alias: formatPaymentMethodName(creditCardBrand, creditCardNumber),
				cardNumber: creditCardNumber,
				holder: creditCardHolder,
				expirationDate: formatCieloExpirationDate(creditCardExpirationDate),
				securityCode: creditCardSecurityCode,
				saveCard: true,
				brand: creditCardBrand
			};
			const requestBody = await buildEncryptedCardData(financialCardObj, cieloPK, adyenPK);
			const voudSavePaymentResponse = await voudRequest('/financial/card/validate', 'POST', requestBody, true);

			const { categories: { FORM }, actions: { SUBMIT }, labels: { SUBMIT_SAVE_PAYMENT_METHOD } } = GAEventParams;
			GATrackEvent(FORM, SUBMIT, SUBMIT_SAVE_PAYMENT_METHOD);
			dispatch(saveSuccess(voudSavePaymentResponse));

			return voudSavePaymentResponse;
		} catch (error) {
			if (__DEV__) console.tron.log(error.message, true);
			if (!requestErrorHandler(dispatch, error, saveFailure(error.message))) {
				throw error;
			}
		}
	};
}

export function fetchRemovePaymentMethod(id) {
	return async (dispatch) => {
		// dispatch request action
		dispatch(remove(id));

		try {
			const response = await voudRequest('/customer/payment-method/delete', 'POST', { id }, true);
			dispatch(removeSuccess(response));
			return response;
		} catch (error) {
			if (__DEV__) console.tron.log(error.message, true);
			if (!requestErrorHandler(dispatch, error, removeFailure(error.message))) {
				throw error;
			}
		}
	};
}

export function fetchActiveDiscounts() {
	return async (dispatch) => {
		dispatch(_getActiveDiscounts());

		try {
			const response = await voudRequest('/financial/exemptions', 'GET', '', true);

			dispatch(_getActiveDiscountsSuccess(response));

			return response;
		} catch (error) {
			if (__DEV__) console.tron.log(error.message, true);
			if (!requestErrorHandler(dispatch, error, _getActiveDiscountsFailure(error.message))) {
				throw error;
			}
		}
	};
}
