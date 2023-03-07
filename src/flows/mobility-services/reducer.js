// NPM imports
import { createSelector } from 'reselect';

// VouD imports
import actionTypes from './actions';
import { extractRequestUI } from '../../redux/utils';

// Reducer
export const initialState = {
  predictions: {
    isFetching: false,
    error: '',
    data: [],
    sessionToken: '',
  },
  placeDetails: {
    isFetching: false,
    error: '',
    data: {
      origin: {},
      destination: {},
    },
  },
  selectedServiceId: '',
  estimates: {
    isFetching: false,
    error: '',
    data: {},
  },
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // Predictions
    case actionTypes.FETCH_PREDICTIONS:
      return {
        ...state,
        predictions: {
          ...state.predictions,
          isFetching: true,
          error: '',
        },
      };

    case actionTypes.FETCH_PREDICTIONS_SUCCESS:
      return {
        ...state,
        predictions: {
          ...state.predictions,
          isFetching: false,
          data: action.response.predictions,
        },
      };

    case actionTypes.FETCH_PREDICTIONS_FAILURE:
      return {
        ...state,
        predictions: {
          ...state.predictions,
          isFetching: false,
          error: action.error,
        },
      };

    case actionTypes.PREDICTIONS_CLEAR:
      return {
        ...state,
        predictions: {
          ...state.predictions,
          isFetching: false,
          error: '',
          data: [],
          sessionToken: '',
        },
      };

    case actionTypes.SET_PREDICTIONS_SESSION_TOKEN:
      return {
        ...state,
        predictions: {
          ...state.predictions,
          sessionToken: action.sessionToken,
        },
      };

    // Place details
    case actionTypes.FETCH_PLACE_DETAILS:
      return {
        ...state,
        placeDetails: {
          ...state.placeDetails,
          isFetching: true,
          error: '',
        },
      };

    case actionTypes.FETCH_PLACE_DETAILS_SUCCESS:
      return {
        ...state,
        predictions: {
          ...state.predictions,
          sessionToken: '',
        },
        placeDetails: {
          ...state.placeDetails,
          isFetching: false,
          data: {
            origin: action.isOrigin ? action.response.result : state.placeDetails.data.origin,
            destination: action.isDestination ? action.response.result : state.placeDetails.data.destination,
          },
        },
      };

    case actionTypes.FETCH_PLACE_DETAILS_FAILURE:
      return {
        ...state,
        placeDetails: {
          ...state.placeDetails,
          isFetching: false,
          error: action.error,
        },
      };

    case actionTypes.PLACE_DETAILS_CLEAR:
      return {
        ...state,
        placeDetails: {
          ...state.placeDetails,
          isFetching: false,
          error: '',
          data: initialState.placeDetails.data,
        },
      };

    // Place details
    case actionTypes.SEARCH_CHANGE_DIRECTIONS:
      return {
        ...state,
        placeDetails: {
          ...state.placeDetails,
          data: {
            origin: state.placeDetails.data.destination,
            destination: state.placeDetails.data.origin,
          },
        },
      };

    // Estimates
    case actionTypes.FETCH_ESTIMATES:
      return {
        ...state,
        estimates: {
          ...state.estimates,
          isFetching: true,
          error: '',
        },
      };

    case actionTypes.FETCH_ESTIMATES_SUCCESS: {
      // rename data.estimates to data.list for better readability (avoid estimates.estimates)
      const { estimates: list, ...data } = action.response.data;

      // filter first trip promo if player app isn't installed
      return {
        ...state,
        estimates: {
          ...state.estimates,
          isFetching: false,
          data: {
            ...data,
            list: list.filter(item => (
              !item.promotion || (item.promotion && item.promotion.first_trip === 0) ||
                (item.promotion && item.promotion.first_trip === 1 && data.players[item.player] &&
                  !data.players[item.player].installed)
              )
            ),
          },
        },
      };
    }

    case actionTypes.FETCH_ESTIMATES_FAILURE:
      return {
        ...state,
        estimates: {
          ...state.estimates,
          isFetching: false,
          error: action.error,
        },
      };

    case actionTypes.ESTIMATES_CLEAR:
      return {
        ...state,
        estimates: {
          ...state.estimates,
          isFetching: false,
          error: '',
          data: {},
        },
      };

    case actionTypes.SELECT_SERVICE:
      return {
        ...state,
        selectedServiceId: action.id,
      };

    // Default
    default:
      return state;
  }
}

// Selectors

export const mobilityServicesSelector = (state) => state.mobilityServices;

export const getPredictionsUi = createSelector(
  mobilityServicesSelector,
  mobilityServicesState => extractRequestUI(mobilityServicesState.predictions),
);

export const getPlaceDetailsUi = createSelector(
  mobilityServicesSelector,
  mobilityServicesState => extractRequestUI(mobilityServicesState.placeDetails),
);

export const getEstimatesUi = createSelector(
  mobilityServicesSelector,
  mobilityServicesState => extractRequestUI(mobilityServicesState.estimates),
);

export const getSelectedService = createSelector(
  mobilityServicesSelector,
  mobilityServicesState => mobilityServicesState.estimates.data.list
    .find(service => service.urban_result_id === mobilityServicesState.selectedServiceId),
);
