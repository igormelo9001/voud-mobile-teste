/* eslint-disable no-undef */
// actions
import {
  _fetchNextPoint,
  _fetchNextPointFailure,
  _fetchNextPointSuccess
} from '../actions';

import searchPointsOfInterestReducer, { initialState } from '../reducer';
import { testInitRequestAction, testFailedRequestAction, testSucceededRequestAction } from '../../../test-utils/request-actions-helper';

describe('SearchPointsOfInterest reducer > _fetchNextPoint', () => {
  // Fetch Points Of Interest
  it('returns the correct state on _fetchNextPoint init action', () => {
    testInitRequestAction(
      initialState,
      searchPointsOfInterestReducer,
      'nextPoint',
      _fetchNextPoint
    )
  });

  it('returns the correct state on _fetchNextPoint success action', () => {
    const mockExpectedState = {
      ...initialState,
      nextPoint: {
        ...initialState.nextPoint,
        isFetching: false,
      },
    }

    const newState = searchPointsOfInterestReducer(initialState, _fetchNextPointSuccess([]));
    expect(mockExpectedState).toEqual(newState);
  });

  it('returns the correct state on _fetchNextPoint failure action', () => {
    const mockError = 'mockError';

    const mockExpectedState = {
      ...initialState,
      nextPoint: {
        ...initialState.nextPoint,
        isFetching: false,
        error: mockError,
      },
    }

    const newState = searchPointsOfInterestReducer(initialState, _fetchNextPointFailure(mockError));
    expect(mockExpectedState).toEqual(newState);
  })
});