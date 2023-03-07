/* eslint-disable no-undef */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import actionTypes from "..";
import { uuidv4 } from "../../../../utils/uuid-util";
import { mockFetch } from '../../../../test-utils/fetch-helper';
import { initialState } from '../../../../redux/payment-method';

import {
  // Action creators
  _fetchArrivalForecast,
  _fetchArrivalForecastFailure,
  _fetchArrivalForecastSuccess,
  fetchArrivalForecastClear,

  // Thunks
  fetchArrivalForecast,
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

describe('Search points of interest actions > FETCH_ARRIVAL_FORECAST_*', () => {
  afterEach(() => {
    store.clearActions();
  });

  it('creates the FETCH_ARRIVAL_FORECAST action correctly', () => {
    const expectedAction = {
      type: actionTypes.FETCH_ARRIVAL_FORECAST,
    }

    expect(expectedAction)
      .toEqual(_fetchArrivalForecast())
  });

  it('creates the FETCH_ARRIVAL_FORECAST_SUCCESS action correctly', () => {
    const mockData = [];

    const expectedAction = {
      type: actionTypes.FETCH_ARRIVAL_FORECAST_SUCCESS,
      response: mockData,
    }

    expect(expectedAction)
      .toEqual(_fetchArrivalForecastSuccess(mockData))
  });

  it('creates the FETCH_ARRIVAL_FORECAST_FAILURE action correctly', () => {
    const mockError = 'mockError';

    const expectedAction = {
      type: actionTypes.FETCH_ARRIVAL_FORECAST_FAILURE,
      error: mockError,
    }

    expect(expectedAction)
      .toEqual(_fetchArrivalForecastFailure(mockError))
  });

  it('creates the FETCH_ARRIVAL_FORECAST_CLEAR action correctly', () => {
    const expectedAction = {
      type: actionTypes.FETCH_ARRIVAL_FORECAST_CLEAR,
    }

    expect(expectedAction)
      .toEqual(fetchArrivalForecastClear())
  });

  // // Thunks
  it('dispatches the correct actions if fetchArrivalForecast thunk succeeds', async () => {
    global.fetch = mockFetch(true, {
      payload: {
        aaData: [{}],
      }
    });

    const expectedActions = [
      actionTypes.FETCH_ARRIVAL_FORECAST,
      actionTypes.FETCH_ARRIVAL_FORECAST_SUCCESS,
    ];

    await store.dispatch(fetchArrivalForecast(1, 1));
    const dispatchedActions = store.getActions().map(action => action.type);
    expect(dispatchedActions).toEqual(expectedActions);
  })

  it('dispatches the correct actions if fetchArrivalForecast thunk fails', async () => {
    const mockErrorMessage = 'Test error';
    global.fetch = mockFetch(false, { returnMessage: mockErrorMessage });

    const expectedActions = [
      actionTypes.FETCH_ARRIVAL_FORECAST,
      actionTypes.FETCH_ARRIVAL_FORECAST_FAILURE,
    ];

    try {
      await store.dispatch(fetchArrivalForecast());
      done.fail();
    } catch (error) {
      const dispatchedActions = store.getActions().map(action => action.type);
      expect(expectedActions).toEqual(dispatchedActions);

      const failureAction = store.getActions().find(action => action.type === actionTypes.FETCH_ARRIVAL_FORECAST_FAILURE);
      expect(failureAction.error).toEqual(mockErrorMessage);
    }
  })
});