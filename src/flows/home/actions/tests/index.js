/* eslint-disable no-undef */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { initialState } from '../../reducer';
import actionTypes from '..';
import { mockFetch } from '../../../../test-utils/fetch-helper';

import { uuidv4 } from '../../../../utils/uuid-util';
import {
  _fetchPointsOfInterest,
  _fetchPointsOfInterestSuccess,
  _fetchPointsOfInterestFailure,
  fetchPointsOfInterest,
  fetchPointsOfInterestClear,
  _fetchDynamicPoints,
  _fetchDynamicPointsFailure,
  _fetchDynamicPointsSuccess,
  fetchDynamicPoints
} from '../points-of-interest';

// Initialize Redux Store
const requestUid = uuidv4();
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  pointsOfInterest: {
    ...initialState,
    staticPoints: {
      ...initialState.staticPoints,
      lastRequestUid: requestUid,
    },
    dynamicPoints: {
      ...initialState.dynamicPoints,
      lastRequestUid: requestUid,
    },
    data: []
  }
});

describe('PointsOfInterest Actions', () => {
  afterEach(() => {
    store.clearActions();
  });

  // fetchPointsOfInterest
  it('creates the fetchPointsOfInterest init action correctly', () => {
    const expectedFetchPointsOfInterestAction = {
      type: actionTypes.FETCH_POINTS_OF_INTEREST,
      uid: requestUid,
    }

    expect(expectedFetchPointsOfInterestAction)
      .toEqual(_fetchPointsOfInterest(requestUid))
  });

  it('creates the fetchPointsOfInterest success action correctly', () => {
    const expectedFetchPointsOfInterestSuccessAction = {
      type: actionTypes.FETCH_POINTS_OF_INTEREST_SUCCESS,
      data: [],
    }

    expect(expectedFetchPointsOfInterestSuccessAction)
      .toEqual(_fetchPointsOfInterestSuccess([]))
  });

  it('creates the fetchPointsOfInterest failure action correctly', () => {
    const mockErrorMessage = 'Test error';

    const expectedFetchPointsOfInterestFailureAction = {
      type: actionTypes.FETCH_POINTS_OF_INTEREST_FAILURE,
      error: mockErrorMessage,
    }

    expect(expectedFetchPointsOfInterestFailureAction)
      .toEqual(_fetchPointsOfInterestFailure(mockErrorMessage))
  });

  it('creates the fetchPointsOfInterest clear action correctly', () => {
    const expectedFetchPointsOfInterestClearAction = {
      type: actionTypes.FETCH_POINTS_OF_INTEREST_CLEAR,
    }

    expect(expectedFetchPointsOfInterestClearAction)
      .toEqual(fetchPointsOfInterestClear())
  });

  it('dispatches the correct actions if fetchPointsOfInterest action thunk succeeds', async () => {
    global.fetch = mockFetch(true, {
      payload: {
        aaData: [{}],
      }
    });

    const expectedActions = [
      actionTypes.FETCH_POINTS_OF_INTEREST,
      actionTypes.FETCH_POINTS_OF_INTEREST_SUCCESS,
    ];

    await store.dispatch(fetchPointsOfInterest());

    const dispatchedActions = store.getActions().map(action => action.type);

    expect(dispatchedActions).toEqual(expectedActions);
  });

  it('dispatches the correct actions if fetchPointsOfInterest action thunk fails', async () => {
    const mockErrorMessage = 'Test error';
    const mockErrorStatusCode = 403;
    global.fetch = mockFetch(false, { returnMessage: mockErrorMessage }, mockErrorStatusCode);

    const expectedActions = [
      actionTypes.FETCH_POINTS_OF_INTEREST,
      actionTypes.FETCH_POINTS_OF_INTEREST_FAILURE,
    ];

    try {
      await store.dispatch(fetchPointsOfInterest());
    } catch (error) {
      const dispatchedActions = store.getActions().map(action => action.type);
      expect(expectedActions).toEqual(dispatchedActions);

      const failureAction = store.getActions().find(action => action.type === actionTypes.FETCH_POINTS_OF_INTEREST_FAILURE);
      expect(failureAction.error).toEqual(mockErrorMessage);
      expect(failureAction.errorStatusCode).toEqual(mockErrorStatusCode);
    }
  });


  // _fetchDynamicPoints
  it('creates the fetchDynamicPoints init action correctly', () => {
    const expectedFetchDynamicPointsAction = {
      type: actionTypes.FETCH_DYNAMIC_POINTS,
      uid: requestUid,
    }

    expect(expectedFetchDynamicPointsAction)
      .toEqual(_fetchDynamicPoints(requestUid))
  });

  it('creates the fetchDynamicPoints success action correctly', () => {
    const expectedFetchDynamicPointsAction = {
      type: actionTypes.FETCH_DYNAMIC_POINTS_SUCCESS,
      data: [],
    }

    expect(expectedFetchDynamicPointsAction)
      .toEqual(_fetchDynamicPointsSuccess([]))
  });

  it('creates the fetchDynamicPoints failure action correctly', () => {
    const mockErrorMessage = 'Test error';

    const expectedFetchDynamicPointsAction = {
      type: actionTypes.FETCH_DYNAMIC_POINTS_FAILURE,
      error: mockErrorMessage,
    }

    expect(expectedFetchDynamicPointsAction)
      .toEqual(_fetchDynamicPointsFailure(mockErrorMessage))
  });

  it('dispatches the correct actions if fetchDynamicPoints action thunk succeeds', async () => {
    global.fetch = mockFetch(true, {
      payload: []
    });

    const expectedActions = [
      actionTypes.FETCH_DYNAMIC_POINTS,
      actionTypes.FETCH_DYNAMIC_POINTS_SUCCESS,
    ];

    await store.dispatch(fetchDynamicPoints());

    const dispatchedActions = store.getActions().map(action => action.type);
    expect(dispatchedActions).toEqual(expectedActions);
  });

  it('dispatches the correct actions if fetchPointsOfInterest action thunk fails', async () => {
    const mockErrorMessage = 'Test error';
    const mockErrorStatusCode = 403;
    global.fetch = mockFetch(false, { returnMessage: mockErrorMessage }, mockErrorStatusCode);

    const expectedActions = [
      actionTypes.FETCH_DYNAMIC_POINTS,
      actionTypes.FETCH_DYNAMIC_POINTS_FAILURE,
    ];

    try {
      await store.dispatch(fetchDynamicPoints());
    } catch (error) {
      const dispatchedActions = store.getActions().map(action => action.type);
      expect(expectedActions).toEqual(dispatchedActions);

      const failureAction = store.getActions().find(action => action.type === actionTypes.FETCH_DYNAMIC_POINTS_FAILURE);
      expect(failureAction.error).toEqual(mockErrorMessage);
      expect(failureAction.errorStatusCode).toEqual(mockErrorStatusCode);
    }
  });
})