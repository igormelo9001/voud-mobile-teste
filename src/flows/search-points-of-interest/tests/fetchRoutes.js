/* eslint-disable no-undef */
// actions
import {
  _fetchRoutes,
  _fetchRoutesFailure,
  _fetchRoutesSuccess
} from '../actions';

import searchPointsOfInterestReducer, { initialState } from '../reducer';
import { testInitRequestAction, testFailedRequestAction, testSucceededRequestAction } from '../../../test-utils/request-actions-helper';

describe('SearchPointsOfInterest reducer > _fetchRoutes', () => {
  // Fetch Points Of Interest
  it('returns the correct state on _fetchRoutes init action', () => {
    testInitRequestAction(
      initialState,
      searchPointsOfInterestReducer,
      'routeSearch',
      _fetchRoutes
    )
  });

  it('returns the correct state on _fetchRoutes success action', () => {
    const mockExpectedState = {
      ...initialState,
      routeSearch: {
        ...initialState.routeSearch,
        isFetching: false,
      },
    }

    const newState = searchPointsOfInterestReducer(initialState, _fetchRoutesSuccess([]));
    expect(mockExpectedState).toEqual(newState);
  });

  it('returns the correct state on _fetchRoutes failure action', () => {
    const mockError = 'mockError';

    const mockExpectedState = {
      ...initialState,
      routeSearch: {
        ...initialState.routeSearch,
        isFetching: false,
        error: mockError,
      },
    }

    const newState = searchPointsOfInterestReducer(initialState, _fetchRoutesFailure(mockError));
    expect(mockExpectedState).toEqual(newState);
  })
});