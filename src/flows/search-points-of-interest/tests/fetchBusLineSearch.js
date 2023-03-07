/* eslint-disable no-undef */
// actions
import {
  _fetchBusLineSearch,
  _fetchBusLineSearchFailure,
  _fetchBusLineSearchSuccess
} from '../actions';

import searchPointsOfInterestReducer, { initialState } from '../reducer';
import { testInitRequestAction } from '../../../test-utils/request-actions-helper';

describe('SearchPointsOfInterest reducer > _fetchBusLineSearch', () => {
  // Fetch Points Of Interest
  it('returns the correct state on _fetchBusLineSearch init action', () => {
    testInitRequestAction(
      initialState,
      searchPointsOfInterestReducer,
      'busLineSearch',
      _fetchBusLineSearch
    )
  });

  it('returns the correct state on _fetchBusLineSearch success action', () => {
    const mockExpectedState = {
      ...initialState,
      busLineSearch: {
        ...initialState.busLineSearch,
        isFetching: false,
      },
    }

    const newState = searchPointsOfInterestReducer(initialState, _fetchBusLineSearchSuccess([]));
    expect(mockExpectedState).toEqual(newState);
  });

  it('returns the correct state on _fetchBusLineSearch failure action', () => {
    const mockError = 'mockError';

    const mockExpectedState = {
      ...initialState,
      busLineSearch: {
        ...initialState.busLineSearch,
        isFetching: false,
        error: mockError,
      },
    }

    const newState = searchPointsOfInterestReducer(initialState, _fetchBusLineSearchFailure(mockError));
    expect(mockExpectedState).toEqual(newState);
  })
});