import actionTypes from './types';
import { voudRequest } from '../../../shared/services';
import { requestErrorHandler } from '../../../shared/request-error-handler';
import { pointsOfInterestTypes } from '../../../flows/home/actions';
import { uuidv4 } from '../../../utils/uuid-util';

// Request service points
function requestServicePoints(uid) {
	return { type: actionTypes.REQUEST_LIST, uid };
}
function requestServicePointsSuccess(response, currentUserPosition) {
	return {
		type: actionTypes.REQUEST_LIST_SUCCESS,
		response,
		currentUserPosition
	};
}
function requestServicePointsFailure(error) {
	return {
		type: actionTypes.REQUEST_LIST_FAILURE,
		error
	};
}

// Transport Line Search
function _fetchTransportLineSearch(searchTerm, uid) {
	return { type: actionTypes.FETCH_TRANSPORT_LINE_SEARCH, searchTerm, uid };
}

function _fetchTransportLineSearchSuccess(response, searchTerm) {
	return { type: actionTypes.FETCH_TRANSPORT_LINE_SEARCH_SUCCESS, response, searchTerm };
}

function _fetchTransportLineSearchFailure(error) {
	return { type: actionTypes.FETCH_TRANSPORT_LINE_SEARCH_FAILURE, error };
}

export function fetchTransportLineSearchClear() {
	return { type: actionTypes.FETCH_TRANSPORT_LINE_SEARCH_CLEAR };
}

// Recharge Points Search
function _fetchRechargePointsSearch(searchTerm, uid) {
	return { type: actionTypes.FETCH_RECHARGE_POINTS_SEARCH, searchTerm, uid };
}

function _fetchRechargePointsSearchSuccess(response, searchTerm) {
	return { type: actionTypes.FETCH_RECHARGE_POINTS_SEARCH_SUCCESS, response, searchTerm };
}

function _fetchRechargePointsSearchFailure(error) {
	return { type: actionTypes.FETCH_RECHARGE_POINTS_SEARCH_FAILURE, error };
}

export function fetchRechargePointsSearchClear() {
	return { type: actionTypes.FETCH_RECHARGE_POINTS_SEARCH_CLEAR };
}

// Next point
function _fetchNextPoint() {
	return { type: actionTypes.FETCH_NEXT_POINT };
}

function _fetchNextPointSuccess(response) {
	return { type: actionTypes.FETCH_NEXT_POINT_SUCCESS, response };
}

function _fetchNextPointFailure(error) {
	return { type: actionTypes.FETCH_NEXT_POINT_FAILURE, error };
}

export function fetchNextPointClear() {
	return { type: actionTypes.FETCH_NEXT_POINT_CLEAR };
}

// Arrival Forecast
function _fetchArrivalForecast() {
	return { type: actionTypes.FETCH_ARRIVAL_FORECAST };
}

function _fetchArrivalForecastSuccess(response) {
	return { type: actionTypes.FETCH_ARRIVAL_FORECAST_SUCCESS, response };
}

function _fetchArrivalForecastFailure(error) {
	return { type: actionTypes.FETCH_ARRIVAL_FORECAST_FAILURE, error };
}

export function fetchArrivalForecastClear() {
	return { type: actionTypes.FETCH_ARRIVAL_FORECAST_CLEAR };
}

// Bus Line Search
function _fetchBusLineSearch() {
	return { type: actionTypes.FETCH_BUS_LINE_SEARCH };
}

function _fetchBusLineSearchSuccess(response) {
	return { type: actionTypes.FETCH_BUS_LINE_SEARCH_SUCCESS, response };
}

function _fetchBusLineSearchFailure(error) {
	return { type: actionTypes.FETCH_BUS_LINE_SEARCH_FAILURE, error };
}

export function fetchBusLineSearchClear() {
	return { type: actionTypes.FETCH_BUS_LINE_SEARCH_CLEAR };
}

// Routes
function _fetchRoutes() {
	return { type: actionTypes.FETCH_ROUTES };
}

function _fetchRoutesSuccess(response) {
	return { type: actionTypes.FETCH_ROUTES_SUCCESS, response };
}

function _fetchRoutesFailure(error) {
	return { type: actionTypes.FETCH_ROUTES_FAILURE, error };
}

export function fetchRoutesClear() {
	return { type: actionTypes.FETCH_ROUTES_CLEAR };
}

// Thunks

// const
const ITEMS_PER_PAGE = 15;

export function fetchTransportLineSearch(searchTerm) {
	return async (dispatch, getState) => {
		// Generate and dispatch request unique id
		// this is used later in thunk to ignore
		// old requests that take longer to respond
		const requestUid = uuidv4();

		try {
			const { latitude, longitude } = getState().profile.position;
			const { page, currentSearchTerm } = getState().searchPointsOfInterest.transportLinesSearch;
			const hasChangedSearch = searchTerm !== currentSearchTerm;
			const searchPage = hasChangedSearch ? 0 : page;

			if (hasChangedSearch) {
				dispatch(fetchTransportLineSearchClear());
			}

			const requestBody = {
				userLocation: `${latitude},${longitude}`,
				searchTerm,
				page: searchPage,
				size: ITEMS_PER_PAGE
			};

			dispatch(_fetchTransportLineSearch(searchTerm, requestUid));

			const response = await voudRequest('/mobility/list-lines', 'POST', requestBody, true);

			// compare this request UID to lastRequestUid on store,
			// if is different, a newer request has been made,
			// and the results of this one should be ignored
			if (getState().searchPointsOfInterest.transportLinesSearch.lastRequestUid === requestUid) {
				dispatch(_fetchTransportLineSearchSuccess(response, searchTerm));
			}
			return response;
		} catch (error) {
			if (__DEV__) console.tron.log(error.message);

			const lastRequestUid = getState().searchPointsOfInterest.transportLinesSearch.lastRequestUid;
			if (lastRequestUid && lastRequestUid !== requestUid) return;

			if (!requestErrorHandler(dispatch, error, _fetchTransportLineSearchFailure(error.message))) {
				throw error;
			}
		}
	};
}

export function fetchRechargePointsSearch(searchTerm) {
	return async (dispatch, getState) => {
		// Generate and dispatch request unique id
		// this is used later in thunk to ignore
		// old requests that take longer to respond
		const requestUid = uuidv4();
		try {
			const { latitude, longitude } = getState().profile.position;
			const { page, currentSearchTerm } = getState().searchPointsOfInterest.rechargePointsSearch;
			const hasChangedSearch = searchTerm !== currentSearchTerm;
			const searchPage = hasChangedSearch ? 0 : page;

			if (hasChangedSearch) {
				dispatch(fetchRechargePointsSearchClear());
			}

			const requestBody = {
				userLocation: `${latitude},${longitude}`,
				types: [ pointsOfInterestTypes.RECHARGE ],
				searchTerm,
				page: searchPage,
				size: ITEMS_PER_PAGE
			};

			dispatch(_fetchRechargePointsSearch(searchTerm, requestUid));

			const response = await voudRequest('/mobility/list-points', 'POST', requestBody, true);

			if (getState().searchPointsOfInterest.rechargePointsSearch.lastRequestUid === requestUid) {
				dispatch(_fetchRechargePointsSearchSuccess(response, searchTerm));
			}
			return response;
		} catch (error) {
			if (__DEV__) console.tron.log(error.message);

			const lastRequestUid = getState().searchPointsOfInterest.rechargePointsSearch.lastRequestUid;
			if (lastRequestUid && lastRequestUid !== requestUid) return;

			if (!requestErrorHandler(dispatch, error, _fetchRechargePointsSearchFailure(error.message))) {
				throw error;
			}
		}
	};
}

export function fetchNextPoint(lineId) {
	return async (dispatch, getState) => {
		try {
			const { latitude, longitude } = getState().profile.position;
			const requestBody = {
				userLocation: `${latitude},${longitude}`,
				lineId
			};

			dispatch(_fetchNextPoint());

			const response = await voudRequest('/mobility/next-point', 'POST', requestBody, true);
			dispatch(_fetchNextPointSuccess(response));
			return response;
		} catch (error) {
			if (__DEV__) console.tron.log(error.message);
			if (!requestErrorHandler(dispatch, error, _fetchNextPointFailure(error.message))) {
				throw error;
			}
		}
	};
}

export function fetchArrivalForecast(lineNumber, stopExternalId) {
	return async (dispatch) => {
		try {
			const requestBody = {
				lineNumber,
				stopExternalId
			};

			dispatch(_fetchArrivalForecast());

			const response = await voudRequest('/mobility/arrival-forecast', 'POST', requestBody, true);
			dispatch(_fetchArrivalForecastSuccess(response));
			return response;
		} catch (error) {
			if (__DEV__) console.tron.log(error.message);
			if (!requestErrorHandler(dispatch, error, _fetchArrivalForecastFailure(error.message))) {
				throw error;
			}
		}
	};
}

export function fetchBusLine(lineNumber) {
	return async (dispatch) => {
		try {
			const requestBody = {
				lineNumber
			};

			dispatch(_fetchBusLineSearch());

			const response = await voudRequest('/mobility/list-bus-line', 'POST', requestBody, true);
			dispatch(_fetchBusLineSearchSuccess(response));
			return response;
		} catch (error) {
			if (__DEV__) console.tron.log(error.message);
			if (!requestErrorHandler(dispatch, error, _fetchBusLineSearchFailure(error.message))) {
				throw error;
			}
		}
	};
}

export function fetchRoutes(payload) {
	const { origin, destination } = payload;
	return async (dispatch) => {
		try {
			const requestBody = {
				origin,
				destination
			};
			dispatch(_fetchRoutes());
			let response = await voudRequest('/mobility/calculate-routes', 'POST', requestBody, true);

			// Filter routes with only WALKING steps
			if (response.payload) {
				response = {
					...response,
					payload: {
						...response.payload,
						routes: response.payload.routes
							? response.payload.routes.filter(
									(route) =>
										!route.legs ||
										!route.legs[0] ||
										route.legs[0].steps.some(({ travelMode }) => travelMode === 'TRANSIT')
								)
							: []
					}
				};
			}

			dispatch(_fetchRoutesSuccess(response));
			return response;
		} catch (error) {
			if (__DEV__) console.tron.log(error.message);
			if (!requestErrorHandler(dispatch, error, _fetchRoutesFailure(error.message))) {
				throw error;
			}
		}
	};
}

export function fetchServicePoints(position) {
	return async (dispatch, getState) => {
		const requestUid = uuidv4();
		dispatch(requestServicePoints(requestUid));

		(async () => {
			try {
				let response = await voudRequest('/content/service-point/list', 'GET');
				dispatch(requestServicePointsSuccess(response, position));
			} catch (error) {
				if (__DEV__) console.tron.log(error.message, true);

				const lastRequestUid = getState().searchPointsOfInterest.rechargePointsSearch.lastRequestUid;
				if (lastRequestUid && lastRequestUid !== requestUid) return;

				requestErrorHandler(dispatch, error, requestServicePointsFailure(error.message));
			}
		})();
	};
}
