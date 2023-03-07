import { initActions, asyncStorageKeys, persistData, clearData } from '../../../../redux/init';
import { voudRequest } from '../../../../shared/services';
import { requestErrorHandler } from '../../../../shared/request-error-handler';

//Acitons Types

const Types = {
    END_RIDE: 'voud/scooter/END_RIDE',
    END_RIDE_SUCCESS: 'voud/scooter/END_RIDE_SUCCESS',
    END_RIDE_FAILURE: 'voud/scooter/END_RIDE_FAILURE',
};

//Reducer
const initialState = {
    isActive: false,
    startDate: null,
    initialValue: 4.3,
    valuePerMinute: 0.45,
    minuteFree: 15,
    error: "",
    isFetching: false,
    idRide: null,
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

        case Types.END_RIDE:
            return {
                ...state,
                isFetching: true,
            };
        case Types.END_RIDE_SUCCESS:
            clearData(asyncStorageKeys.scooterData);
            return {
                ...state,
                isFetching: false,
                isActive: false,
                error: '',
            };
        case Types.END_RIDE_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: action.error,
            }
        default:
            return state;
    }
}

export default reducer;

// Actions Creators
function endRide() {
    return {
        type: Types.END_RIDE
    };
}

function endRideSuccess(payload) {
    return {
        type:  Types.END_RIDE_SUCCESS ,
        payload,
    }
}

function endRideFailure(error) {
    return {
        type: Types.END_RIDE_FAILURE,
        error,
    }
}

// Thunk creators

export function fetchEndRide( code, idRide, idCustomer){
    return async function(dispatch){
     dispatch(endRide());

     try {

         const requestBody = { code, idCustomer };
         const response = await voudRequest(`/scoo/rides/${idRide}/end`, 'POST', requestBody, true, true);
         dispatch(endRideSuccess(response.payload));

         return response.payload;

     } catch (error) {
         if (__DEV__) console.tron.log(error.message, true);
             if (!requestErrorHandler(dispatch, error, endRideFailure("O QrCode informando não é válido! Por favor, tente novamente ou procure um operador da SCOO se o problema persistir."))) {
                 throw error;
             }
     }
    }
 }
