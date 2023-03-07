export const testInitRequestAction = (initialState, reducerFn, stateName, action, addErrorStatusCode = false) => {
  const expectedState = {
    ...initialState,
    [stateName]: {
      ...initialState[stateName],
      isFetching: true,
      error: '',
      ...(addErrorStatusCode ? { errorStatusCode: null } : {})
    }
  };
  const newState = reducerFn(initialState, action());
  expect(expectedState).toEqual(newState);
}

export const testFailedRequestAction = (initialState, reducerFn, stateName, action, addErrorStatusCode = false) => {
  const mockErrorMessage = 'Test error';
  const mockErrorStatusCode = 123;
  const expectedState = {
    ...initialState,
    [stateName]: {
      ...initialState.stateName,
      isFetching: false,
      error: mockErrorMessage,
      ...(addErrorStatusCode ? { errorStatusCode: mockErrorStatusCode } : {})
    }
  };
  const newState = reducerFn(initialState, action(mockErrorMessage, mockErrorStatusCode));
  expect(expectedState).toEqual(newState);
}

export const testSucceededRequestAction = (initialState, reducerFn, stateName, action, addErrorStatusCode = false) => {
  const mockInitialState = {
    ...initialState,
    [stateName]: {
      ...initialState[stateName],
      isFetching: true,
      error: '',
      ...(addErrorStatusCode ? { errorStatusCode: null } : {})
    }
  };
  const expectedState = {
    ...initialState,
    [stateName]: {
      ...initialState[stateName],
      isFetching: false,
      error: '',
      ...(addErrorStatusCode ? { errorStatusCode: null } : {})
    }
  };
  const newState = reducerFn(mockInitialState, action());
  expect(expectedState).toEqual(newState);
}