/* eslint-disable no-undef */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import actionTypes from "..";
import { uuidv4 } from "../../../../utils/uuid-util";
import { mockFetch } from '../../../../test-utils/fetch-helper';
import { initialState } from '../../../../redux/payment-method';

import {
  // Action creators
  _fetchRechargePointsSearch,
  _fetchRechargePointsSearchFailure,
  _fetchRechargePointsSearchSuccess,
  fetchRechargePointsSearchClear,

  // Thunks
  fetchRechargePointsSearch,
} from '../search';

// Initialize redux store
const requestUid = uuidv4();
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  searchPointsOfInterest: {
    rechargePointsSearch: {
      lastRequestUid: requestUid,
    }
  },
  profile: {
    position: {},
  }
});

describe('Search points of interest actions > FETCH_RECHARGE_POINTS_SEARCH_*', () => {
  afterEach(() => {
    store.clearActions();
  });

  it('creates the FETCH_RECHARGE_POINTS_SEARCH action correctly', () => {
    const mockSearchTerm = 'searchTermMock';

    const expectedAction = {
      type: actionTypes.FETCH_RECHARGE_POINTS_SEARCH,
      searchTerm: mockSearchTerm,
      uid: requestUid,
    }

    expect(expectedAction)
      .toEqual(_fetchRechargePointsSearch(mockSearchTerm, requestUid))
  });

  it('creates the FETCH_RECHARGE_POINTS_SEARCH_SUCCESS action correctly', () => {
    const mockSearchTerm = 'searchTermMock';

    const expectedAction = {
      type: actionTypes.FETCH_RECHARGE_POINTS_SEARCH_SUCCESS,
      searchTerm: mockSearchTerm,
      response: [],
    }

    expect(expectedAction)
      .toEqual(_fetchRechargePointsSearchSuccess([], mockSearchTerm))
  });

  it('creates the FETCH_RECHARGE_POINTS_SEARCH_FAILURE action correctly', () => {
    const mockError = 'mockError';

    const expectedAction = {
      type: actionTypes.FETCH_RECHARGE_POINTS_SEARCH_FAILURE,
      error: mockError,
    }

    expect(expectedAction)
      .toEqual(_fetchRechargePointsSearchFailure(mockError))
  });

  it('creates the FETCH_RECHARGE_POINTS_SEARCH_CLEAR action correctly', () => {
    const expectedAction = {
      type: actionTypes.FETCH_RECHARGE_POINTS_SEARCH_CLEAR,
    }

    expect(expectedAction)
      .toEqual(fetchRechargePointsSearchClear())
  });

  // Thunks
  it('dispatches the correct actions if fetchRechargePointsSearch thunk succeeds', async () => {
    global.fetch = mockFetch(true, {
      payload: {
        aaData: [{}],
      }
    });

    const expectedActions = [
      actionTypes.FETCH_RECHARGE_POINTS_SEARCH_CLEAR,
      actionTypes.FETCH_RECHARGE_POINTS_SEARCH,
      actionTypes.FETCH_RECHARGE_POINTS_SEARCH_SUCCESS,
    ];

    await store.dispatch(fetchRechargePointsSearch('a'));
    const dispatchedActions = store.getActions().map(action => action.type);
    expect(dispatchedActions).toEqual(expectedActions);
  })

  it('dispatches the correct actions if fetchRechargePointsSearch thunk fails', async () => {
    const mockErrorMessage = 'Test error';
    global.fetch = mockFetch(false, { returnMessage: mockErrorMessage });

    const expectedActions = [
      actionTypes.FETCH_RECHARGE_POINTS_SEARCH_CLEAR,
      actionTypes.FETCH_RECHARGE_POINTS_SEARCH,
      actionTypes.FETCH_RECHARGE_POINTS_SEARCH_FAILURE,
    ];

    try {
      await store.dispatch(fetchRechargePointsSearch('a'));
      done.fail();
    } catch (error) {
      const dispatchedActions = store.getActions().map(action => action.type);
      expect(expectedActions).toEqual(dispatchedActions);

      const failureAction = store.getActions().find(action => action.type === actionTypes.FETCH_RECHARGE_POINTS_SEARCH_FAILURE);
      expect(failureAction.error).toEqual(mockErrorMessage);
    }
  })
});