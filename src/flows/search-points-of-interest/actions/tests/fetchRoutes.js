/* eslint-disable no-undef */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import actionTypes from "..";
import { uuidv4 } from "../../../../utils/uuid-util";
import { mockFetch } from '../../../../test-utils/fetch-helper';

import {
  // Action creators
  _fetchRoutes,
  _fetchRoutesFailure,
  _fetchRoutesSuccess,
  fetchRoutesClear,

  // Thunks
  fetchRoutes,
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

describe('Search points of interest actions > FETCH_ROUTES_*', () => {
  afterEach(() => {
    store.clearActions();
  });

  it('creates the FETCH_ROUTES action correctly', () => {
    const expectedAction = {
      type: actionTypes.FETCH_ROUTES,
    }

    expect(expectedAction)
      .toEqual(_fetchRoutes())
  });

  it('creates the FETCH_ROUTES_SUCCESS action correctly', () => {
    const mockData = [];

    const expectedAction = {
      type: actionTypes.FETCH_ROUTES_SUCCESS,
      response: mockData,
    }

    expect(expectedAction)
      .toEqual(_fetchRoutesSuccess(mockData))
  });

  it('creates the FETCH_ROUTES_FAILURE action correctly', () => {
    const mockError = 'mockError';

    const expectedAction = {
      type: actionTypes.FETCH_ROUTES_FAILURE,
      error: mockError,
    }

    expect(expectedAction)
      .toEqual(_fetchRoutesFailure(mockError))
  });

  it('creates the FETCH_ROUTES_CLEAR action correctly', () => {
    const expectedAction = {
      type: actionTypes.FETCH_ROUTES_CLEAR,
    }

    expect(expectedAction)
      .toEqual(fetchRoutesClear())
  });

  // // Thunks
  it('dispatches the correct actions if fetchRoutes thunk succeeds', async () => {
    global.fetch = mockFetch(true, {
      payload: {
        aaData: [{}],
      }
    });

    const expectedActions = [
      actionTypes.FETCH_ROUTES,
      actionTypes.FETCH_ROUTES_SUCCESS,
    ];

    await store.dispatch(fetchRoutes('a'));
    const dispatchedActions = store.getActions().map(action => action.type);
    expect(dispatchedActions).toEqual(expectedActions);
  })

  it('dispatches the correct actions if fetchRoutes thunk fails', async () => {
    const mockErrorMessage = 'Test error';
    global.fetch = mockFetch(false, { returnMessage: mockErrorMessage });

    const expectedActions = [
      actionTypes.FETCH_ROUTES,
      actionTypes.FETCH_ROUTES_FAILURE,
    ];

    try {
      await store.dispatch(fetchRoutes('a'));
      done.fail();
    } catch (error) {
      const dispatchedActions = store.getActions().map(action => action.type);
      expect(expectedActions).toEqual(dispatchedActions);

      const failureAction = store.getActions().find(action => action.type === actionTypes.FETCH_ROUTES_FAILURE);
      expect(failureAction.error).toEqual(mockErrorMessage);
    }
  })
});