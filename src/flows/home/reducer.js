import { createSelector } from 'reselect';

// VouD imports
import actionTypes from './actions';
import { filterPointsByZoomAndDistance, filterNearbyZazcar } from './actions/utils';

// Reducer
const initialState = {
	staticPoints: {
		isFetching: false,
		error: null,
		lastRequestUid: null
	},
	dynamicPoints: {
		isFetching: false,
		error: null,
		lastRequestUid: null
	},
	data: [],
	currentMapPosition: {
		latitude: null,
		longitude: null,
		latitudeDelta: null,
		longitudeDelta: null
	},
	showDirectionZazcar: false
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		// staticPoints of interest
		case actionTypes.FETCH_POINTS_OF_INTEREST: {
			return {
				...state,
				staticPoints: {
					...state.staticPoints,
					isFetching: true,
					error: null,
					lastRequestUid: action.uid
				}
			};
		}

		case actionTypes.FETCH_POINTS_OF_INTEREST_SUCCESS: {
			return {
				...state,
				data: action.data,
				staticPoints: {
					...state.staticPoints,
					isFetching: false,
					error: null
				}
			};
		}

		case actionTypes.FETCH_POINTS_OF_INTEREST_FAILURE: {
			return {
				...state,
				staticPoints: {
					...state.staticPoints,
					isFetching: false,
					error: action.error
				}
			};
		}

		case actionTypes.FETCH_POINTS_OF_INTEREST_CLEAR: {
			return {
				...state,
				data: [],
				staticPoints: {
					...initialState.staticPoints
				}
			};
		}

		// staticPoints of tembici
		case actionTypes.FETCH_POINTS_OF_TEMBICI: {
			return {
				...state,
				staticPoints: {
					...state.staticPoints,
					isFetching: true,
					error: null,
					lastRequestUid: action.uid
				}
			};
		}

		case actionTypes.FETCH_POINTS_OF_TEMBICI_SUCCESS: {
			return {
				...state,
				data: action.data,
				nearbyTembici: action.nearbyTembiciLocation,
				staticPoints: {
					...state.staticPoints,
					isFetching: false,
					error: null
				}
			};
		}

		case actionTypes.FETCH_POINTS_OF_TEMBICI_FAILURE: {
			return {
				...state,
				nearbyTembici: null,
				staticPoints: {
					...state.staticPoints,
					isFetching: false,
					error: action.error
				}
			};
		}

		case actionTypes.FETCH_POINTS_OF_TEMBICI_CLEAR: {
			return {
				...state,
				data: [],
				nearbyTembici: null,
				staticPoints: {
					...initialState.staticPoints
				}
			};
		}

		// staticPoints of tembici
		case actionTypes.FETCH_POINTS_OF_ZAZCAR: {
			return {
				...state,
				staticPoints: {
					...state.staticPoints,
					isFetching: true,
					error: null,
					lastRequestUid: action.uid
				}
			};
		}

		case actionTypes.FETCH_POINTS_OF_ZAZCAR_SUCCESS: {
			return {
				...state,
				data: action.data,
				// nearbyZazcar: action.nearbyZazcarLocation,
				staticPoints: {
					...state.staticPoints,
					isFetching: false,
					error: null
				}
			};
		}

		case actionTypes.FETCH_POINTS_OF_ZAZCAR_FAILURE: {
			return {
				...state,
				nearbyZazcar: null,
				staticPoints: {
					...state.staticPoints,
					isFetching: false,
					error: action.error
				}
			};
		}

		case actionTypes.FETCH_POINTS_OF_ZAZCAR_CLEAR: {
			return {
				...state,
				data: [],
				nearbyZazcar: null,
				staticPoints: {
					...initialState.staticPoints
				}
			};
		}

		case actionTypes.FETCH_DYNAMIC_POINTS: {
			return {
				...state,
				dynamicPoints: {
					...state.dynamicPoints,
					isFetching: true,
					error: null,
					lastRequestUid: action.uid
				}
			};
		}

		case actionTypes.FETCH_DYNAMIC_POINTS_SUCCESS: {
			return {
				...state,
				data: action.data,
				dynamicPoints: {
					...state.dynamicPoints,
					isFetching: false,
					error: null
				}
			};
		}

		case actionTypes.FETCH_DYNAMIC_POINTS_FAILURE: {
			return {
				...state,
				dynamicPoints: {
					...state.dynamicPoints,
					isFetching: false,
					error: action.error
				}
			};
		}

		case actionTypes.FETCH_DYNAMIC_POINTS_CLEAR: {
			return {
				...state,
				dynamicPoints: {
					...initialState.dynamicPoints
				}
			};
		}

		case actionTypes.SHOW_DIRECTION_ZAZCAR: {
			return {
				...state,
				showDirectionZazcar: action.showDirectionZazcar
			};
		}

		// update map pos
		case actionTypes.UPDATE_CURRENT_MAP_POSITION: {
			return {
				...state,
				currentMapPosition: {
					...state.currentMapPosition,
					latitude: action.latitude,
					longitude: action.longitude,
					latitudeDelta: action.latitudeDelta,
					longitudeDelta: action.longitudeDelta
				}
			};
		}

		default: {
			return state;
		}
	}
}

// Selectors

export const pointsOfInterestSelector = (state) => state.pointsOfInterest.data;

export const currentMapPositionSelector = (state) => state.pointsOfInterest.currentMapPosition;

export const getPointsOfInterest = createSelector(
	[ pointsOfInterestSelector, currentMapPositionSelector ],
	(pointsOfInterest, currentMapPosition) => filterPointsByZoomAndDistance(pointsOfInterest, currentMapPosition)
);

export const getNeabyZazcar = createSelector(
	[ pointsOfInterestSelector, currentMapPositionSelector ],
	(pointsOfInterest, currentMapPosition) => filterNearbyZazcar(pointsOfInterest, currentMapPosition)
);
