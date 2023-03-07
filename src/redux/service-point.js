// VouD imports
import { voudRequest } from '../shared/services';
import { requestErrorHandler } from '../shared/request-error-handler';
import { initActions, persistData, asyncStorageKeys } from './init';

// Actions

const SET_CURRENT_VIEW = 'voud/service-points/SET_CURRENT_VIEW';

const REQUEST_LIST = 'voud/service-points/REQUEST_LIST';
const REQUEST_LIST_SUCCESS = 'voud/service-points/REQUEST_LIST_SUCCESS';
const REQUEST_LIST_FAILURE = 'voud/service-points/REQUEST_LIST_FAILURE';

const VIEW_DETAILS = 'voud/service-points/VIEW_DETAILS';

// Consts

export const servicePointViews = {
  NONE: '0',
  BOM: '1',
  BU: '2',
};

// Reducer

const initialState = {
  list: {
    isFetching: false,
    error: '',
    requested: null,
    data: [],
  },
  currentDetailId: null,
  currentView: servicePointViews.NONE,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_VIEW:
      return {
        ...state,
        currentView: action.view,
      };

    case initActions.HYDRATE:
      return {
        ...state,
        currentView: action.data.servicePointView || 0,
      };


    case REQUEST_LIST:
      return {
        ...state,
        list: {
          ...state.list,
          requested: new Date(),
          isFetching: true,
        }
      };
    case REQUEST_LIST_SUCCESS:
      return {
        ...state,
        list: {
          ...state.list,
          isFetching: false,
          error: '',
          data: action.response.payload.map(servicePoint => {
            const lat = Number(servicePoint.latitude);
            const long = Number(servicePoint.longitude);

            return {
              ...servicePoint,
              latitude: lat >= -180 && lat <= 180 ? lat : 0,
              longitude: long >= -180 && long <= 180 ? long : 0
            }
          }),
        },
      };
    case REQUEST_LIST_FAILURE:
      return {
        ...state,
        list: {
          ...state.list,
          isFetching: false,
          error: action.error,
        },
      };
    case VIEW_DETAILS:
      return {
        ...state,
        currentDetailId: action.servicePointId,
      };
    default:
      return state;
  }
}

export default reducer;

// Actions creators

// Current View
export function _setCurrentView(view) {
  return {
    type: SET_CURRENT_VIEW,
    view,
  };
}

// Request service points
function requestServicePoints() {
  return { type: REQUEST_LIST };
}
function requestServicePointsSuccess(response) {
  return {
    type: REQUEST_LIST_SUCCESS,
    response
  }
}
function requestServicePointsFailure(error) {
  return {
    type: REQUEST_LIST_FAILURE,
    error
  }
}

// View details
export function viewDetails(servicePointId) {
  return {
    type: VIEW_DETAILS,
    servicePointId
  }
}

// Thunk action creators

export function setCurrentView(view) {
  return function (dispatch) {
    dispatch(_setCurrentView(view));
    persistData(asyncStorageKeys.servicePointView, view);
  };
}

export function fetchServicePoints() {
  return function (dispatch) {
    // dispatch request action
    dispatch(requestServicePoints());

    (async () => {
      try {
        let response = await voudRequest('/content/service-point/list', 'GET');
        dispatch(requestServicePointsSuccess(response));
      }
      catch (error) {
        if (__DEV__) console.tron.log(error.message, true);
        requestErrorHandler(dispatch, error, requestServicePointsFailure(error.message));
      }
    })();
  }
}
