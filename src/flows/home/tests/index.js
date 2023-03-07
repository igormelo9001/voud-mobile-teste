/* eslint-disable no-undef */
// actions
import {
  _fetchDynamicPoints,
  _fetchDynamicPointsFailure,
  _fetchDynamicPointsSuccess,
  _fetchPointsOfInterest,
  _fetchPointsOfInterestFailure,
  _fetchPointsOfInterestSuccess
} from '../actions';

import pointsOfInterestReducer, { initialState } from '../reducer';
import { uuidv4 } from '../../../utils/uuid-util';

describe('PointsOfInterest reducer', () => {
  // Fetch Points Of Interest
  it('returns the correct state on _fetchPointsOfInterest init action', () => {
    const requestUid = uuidv4();

    const expectedState = {
      ...initialState,
      staticPoints: {
        ...initialState.staticPoints,
        isFetching: true,
        error: null,
        lastRequestUid: requestUid,
      },
    };

    const newState = pointsOfInterestReducer(initialState, _fetchPointsOfInterest(requestUid));
    expect(expectedState).toEqual(newState);
  });

  it('returns the correct state on _fetchPointsOfInterest success action', () => {
    const requestUid = uuidv4();

    const mockInitialState = {
      ...initialState,
      staticPoints: {
        ...initialState.staticPoints,
        lastRequestUid: requestUid,
      }
    }

    const mockExpectedState = {
      ...initialState,
      staticPoints: {
        ...initialState.staticPoints,
        isFetching: false,
        lastRequestUid: requestUid,
      },
      data: [],
    }

    const newState = pointsOfInterestReducer(mockInitialState, _fetchPointsOfInterestSuccess([]));
    expect(mockExpectedState).toEqual(newState);
  });

  it('returns the correct state on _fetchPointsOfInterest failure action', () => {
    const mockErrorMessage = "MockError";

    const mockExpectedState = {
      ...initialState,
      staticPoints: {
        ...initialState.staticPoints,
        isFetching: false,
        error: mockErrorMessage,
      }
    }

    const newState = pointsOfInterestReducer(initialState, _fetchPointsOfInterestFailure(mockErrorMessage))
    expect(mockExpectedState).toEqual(newState);
  })

  // Fetch Dynamic points reducer
  it('returns the correct state on _fetchDynamicPoints init action', () => {
    const requestUid = uuidv4();

    const expectedState = {
      ...initialState,
      dynamicPoints: {
        ...initialState.dynamicPoints,
        isFetching: true,
        error: null,
        lastRequestUid: requestUid,
      }
    };

    const newState = pointsOfInterestReducer(initialState, _fetchDynamicPoints(requestUid));
    expect(expectedState).toEqual(newState);
  });

  it('returns the correct state on _fetchDynamicPoints success action', () => {
    const requestUid = uuidv4();

    const mockInitialState = {
      ...initialState,
      dynamicPoints: {
        ...initialState.dynamicPoints,
        lastRequestUid: requestUid,
      }
    }

    const mockExpectedState = {
      ...initialState,
      dynamicPoints: {
        ...initialState.dynamicPoints,
        isFetching: false,
        lastRequestUid: requestUid,
      },
      data: [],
    }

    const newState = pointsOfInterestReducer(mockInitialState, _fetchDynamicPointsSuccess([]));
    expect(mockExpectedState).toEqual(newState);
  });

  it('returns the correct state on _fetchDynamicPoints failure action', () => {
    const mockErrorMessage = "MockError";

    const mockExpectedState = {
      ...initialState,
      dynamicPoints: {
        ...initialState.dynamicPoints,
        isFetching: false,
        error: mockErrorMessage,
      }
    }

    const newState = pointsOfInterestReducer(initialState, _fetchDynamicPointsFailure(mockErrorMessage))
    expect(mockExpectedState).toEqual(newState);
  });
})