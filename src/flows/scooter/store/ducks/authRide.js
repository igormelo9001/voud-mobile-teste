import { asyncStorageKeys, persistData, } from  '../../../../redux/init';
import { voudRequest } from '../../../../shared/services';
import { requestErrorHandler } from '../../../../shared/request-error-handler';

// Actitons Types

 const Types = {
    AUTH_RIDE: 'voud/scooter/AUTH_RIDE',
    AUTH_RIDE_SUCCESS: 'voud/scooter/AUTH_RIDE_SUCCESS',
    AUTH_RIDE_FAILURE: 'voud/scooter/AUTH_RIDE_FAILURE'
}

// Reducer
const initialState = {
    error: "",
    isFetching: false,
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case Types.AUTH_RIDE:
            return {
                ...state,
                    isFetching: true,
                    error: '',
             };
        case Types.AUTH_RIDE_FAILURE:
            return {
                ...state,
                    isFetching: false,
                    error: action.error,
            };
        case Types.AUTH_RIDE_SUCCESS:
        return {
            ...state,
                isFetching: false,
                error: '',
         };
        default:
            return state;
    }
}

export default reducer;

// Action creators
function authRide() {
    return {
        type: Types.AUTH_RIDE
    };
}

function authRideSuccess(response) {
    return {
        type: Types.AUTH_RIDE_SUCCESS,
        payload: {
            response
        }
    };
}

function authRideFailure(error) {
    return {
        type: Types.AUTH_RIDE_FAILURE,
        error
    };
}

// Thunk action creators

export function fetchAuthRide(name, cpf, email) {
    return async function (dispatch) {
        dispatch(authRide());
     try {
            const requestBody = {
                name,
                email,
                cpf,
            };
            const response = await voudRequest('/scoo/authToken', 'POST', requestBody, true, true,true);
            dispatch(authRideSuccess(response));
            persistData(asyncStorageKeys.scooterToken, response.payload);

            return response;

        } catch (error) {
            if (__DEV__) console.tron.log(error.message, true);
            if (!requestErrorHandler(dispatch, error,
                dispatch(authRideFailure("Ocorreu um erro na autenticação tente novamente.")))) {
                throw error;
            }
        }
    }
}
