/* eslint-disable no-undef */
// actions
import {
  _fetchArrivalForecast,
  _fetchArrivalForecastFailure,
  _fetchArrivalForecastSuccess
} from '../actions';

import searchPointsOfInterestReducer, { initialState } from '../reducer';
import { testInitRequestAction } from '../../../test-utils/request-actions-helper';

describe('SearchPointsOfInterest reducer > _fetchArrivalForecast', () => {
  // Fetch Points Of Interest
  it('returns the correct state on _fetchArrivalForecast init action', () => {
    testInitRequestAction(
      initialState,
      searchPointsOfInterestReducer,
      'arrivalForecast',
      _fetchArrivalForecast
    )
  });

  it('returns the correct state on _fetchArrivalForecast success action', () => {
    const mockExpectedState = {
      ...initialState,
      arrivalForecast: {
        ...initialState.arrivalForecast,
        isFetching: false,
      },
    }

    const newState = searchPointsOfInterestReducer(initialState, _fetchArrivalForecastSuccess([]));
    expect(mockExpectedState).toEqual(newState);
  });

  it('returns the correct state on _fetchArrivalForecast failure action', () => {
    const mockError = 'mockError';

    const mockExpectedState = {
      ...initialState,
      arrivalForecast: {
        ...initialState.arrivalForecast,
        isFetching: false,
        error: mockError,
      },
    }

    const newState = searchPointsOfInterestReducer(initialState, _fetchArrivalForecastFailure(mockError));
    expect(mockExpectedState).toEqual(newState);
  })
});