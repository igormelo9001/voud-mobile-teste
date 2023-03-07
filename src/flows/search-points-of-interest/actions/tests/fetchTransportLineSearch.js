/* eslint-disable no-undef */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import actionTypes from "..";
import { uuidv4 } from "../../../../utils/uuid-util";
import { mockFetch } from '../../../../test-utils/fetch-helper';

import {
  // Action creators
  _fetchTransportLineSearch,
  _fetchTransportLineSearchFailure,
  _fetchTransportLineSearchSuccess,
  fetchTransportLineSearchClear,

  // Thunks
  fetchTransportLineSearch,
} from '../search';

// Initialize redux store
const requestUid = uuidv4();
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  searchPointsOfInterest: {
    transportLinesSearch: {
      lastRequestUid: requestUid,
    }
  },
  profile: {
    position: {},
  }
});

describe('Search points of interest actions > FETCH_TRANSPORT_LINE_SEARCH_*', () => {
  afterEach(() => {
    store.clearActions();
  });

  // FETCH_TRANSPORT_LINE_SEARCH_*
  it('creates the FETCH_TRANSPORT_LINE_SEARCH action correctly', () => {
    const mockSearchTerm = 'searchTermMock';

    const expectedAction = {
      type: actionTypes.FETCH_TRANSPORT_LINE_SEARCH,
      searchTerm: mockSearchTerm,
      uid: requestUid,
    }

    expect(expectedAction)
      .toEqual(_fetchTransportLineSearch(mockSearchTerm, requestUid))
  });

  it('creates the FETCH_TRANSPORT_LINE_SEARCH_SUCCESS action correctly', () => {
    const mockSearchTerm = 'searchTermMock';

    const expectedAction = {
      type: actionTypes.FETCH_TRANSPORT_LINE_SEARCH_SUCCESS,
      searchTerm: mockSearchTerm,
      response: [],
    }

    expect(expectedAction)
      .toEqual(_fetchTransportLineSearchSuccess([], mockSearchTerm))
  });

  it('creates the FETCH_TRANSPORT_LINE_SEARCH_FAILURE action correctly', () => {
    const mockError = 'mockError';

    const expectedAction = {
      type: actionTypes.FETCH_TRANSPORT_LINE_SEARCH_FAILURE,
      error: mockError,
    }

    expect(expectedAction)
      .toEqual(_fetchTransportLineSearchFailure(mockError))
  });

  it('creates the FETCH_TRANSPORT_LINE_SEARCH_CLEAR action correctly', () => {
    const expectedAction = {
      type: actionTypes.FETCH_TRANSPORT_LINE_SEARCH_CLEAR,
    }

    expect(expectedAction)
      .toEqual(fetchTransportLineSearchClear())
  });

  // Thunk
  it('dispatches the correct actions if fetchTransportLineSearch succeeds', async () => {
    global.fetch = mockFetch(true, {
      payload: {
        aaData: [{}],
      }
    });

    const expectedActions = [
      actionTypes.FETCH_TRANSPORT_LINE_SEARCH_CLEAR,
      actionTypes.FETCH_TRANSPORT_LINE_SEARCH,
      actionTypes.FETCH_TRANSPORT_LINE_SEARCH_SUCCESS,
    ];

    await store.dispatch(fetchTransportLineSearch('775A'));
    const dispatchedActions = store.getActions().map(action => action.type);
    expect(dispatchedActions).toEqual(expectedActions);
  });

  it('dispatches the correct actions if fetchTransportLineSearch fails', async () => {
    const mockErrorMessage = 'Test error';
    global.fetch = mockFetch(false, { returnMessage: mockErrorMessage });

    const expectedActions = [
      actionTypes.FETCH_TRANSPORT_LINE_SEARCH_CLEAR,
      actionTypes.FETCH_TRANSPORT_LINE_SEARCH,
      actionTypes.FETCH_TRANSPORT_LINE_SEARCH_FAILURE
    ];

    try {
      await store.dispatch(fetchTransportLineSearch('775A'));
      done.fail();
    } catch (error) {
      const dispatchedActions = store.getActions().map(action => action.type);
      expect(expectedActions).toEqual(dispatchedActions);

      const failureAction = store.getActions().find(action => action.type === actionTypes.FETCH_TRANSPORT_LINE_SEARCH_FAILURE);
      expect(failureAction.error).toEqual(mockErrorMessage);
    }
  });

})