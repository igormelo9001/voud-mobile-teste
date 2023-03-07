/* eslint-disable no-undef */
// actions
import {
  _fetchRechargePointsSearch,
  _fetchRechargePointsSearchFailure,
  _fetchRechargePointsSearchSuccess
} from '../actions';

import searchPointsOfInterestReducer, { initialState } from '../reducer';
import { uuidv4 } from '../../../utils/uuid-util';

// req uid
const requestUid = uuidv4();

describe('SearchPointsOfInterest reducer > _fetchRechargePointsSearch', () => {
  // Fetch Points Of Interest
  it('returns the correct state on _fetchRechargePointsSearch init action', () => {
    const expectedState = {
      ...initialState,
      rechargePointsSearch: {
        ...initialState.rechargePointsSearch,
        isFetching: true,
        error: "",
        lastRequestUid: requestUid,
      },
    };

    const newState = searchPointsOfInterestReducer(initialState, _fetchRechargePointsSearch('', requestUid));
    expect(expectedState).toEqual(newState);
  });

  it('returns the correct state on _fetchRechargePointsSearch success action', () => {
    const mockInitialState = {
      ...initialState,
      rechargePointsSearch: {
        lastRequestUid: requestUid,
        page: 0,
        data: [],
        currentSearchTerm: '',
        error: '',
      }
    }

    const mockExpectedState = {
      ...initialState,
      rechargePointsSearch: {
        ...initialState.rechargePointsSearch,
        isFetching: false,
        lastRequestUid: requestUid,
        page: 1,
      },
    }

    const newState = searchPointsOfInterestReducer(mockInitialState, _fetchRechargePointsSearchSuccess({ payload: { aaData: [] } }, ''));
    expect(mockExpectedState).toEqual(newState);
  });

  it('returns the correct state on _fetchRechargePointsSearch failure action', () => {
    const mockError = 'mockError';

    const mockExpectedState = {
      ...initialState,
      rechargePointsSearch: {
        ...initialState.rechargePointsSearch,
        isFetching: false,
        error: mockError,
      },
    }

    const newState = searchPointsOfInterestReducer(initialState, _fetchRechargePointsSearchFailure(mockError));
    expect(mockExpectedState).toEqual(newState);
  })
});