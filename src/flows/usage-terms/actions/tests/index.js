/* eslint-disable no-undef */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  fetchCheckLastTermsAccepted,
  fetchCheckLastTermsAcceptedInit,
  fetchCheckLastTermsAcceptedSuccess,
  fetchCheckLastTermsAcceptedFailure,
  fetchAcceptCurrentTerms,
  fetchAcceptCurrentTermsInit,
  fetchAcceptCurrentTermsSuccess,
  fetchAcceptCurrentTermsFailure
} from '../index';
import usageTermsActions from '../types';
import { mockFetch } from '../../../../test-utils/fetch-helper';
import { initialState } from '../../reducer';


// Initialize Redux Store
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  usageTerms: initialState
});

describe('UsageTerms Actions', () => {

  afterEach(() => {
    store.clearActions();
  });

  // fetchCheckLastTermsAccepted

  it('creates fetchCheckLastTermsAccepted action correctly', () => {
    const expectedAction =  { type: usageTermsActions.CHECK_LAST_TERMS_ACCEPTED };
    expect(expectedAction).toEqual(fetchCheckLastTermsAcceptedInit());
  });

  it('creates fetchCheckLastTermsAccepted success action correctly', () => {
    const expectedSuccessAction =  { type: usageTermsActions.CHECK_LAST_TERMS_ACCEPTED_SUCCESS };
    expect(expectedSuccessAction).toEqual(fetchCheckLastTermsAcceptedSuccess());
  });

  it('creates fetchCheckLastTermsAccepted failure action correctly', () => {
    const mockErrorMessage = 'Test error';
    const mockErrorStatusCode = 403;
    const expectedFailureAction =  { type: usageTermsActions.CHECK_LAST_TERMS_ACCEPTED_FAILURE, error: mockErrorMessage, errorStatusCode: mockErrorStatusCode };
    expect(expectedFailureAction).toEqual(fetchCheckLastTermsAcceptedFailure(mockErrorMessage, mockErrorStatusCode));
  });

  it('dispatches the correct actions if fetchCheckLastTermsAccepted action thunk succeeded', async () => {
    global.fetch = mockFetch(true, {});
    const expectedActions = [
      usageTermsActions.CHECK_LAST_TERMS_ACCEPTED,
      usageTermsActions.CHECK_LAST_TERMS_ACCEPTED_SUCCESS
    ];

    await store.dispatch(fetchCheckLastTermsAccepted());

    const actualActions = store.getActions().map(action => action.type);
    expect(expectedActions).toEqual(actualActions);
  });

  it('dispatches the correct actions if fetchCheckLastTermsAccepted action thunk failed', async done => {
    const mockErrorMessage = 'Test error';
    const mockErrorStatusCode = 403;
    global.fetch = mockFetch(false, { returnMessage: mockErrorMessage }, mockErrorStatusCode);
    const expectedActions = [
      usageTermsActions.CHECK_LAST_TERMS_ACCEPTED,
      usageTermsActions.CHECK_LAST_TERMS_ACCEPTED_FAILURE
    ];

    try {
      await store.dispatch(fetchCheckLastTermsAccepted());
    } catch (error) {
      const actualActions = store.getActions().map(action => action.type);
      expect(expectedActions).toEqual(actualActions);

      const failureAction = store.getActions().find(action => action.type === usageTermsActions.CHECK_LAST_TERMS_ACCEPTED_FAILURE);
      expect(failureAction.error).toEqual(mockErrorMessage);
      expect(failureAction.errorStatusCode).toEqual(mockErrorStatusCode);
    }

    done();
  });

  // fetchAcceptCurrentTerms

  it('creates fetchAcceptCurrentTerms action correctly', () => {
    const expectedAction =  { type: usageTermsActions.ACCEPT_CURRENT_TERMS };
    expect(expectedAction).toEqual(fetchAcceptCurrentTermsInit());
  });

  it('creates fetchAcceptCurrentTerms success action correctly', () => {
    const expectedSuccessAction =  { type: usageTermsActions.ACCEPT_CURRENT_TERMS_SUCCESS };
    expect(expectedSuccessAction).toEqual(fetchAcceptCurrentTermsSuccess());
  });

  it('creates fetchAcceptCurrentTerms failure action correctly', () => {
    const mockErrorMessage = 'Test error';
    const expectedFailureAction =  { type: usageTermsActions.ACCEPT_CURRENT_TERMS_FAILURE, error: mockErrorMessage };
    expect(expectedFailureAction).toEqual(fetchAcceptCurrentTermsFailure(mockErrorMessage));
  });

  it('dispatches the correct actions if fetchAcceptCurrentTerms action thunk succeeded', async () => {
    global.fetch = mockFetch(true, {});
    const expectedActions = [
      usageTermsActions.ACCEPT_CURRENT_TERMS,
      usageTermsActions.ACCEPT_CURRENT_TERMS_SUCCESS
    ];

    await store.dispatch(fetchAcceptCurrentTerms());

    const actualActions = store.getActions().map(action => action.type);
    expect(expectedActions).toEqual(actualActions);
  });

  it('dispatches the correct actions if fetchAcceptCurrentTerms action thunk failed', async done => {
    const mockErrorMessage = 'Test error';
    global.fetch = mockFetch(false, { returnMessage: mockErrorMessage });
    const expectedActions = [
      usageTermsActions.ACCEPT_CURRENT_TERMS,
      usageTermsActions.ACCEPT_CURRENT_TERMS_FAILURE
    ];

    try {
      await store.dispatch(fetchAcceptCurrentTerms());
      done.fail();
    } catch (error) {
      const actualActions = store.getActions().map(action => action.type);
      expect(expectedActions).toEqual(actualActions);

      const failureAction = store.getActions().find(action => action.type === usageTermsActions.ACCEPT_CURRENT_TERMS_FAILURE);
      expect(failureAction.error).toEqual(mockErrorMessage);
    }

    done();
  });

});