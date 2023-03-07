import { initActions, asyncStorageKeys, persistData, clearData } from '../../../../redux/init';
import { voudRequest } from '../../../../shared/services';

// Actions Types
const Types = {
    START_RIDE: 'voud/scooter/START_RIDE',
    START_RIDE_SUCCESS: 'voud/scooter/START_RIDE_SUCCESS',
    START_RIDE_FAILARE: 'voud/scooter/START_RIDE_FAILARE',
}

// Reducer
const initialState = {
    isActive: false,
    startDate: null,
    initialValue: 4.3,
    valuePerMinute: 0.45,
    minuteFree: 15,
    isFetching: false,
    idRide: null,
    error: "",
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case initActions.HYDRATE:
            if (action.data.scooterData)
                return {
                    ...state,
                    ...action.data.scooterData,
                    isActive: true,
                    isFetching: false,
                };
            else
                return {
                    ...state,
                    isActive: false,
                    isFetching: false,
                };
        case Types.START_RIDE:
            return {
                ...state,
                isFetching: true,
                isActive: true,
                startDate: new Date(),
            };
        case Types.START_RIDE_FAILARE:
            return {
                ...state,
                isActive: false,
                startDate: null,
                isFetching: false,
                error: action.error
            }
        case Types.START_RIDE_SUCCESS:
            persistData(asyncStorageKeys.scooterData, {
                ...state,
                isActive: true,
                idRide: action.payload.id,
                isFetching: false
            }
            );
            return {
                ...state,
                isFetching: false,
                isActive: true,
                idRide: action.payload.id,
            }
        default:
            return state;
    }
}

export default reducer;


// Actions creators
function startRide() {
    return {
        type: Types.START_RIDE
    };
}

function startRideSuccess(payload) {
    return {
        type: Types.START_RIDE_SUCCESS,
        payload,
    };
}

function startRideFailure(error) {
    clearData(asyncStorageKeys.scooterData);
    return {
        type: Types.START_RIDE_FAILARE,
        error,
    }
}

//Thunk actions creators

export function fetchStartRide(code, idCustomer,idScooTransaction) {
    return async function (dispatch) {
        dispatch(startRide());

        try {

            const requestBody = { code, idCustomer,idScooTransaction };
            const response = await voudRequest('/scoo/rides', 'POST', requestBody, true, true);
            dispatch(startRideSuccess(response.payload));

        } catch (error) {
            if (__DEV__) console.tron.log(error.message, true);
            dispatch(startRideFailure("O QrCode informando não é válido! Por favor, tente novamente ou procure um operador da SCOO se o problema persistir."))
            throw error;
        }
    }
}
