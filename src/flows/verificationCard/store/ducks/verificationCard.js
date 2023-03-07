import { requestErrorHandler } from '../../../../shared/request-error-handler';
import { voudRequest } from '../../../../shared/services';
import { TYPES } from '../../../search-points-of-interest/components/SwitchTypeSearch';

// Actitons Types
const Types = {
	VERIFY_CARD: 'VERIFY_CARD',
	VERIFY_CARD_SUCCESS: 'VERIFY_CARD_SUCCESS',
	VERIFY_CARD_FAIL: 'VERIFY_CARD_FAIL',

	VERIFY_CARD_CONFIRM: 'VERIFY_CARD_CONFIRM',
	VERIFY_CARD_CONFIRM_SUCCESS: 'VERIFY_CARD_CONFIRM_SUCCESS',
	VERIFY_CARD_CONFIRM_FAIL: 'VERIFY_CARD_CONFIRM_FAIL',
	VERIFY_CARD_CONFIRM_CLEAR: 'VERIFY_CARD_CONFIRM_CLEAR',

	CHANGE_VERIFICATION_VALUE: 'CHANGE_VERIFICATION_VALUE',
	PAYMENT_METHOD_TO_VERIFY: 'PAYMENT_METHOD_TO_VERIFY'
};

// Reducer
const initialState = {
	error: '',
	isFetching: false,
	verificationValue: 0,
	isCardConfirmed: false,
	showCardConfirmation: false,
	verifyCard: null,
	verifyCardConfirm: null,
};

function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.VERIFY_CARD:
			return {
				...state,
				verifyCard: {
					...state.verifyCard,
					isFetching: true,
					error: ''
				}
			};
		case Types.VERIFY_CARD_SUCCESS:
			return {
				...state,
				verifyCard: {
					...state.verifyCard,
					data: action.payload,
					isFetching: false,

				}
			};
		case Types.VERIFY_CARD_FAIL:
			return {
				...state,
				verifyCard: {
					...state.verifyCard,
					isFetching: false,
					error: action.payload,

				}
			};

		case Types.VERIFY_CARD_CONFIRM:
			return {
				...state,
				verifyCardConfirm: {
					...state.verifyCardConfirm,
					isFetching: true,
					error: null
				}
			};
		case Types.VERIFY_CARD_CONFIRM_SUCCESS:
			return {
				...state,
				verifyCardConfirm: {
					...state.verifyCardConfirm,
					data: action.payload,
					isFetching: false
				}
			};
		case Types.VERIFY_CARD_CONFIRM_FAIL:
			return {
				...state,
				verifyCardConfirm: {
					...state.verifyCardConfirm,
					isFetching: false,
					error: action.payload,
				}
			};

		case Types.VERIFY_CARD_CONFIRM_CLEAR:
			return {
				...state,
				verifyCardConfirm: null
			};

		case Types.IS_CARD_CONFIRMED:
			return {
				...state,
				isCardConfirmed: action.payload
			};

		case Types.CHANGE_VERIFICATION_VALUE:
			return {
				...state,
				verificationValue: action.payload
			};

		case Types.PAYMENT_METHOD_TO_VERIFY:
			return {
				...state,
				paymentMethodToVerify: action.payload
			};

		default:
			return state;
	}
}

export default reducer;

// Action creators

export const verifyPaymentCardConfirmClear = () => {
	return {
		type: Types.VERIFY_CARD_CONFIRM_CLEAR
	};
};

export const changeVerificationValue = (value) => {
	return {
		type: Types.CHANGE_VERIFICATION_VALUE,
		payload: value
	};
};

export const isCardConfirmedAction = (isConfirmed) => {
	return {
		type: Types.IS_CARD_CONFIRMED,
		payload: isConfirmed
	};
};

export const selectPaymentMethodToVerify = (paymentMethod) => {
	return {
		type: Types.PAYMENT_METHOD_TO_VERIFY,
		payload: paymentMethod
	};
};

const verifyPaymentCard = (payload) => {
	return {
		type: Types.VERIFY_CARD,
		payload
	};
};

const verifyPaymentCardSuccess = (payload) => {
	return {
		type: Types.VERIFY_CARD_SUCCESS,
		payload
	};
};

const verifyPaymentCardFail = (payload) => {
	return {
		type: Types.VERIFY_CARD_FAIL,
		payload
	};
};

const verifyPaymentCardConfirm = (payload) => {
	return {
		type: Types.VERIFY_CARD_CONFIRM,
		payload
	};
};

const verifyPaymentCardConfirmSuccess = (payload) => {
	return {
		type: Types.VERIFY_CARD_CONFIRM_SUCCESS,
		payload
	};
};

const verifyPaymentCardConfirmFail = (payload) => {
	return {
		type: Types.VERIFY_CARD_CONFIRM_FAIL,
		payload
	};
};

// Thunk action creators
export const verifyPaymentCardAction = (cardIdPayment, isCancelling = false) => {
	return async (dispatch) => {
		dispatch(verifyPaymentCard());
		const requestBody = { id: cardIdPayment, isCancelling };
		try {
			const response = await voudRequest('/financial/verification-card', 'POST', requestBody, true);
			dispatch(verifyPaymentCardSuccess(response));

			return response;
		} catch (error) {
			if (__DEV__) console.tron.log(error.message, true);
			if (!requestErrorHandler(dispatch, error, verifyPaymentCardFail(error.message))) {
				throw error;
			}
		}
	};
};

export const verifyPaymentCardConfirmAction = (cardIdPayment, confirmationValue) => {
	return async (dispatch) => {
		dispatch(verifyPaymentCardConfirm());
		const requestBody = {
			id: cardIdPayment,
			valueToConfirm: confirmationValue
		};
		try {
			const response = await voudRequest('/financial/confirmation-card', 'POST', requestBody, true);

			dispatch(verifyPaymentCardConfirmSuccess(response));

			return response;
		} catch (error) {
			if (__DEV__) console.tron.log(error.message, true);
			if (!requestErrorHandler(dispatch, error, verifyPaymentCardConfirmFail(error.additionalData))) {
				throw error;
			}
		}
	};
};
