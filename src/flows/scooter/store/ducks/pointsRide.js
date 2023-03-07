// NPM imports
import { voudRequest } from '../../../../shared/services';
import { uuidv4 } from '../../../../utils/uuid-util';

// Types
const Types = {
	POINT_RIDE: 'voud/scooter/POINT_RIDE',
	POINT_RIDE_SUCCESS: 'voud/scooter/POINT_RIDE_SUCCESS',
    POINT_RIDE_FAILURE: 'voud/scooter/POINT_RIDE_FAILURE',
    POINT_RIDE_CLEAR: 'voud/scooter/POINT_RIDE_CLEAR',

};

// Reducer

const initialState = {
	isFetching: false,
	error: '',
	data: []
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case Types.POINT_RIDE:
			return {
				...state,
				isFetching: true,
				lastRequestUid: action.uid
			};
		case Types.POINT_RIDE_SUCCESS:
			return {
				...state,
				data: action.payload,
				isFetching: false
			};
		case Types.POINT_RIDE_FAILURE:
			return {
				...state,
				data: [],
				isFetching: false
            };

		case Types.POINT_RIDE_CLEAR:
			return {
				...state,
				data: [],
			};
		default:
			return state;
	}
}

// Actions Creators

function pointRide(uid) {
	return {
		type: Types.POINT_RIDE,
		uid
	};
}

function pointRideSuccess(payload) {
	return {
		type: Types.POINT_RIDE_SUCCESS,
		payload
	};
}

function pointRideFailure(error) {
	return {
		type: Types.POINT_RIDE_FAILURE,
		error: error
	};
}

export function pointRideClear() {
	return {
		type: Types.POINT_RIDE_FAILURE
	};
}

// Thunk creators

export function fetchPointsRide() {
	return async function(dispatch, getState) {
		const requestUid = uuidv4();

		dispatch(pointRide(requestUid));
		try {
      const response = await voudRequest(`/scoo/points`, 'GET', null, true, true);
			dispatch(pointRideSuccess(response.payload));
		} catch (error) {
			if (__DEV__) console.tron.log(error.message, true);
			dispatch(pointRideFailure('Ocorreu um erro durante carregamento dos scoo, tente novamente'));
			throw error;
		}
	};
}
