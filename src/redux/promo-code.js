import { voudRequest } from '../shared/services';
import { requestErrorHandler } from '../shared/request-error-handler';

// Actions
const FETCH_VALIDATE_PROMOCODE = 'voud/promo-code/FETCH_VALIDATE_PROMOCODE';
const FETCH_VALIDATE_PROMOCODE_SUCCESS = 'voud/promo-code/FETCH_VALIDATE_PROMOCODE_SUCCESS';
const FETCH_VALIDATE_PROMOCODE_FAILURE = 'voud/promo-code/FETCH_VALIDATE_PROMOCODE_FAILURE';
const FETCH_VALIDATE_PROMOCODE_CLEAR = 'voud/promo-code/FETCH_VALIDATE_PROMOCODE_CLEAR';

// Reducer
const initialState = {
	promoCode: {
		isFetching: false,
		error: '',
		data: null
	}
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		// FETCH promoCode
		case FETCH_VALIDATE_PROMOCODE: {
			return {
				...state,
				promoCode: {
					...state.promoCode,
					isFetching: true,
					error: ''
				}
			};
		}

		case FETCH_VALIDATE_PROMOCODE_SUCCESS: {
			return {
				...state,
				promoCode: {
					...state.promoCode,
					isFetching: false,
					data: action.payload ? action.payload : null
				}
			};
		}

		case FETCH_VALIDATE_PROMOCODE_FAILURE: {
			return {
				...state,
				promoCode: {
					isFetching: false,
					data: null,
					error: action.error
				}
			};
		}
		case FETCH_VALIDATE_PROMOCODE_CLEAR: {
			return {
				...state,
				promoCode: {
					isFetching: false,
					data: null
				}
			};
		}

		// DEFAULT
		default:
			return state;
	}
}

// Private action creators
function _fetchpromoCode() {
	return { type: FETCH_VALIDATE_PROMOCODE };
}

function _fetchpromoCodeSuccess(payload) {
	return { type: FETCH_VALIDATE_PROMOCODE_SUCCESS, payload };
}

function _fetchpromoCodeFailure(error) {
	return { type: FETCH_VALIDATE_PROMOCODE_FAILURE, error };
}

function _fetchpromoCodeClear() {
	return { type: FETCH_VALIDATE_PROMOCODE_CLEAR };
}

export function fetchPromocodeClear() {
	return async (dispatch) => {
		dispatch(_fetchpromoCodeClear());
	};
}

export function fetchPromocode(request) {
	return async (dispatch) => {
		dispatch(_fetchpromoCode());
		try {
      const response = await voudRequest('/promocode/validate-promocode', 'POST', request, true);
   		dispatch(_fetchpromoCodeSuccess(response.payload));
		} catch (error) {
			if (__DEV__) console.tron.log(error.message, true);
			if (!requestErrorHandler(dispatch, error, _fetchpromoCodeFailure(error.message))) {
				throw error;
			}
		}
	};
}
