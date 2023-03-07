/* eslint-disable no-undef */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import actionTypes from "..";
import { uuidv4 } from "../../../../utils/uuid-util";
import { mockFetch } from '../../../../test-utils/fetch-helper';
import { initialState } from '../../../../redux/payment-method';

import {
  // Action creators
  _fetchBusLineSearch,
  _fetchBusLineSearchFailure,
  _fetchBusLineSearchSuccess,
  fetchBusLineSearchClear,

  // Thunks
  fetchBusLine,
} from '../search';

// Initialize redux store
const requestUid = uuidv4();
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  profile: {
    position: {},
  }
});

describe('Search points of interest actions > FETCH_BUS_LINE_SEARCH_*', () => {
  afterEach(() => {
    store.clearActions();
  });

  it('creates the FETCH_BUS_LINE_SEARCH action correctly', () => {
    const expectedAction = {
      type: actionTypes.FETCH_BUS_LINE_SEARCH,
    }

    expect(expectedAction)
      .toEqual(_fetchBusLineSearch())
  });

  it('creates the FETCH_BUS_LINE_SEARCH_SUCCESS action correctly', () => {
    const mockData = [];

    const expectedAction = {
      type: actionTypes.FETCH_BUS_LINE_SEARCH_SUCCESS,
      response: mockData,
    }

    expect(expectedAction)
      .toEqual(_fetchBusLineSearchSuccess(mockData))
  });

  it('creates the FETCH_BUS_LINE_SEARCH_FAILURE action correctly', () => {
    const mockError = 'mockError';

    const expectedAction = {
      type: actionTypes.FETCH_BUS_LINE_SEARCH_FAILURE,
      error: mockError,
    }

    expect(expectedAction)
      .toEqual(_fetchBusLineSearchFailure(mockError))
  });

  it('creates the FETCH_BUS_LINE_SEARCH_CLEAR action correctly', () => {
    const expectedAction = {
      type: actionTypes.FETCH_BUS_LINE_SEARCH_CLEAR,
    }

    expect(expectedAction)
      .toEqual(fetchBusLineSearchClear())
  });

  // // Thunks
  it('dispatches the correct actions if fetchBusLineSearch thunk succeeds', async () => {
    global.fetch = mockFetch(true, {
      payload: {
        aaData: [{}],
      }
    });

    const expectedActions = [
      actionTypes.FETCH_BUS_LINE_SEARCH,
      actionTypes.FETCH_BUS_LINE_SEARCH_SUCCESS,
    ];

    await store.dispatch(fetchBusLine());
    const dispatchedActions = store.getActions().map(action => action.type);
    expect(dispatchedActions).toEqual(expectedActions);
  })

  it('dispatches the correct actions if fetchBusLineSearch thunk fails', async () => {
    const mockErrorMessage = 'Test error';
    global.fetch = mockFetch(false, { returnMessage: mockErrorMessage });

    const expectedActions = [
      actionTypes.FETCH_BUS_LINE_SEARCH,
      actionTypes.FETCH_BUS_LINE_SEARCH_FAILURE,
    ];

    try {
      await store.dispatch(fetchBusLine());
      done.fail();
    } catch (error) {
      const dispatchedActions = store.getActions().map(action => action.type);
      expect(expectedActions).toEqual(dispatchedActions);

      const failureAction = store.getActions().find(action => action.type === actionTypes.FETCH_BUS_LINE_SEARCH_FAILURE);
      expect(failureAction.error).toEqual(mockErrorMessage);
    }
  })
});