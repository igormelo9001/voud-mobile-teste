/* eslint-disable no-undef */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import actionTypes, {
  // Action creators
    _fetchPlaceSearch,
    _fetchPlaceSearchFailure,
    _fetchPlaceSearchSuccess,
    clearPredictions,
  
    // Thunks
    fetchPlaceTextSearch,
    fetchPredictions,
    _fetchPredictions,
    _fetchPredictionsSuccess,
    _fetchPredictionsFailure
  } from '../../src/flows/mobility-services/actions';
  import { uuidv4 } from '../../src/utils/uuid-util';
  import { mockFetch } from '../../src/test-utils/fetch-helper';
  import { initialState } from '../../src/flows/mobility-services/reducer';

// Initialize redux store
const requestUid = uuidv4();
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  ...initialState,
  mobilityServices: {
    predictions: {
      sessionToken: '',
    }
  },
  profile: {
    position: {},
  }
});

describe('Search points of interest actions > FETCH_PREDICTIONS_*', () => {
  afterEach(() => {
    store.clearActions();
  });

  it('creates the FETCH_PREDICTIONS action correctly', () => {
    const expectedAction = {
      type: actionTypes.FETCH_PREDICTIONS,
    }

    expect(expectedAction)
      .toEqual(_fetchPredictions())
  });

  it('creates the FETCH_PREDICTIONS_SUCCESS action correctly', () => {
    const mockData = [];

    const expectedAction = {
      type: actionTypes.FETCH_PREDICTIONS_SUCCESS,
      response: mockData,
    }

    expect(expectedAction)
      .toEqual(_fetchPredictionsSuccess(mockData))
  });

  it('creates the FETCH_PREDICTIONS_FAILURE action correctly', () => {
    const mockError = 'mockError';

    const expectedAction = {
      type: actionTypes.FETCH_PREDICTIONS_FAILURE,
      error: mockError,
    }

    expect(expectedAction)
      .toEqual(_fetchPredictionsFailure(mockError))
  });

  it('creates the FETCH_PREDICTIONS_CLEAR action correctly', () => {
    const expectedAction = {
      type: actionTypes.PREDICTIONS_CLEAR,
    }

    expect(expectedAction)
      .toEqual(clearPredictions())
  });

  // Thunks
  it('dispatches the correct actions if fetchPredictions thunk succeeds', async () => {
    global.fetch = mockFetch(true, {
      payload: '',
      status: 'OK',
    });

    const expectedActions = [
      actionTypes.FETCH_PREDICTIONS,
      actionTypes.SET_PREDICTIONS_SESSION_TOKEN,
      actionTypes.FETCH_PREDICTIONS_SUCCESS,
    ];

    await store.dispatch(fetchPredictions('a'));
    const dispatchedActions = store.getActions().map(action => action.type);
    expect(dispatchedActions).toEqual(expectedActions);
  })

  it('dispatches the correct actions if fetchPredictions thunk fails', async () => {
    const mockErrorMessage = '';
    global.fetch = mockFetch(false, { returnMessage: mockErrorMessage });

    const expectedActions = [
      actionTypes.FETCH_PREDICTIONS,
      actionTypes.SET_PREDICTIONS_SESSION_TOKEN,
      actionTypes.FETCH_PREDICTIONS_FAILURE,
    ];

    try {
      await store.dispatch(fetchPredictions('a'));
      done.fail(mockErrorMessage);
    } catch (error) {
      const dispatchedActions = store.getActions().map(action => action.type);
      expect(expectedActions).toEqual(dispatchedActions);

      const failureAction = store.getActions().find(action => action.type === actionTypes.FETCH_PREDICTIONS_FAILURE);

      expect(failureAction.error).toEqual(mockErrorMessage);
    }
  })
});