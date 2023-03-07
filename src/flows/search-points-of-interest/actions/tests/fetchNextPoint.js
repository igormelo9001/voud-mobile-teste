/* eslint-disable no-undef */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import actionTypes from "..";
import { uuidv4 } from "../../../../utils/uuid-util";
import { mockFetch } from '../../../../test-utils/fetch-helper';
import { initialState } from '../../../../redux/payment-method';

import {
  // Action creators
  _fetchNextPoint,
  _fetchNextPointFailure,
  _fetchNextPointSuccess,
  fetchNextPointClear,

  // Thunks
  fetchNextPoint,
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

describe('Search points of interest actions > FETCH_NEXT_POINT_*', () => {
  afterEach(() => {
    store.clearActions();
  });

  it('creates the FETCH_NEXT_POINT action correctly', () => {
    const expectedAction = {
      type: actionTypes.FETCH_NEXT_POINT,
    }

    expect(expectedAction)
      .toEqual(_fetchNextPoint())
  });

  it('creates the FETCH_NEXT_POINT_SUCCESS action correctly', () => {
    const mockData = [];

    const expectedAction = {
      type: actionTypes.FETCH_NEXT_POINT_SUCCESS,
      response: mockData,
    }

    expect(expectedAction)
      .toEqual(_fetchNextPointSuccess(mockData))
  });

  it('creates the FETCH_NEXT_POINT_FAILURE action correctly', () => {
    const mockError = 'mockError';

    const expectedAction = {
      type: actionTypes.FETCH_NEXT_POINT_FAILURE,
      error: mockError,
    }

    expect(expectedAction)
      .toEqual(_fetchNextPointFailure(mockError))
  });

  it('creates the FETCH_NEXT_POINT_CLEAR action correctly', () => {
    const expectedAction = {
      type: actionTypes.FETCH_NEXT_POINT_CLEAR,
    }

    expect(expectedAction)
      .toEqual(fetchNextPointClear())
  });

  // // Thunks
  it('dispatches the correct actions if fetchNextPoint thunk succeeds', async () => {
    global.fetch = mockFetch(true, {
      payload: {
        aaData: [{}],
      }
    });

    const expectedActions = [
      actionTypes.FETCH_NEXT_POINT,
      actionTypes.FETCH_NEXT_POINT_SUCCESS,
    ];

    await store.dispatch(fetchNextPoint(1));
    const dispatchedActions = store.getActions().map(action => action.type);
    expect(dispatchedActions).toEqual(expectedActions);
  })

  it('dispatches the correct actions if fetchNextPoint thunk fails', async () => {
    const mockErrorMessage = 'Test error';
    global.fetch = mockFetch(false, { returnMessage: mockErrorMessage });

    const expectedActions = [
      actionTypes.FETCH_NEXT_POINT,
      actionTypes.FETCH_NEXT_POINT_FAILURE,
    ];

    try {
      await store.dispatch(fetchNextPoint(1));
      done.fail();
    } catch (error) {
      const dispatchedActions = store.getActions().map(action => action.type);
      expect(expectedActions).toEqual(dispatchedActions);

      const failureAction = store.getActions().find(action => action.type === actionTypes.FETCH_NEXT_POINT_FAILURE);
      expect(failureAction.error).toEqual(mockErrorMessage);
    }
  })
});