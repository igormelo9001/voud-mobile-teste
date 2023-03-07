// VouD imports
import actionTypes from './actions';
import { calculateDistance } from '../../utils/haversine';

// Reducer
export const initialState = {
  transportLinesSearch: {
    isFetching: false,
    error: '',
    reachedEnd: false,
    page: 0,
    data: [],
    currentSearchTerm: '',
    lastRequestUid: null,
  },
  rechargePointsSearch: {
    isFetching: false,
    error: '',
    reachedEnd: false,
    page: 0,
    data: [],
    currentSearchTerm: '',
    lastRequestUid: null,
  },
  nextPoint: {
    isFetching: false,
    error: '',
    data: {},
  },
  arrivalForecast: {
    isFetching: false,
    error: '',
    data: {},
  },
  busLineSearch: {
    isFetching: false,
    error: '',
    data: [],
  },
  routeSearch: {
    isFetching: false,
    error: '',
    data: [],
  },
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case actionTypes.REQUEST_LIST:
			return {
				...state,
				rechargePointsSearch: {
					...state.rechargePointsSearch,
					isFetching: true,
					error: '',
					lastRequestUid: action.uid
				}
			};
		case actionTypes.REQUEST_LIST_SUCCESS:
			return {
				...state,
				rechargePointsSearch: {
					...state.rechargePointsSearch,
					isFetching: false,
					page: 1,
					reachedEnd: true,
					data: action.response.payload.map((servicePoint) => {
						const lat = Number(servicePoint.latitude);
						const long = Number(servicePoint.longitude);

						const distance = calculateDistance(
							action.currentUserPosition.latitude,
							action.currentUserPosition.longitude,
							lat,
							long,
							5
						);
						return {
							...servicePoint,
							positionLatitude: lat,
							positionLongitude: long,
							distance: distance
						};
					}).sort(
						(a, b) =>
							a.distance -
							b.distance
					)
				}
			};
		case actionTypes.REQUEST_LIST_FAILURE:
			return {
				...state,
				rechargePointsSearch: {
					...state.rechargePointsSearch,
					isFetching: false,
					error: action.error
				}
			};

		// transportLinesSearch
		case actionTypes.FETCH_TRANSPORT_LINE_SEARCH:
			return {
				...state,
				transportLinesSearch: {
					...state.transportLinesSearch,
					isFetching: true,
					error: '',
					currentSearchTerm: action.searchTerm,
					lastRequestUid: action.uid
				}
			};

		case actionTypes.FETCH_TRANSPORT_LINE_SEARCH_SUCCESS:
			return {
				...state,
				transportLinesSearch: {
					...state.transportLinesSearch,
					isFetching: false,
					page: ++state.transportLinesSearch.page,
					data:
						action.response.payload.aaData &&
						state.transportLinesSearch.currentSearchTerm === action.searchTerm
							? state.transportLinesSearch.data
									.filter(
										(el) =>
											!action.response.payload.aaData.some(
												(curPurchase) => el.id === curPurchase.id
											)
									)
									.concat(action.response.payload.aaData)
							: state.transportLinesSearch.data,
					reachedEnd: ++state.transportLinesSearch.page >= action.response.payload.iTotalPages
				}
			};

		case actionTypes.FETCH_TRANSPORT_LINE_SEARCH_FAILURE:
			return {
				...state,
				transportLinesSearch: {
					...state.transportLinesSearch,
					isFetching: false,
					error: action.error
				}
			};

		case actionTypes.FETCH_TRANSPORT_LINE_SEARCH_CLEAR:
			return {
				...state,
				transportLinesSearch: {
					...initialState.transportLinesSearch
				}
			};

		// rechargePointsSearch
		case actionTypes.FETCH_RECHARGE_POINTS_SEARCH:
			return {
				...state,
				rechargePointsSearch: {
					...state.rechargePointsSearch,
					isFetching: true,
					error: '',
					currentSearchTerm: action.searchTerm,
					lastRequestUid: action.uid
				}
			};

		case actionTypes.FETCH_RECHARGE_POINTS_SEARCH_SUCCESS:
			return {
				...state,
				rechargePointsSearch: {
					...state.rechargePointsSearch,
					isFetching: false,
					page: ++state.rechargePointsSearch.page,
					data:
						action.response.payload.aaData &&
						state.rechargePointsSearch.currentSearchTerm === action.searchTerm
							? state.rechargePointsSearch.data
									.filter(
										(el) =>
											!action.response.payload.aaData.some(
												(curPurchase) => el.id === curPurchase.id
											)
									)
									.concat(action.response.payload.aaData)
							: state.rechargePointsSearch.data,
					reachedEnd: ++state.rechargePointsSearch.page >= action.response.payload.iTotalPages
				}
			};

		case actionTypes.FETCH_RECHARGE_POINTS_SEARCH_FAILURE:
			return {
				...state,
				rechargePointsSearch: {
					...state.rechargePointsSearch,
					isFetching: false,
					error: action.error
				}
			};

		case actionTypes.FETCH_RECHARGE_POINTS_SEARCH_CLEAR:
			return {
				...state,
				rechargePointsSearch: {
					...initialState.rechargePointsSearch
				}
			};

		// nextPoint
		case actionTypes.FETCH_NEXT_POINT:
			return {
				...state,
				nextPoint: {
					...state.nextPoint,
					isFetching: true,
					error: ''
				}
			};

		case actionTypes.FETCH_NEXT_POINT_SUCCESS:
			return {
				...state,
				nextPoint: {
					...state.nextPoint,
					isFetching: false,
					data: action.response.payload ? action.response.payload : state.nextPoint.data
				}
			};

		case actionTypes.FETCH_NEXT_POINT_FAILURE:
			return {
				...state,
				nextPoint: {
					...state.nextPoint,
					isFetching: false,
					error: action.error
				}
			};

		case actionTypes.FETCH_NEXT_POINT_CLEAR:
			return {
				...state,
				nextPoint: {
					...initialState.nextPoint
				}
			};

		// arrivalForecast
		case actionTypes.FETCH_ARRIVAL_FORECAST:
			return {
				...state,
				arrivalForecast: {
					...state.arrivalForecast,
					isFetching: true,
					error: ''
				}
			};

		case actionTypes.FETCH_ARRIVAL_FORECAST_SUCCESS:
			return {
				...state,
				arrivalForecast: {
					...state.arrivalForecast,
					isFetching: false,
					data: action.response.payload ? action.response.payload : state.arrivalForecast.data
				}
			};

		case actionTypes.FETCH_ARRIVAL_FORECAST_FAILURE:
			return {
				...state,
				arrivalForecast: {
					...state.arrivalForecast,
					isFetching: false,
					error: action.error
				}
			};

		case actionTypes.FETCH_ARRIVAL_FORECAST_CLEAR:
			return {
				...state,
				arrivalForecast: {
					...initialState.arrivalForecast
				}
			};

		case actionTypes.FETCH_BUS_LINE_SEARCH:
			return {
				...state,
				busLineSearch: {
					...state.busLineSearch,
					isFetching: true,
					error: ''
				}
			};

		case actionTypes.FETCH_BUS_LINE_SEARCH_SUCCESS:
			return {
				...state,
				busLineSearch: {
					...state.busLineSearch,
					isFetching: false,
					data: action.response.payload ? action.response.payload : state.busLineSearch.data
				}
			};

		case actionTypes.FETCH_BUS_LINE_SEARCH_FAILURE:
			return {
				...state,
				busLineSearch: {
					...state.busLineSearch,
					isFetching: false,
					error: action.error
				}
			};

		case actionTypes.FETCH_BUS_LINE_SEARCH_CLEAR:
			return {
				...state,
				busLineSearch: {
					...initialState.busLineSearch
				}
			};

		// arrivalForecast
		case actionTypes.FETCH_ROUTES:
			return {
				...state,
				routeSearch: {
					...state.routeSearch,
					isFetching: true,
					error: ''
				}
			};

		case actionTypes.FETCH_ROUTES_SUCCESS:
			return {
				...state,
				routeSearch: {
					...state.routeSearch,
					isFetching: false,
					data: action.response.payload ? action.response.payload : state.routeSearch.data
				}
			};

		case actionTypes.FETCH_ROUTES_FAILURE:
			return {
				...state,
				routeSearch: {
					...state.routeSearch,
					isFetching: false,
					error: action.error
				}
			};

		case actionTypes.FETCH_ROUTES_CLEAR:
			return {
				...state,
				routeSearch: {
					...initialState.routeSearch
				}
			};

		// Default
		default:
			return state;
	}
}
