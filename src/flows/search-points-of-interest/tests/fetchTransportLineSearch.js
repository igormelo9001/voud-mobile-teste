/* eslint-disable no-undef */
// actions
import {
  _fetchTransportLineSearch,
  _fetchTransportLineSearchFailure,
  _fetchTransportLineSearchSuccess
} from '../actions';

import searchPointsOfInterestReducer, { initialState } from '../reducer';
import { uuidv4 } from '../../../utils/uuid-util';
import { testInitRequestAction, testFailedRequestAction, testSucceededRequestAction } from '../../../test-utils/request-actions-helper';

// mock req id
const requestUid = uuidv4();

describe('SearchPointsOfInterest reducer > _fetchTransportLineSearch', () => {
  // Fetch Points Of Interest
  it('returns the correct state on _fetchTransportLineSearch init action', () => {
    const expectedState = {
      ...initialState,
      transportLinesSearch: {
        ...initialState.transportLinesSearch,
        isFetching: true,
        error: "",
        lastRequestUid: requestUid,
      },
    };

    const newState = searchPointsOfInterestReducer(initialState, _fetchTransportLineSearch('', requestUid));
    expect(expectedState).toEqual(newState);
  });

  it('returns the correct state on _fetchTransportLineSearch success action', () => {
    const requestUid = uuidv4();

    const mockInitialState = {
      ...initialState,
      transportLinesSearch: {
        ...initialState.transportLinesSearch,
        lastRequestUid: requestUid,
      }
    }

    const mockExpectedState = {
      ...initialState,
      transportLinesSearch: {
        ...initialState.transportLinesSearch,
        isFetching: false,
        page: 1,
        lastRequestUid: requestUid,
      },
    }

    const newState = searchPointsOfInterestReducer(mockInitialState, _fetchTransportLineSearchSuccess({ payload: { aaData: [] } }, ''))
    expect(mockExpectedState).toEqual(newState);
  });

  it('returns the correct state on _fetchTransportLineSearch failure action', () => {
    const mockErrorMessage = "MockError";

    const mockExpectedState = {
      ...initialState,
      transportLinesSearch: {
        ...initialState.transportLinesSearch,
        isFetching: false,
        error: mockErrorMessage,
      }
    }

    const newState = searchPointsOfInterestReducer(initialState, _fetchTransportLineSearchFailure(mockErrorMessage))
    expect(mockExpectedState).toEqual(newState);
  })
});