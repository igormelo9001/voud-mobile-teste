/* eslint-disable no-undef */
import { 
  fetchCheckLastTermsAcceptedInit,
  fetchCheckLastTermsAcceptedSuccess,
  fetchCheckLastTermsAcceptedFailure,
  fetchAcceptCurrentTermsInit,
  fetchAcceptCurrentTermsSuccess,
  fetchAcceptCurrentTermsFailure,
} from '../actions';
import usageTermsReducer, { initialState } from '../reducer';
import { testInitRequestAction, testFailedRequestAction, testSucceededRequestAction } from '../../../test-utils/request-actions-helper';

describe('Report Reducer', () => {

  // fetchCheckLastTermsAccepted

  it('returns the correct state on checkLastTermsAccepted action', () => {
    testInitRequestAction(initialState, usageTermsReducer, 'checkLastTermsAccepted', fetchCheckLastTermsAcceptedInit, true);
  });

  it('returns the correct state on checkLastTermsAccepted report failure action', () => {
    testFailedRequestAction(initialState, usageTermsReducer, 'checkLastTermsAccepted', fetchCheckLastTermsAcceptedFailure, true)
  });

  it('returns the correct state on checkLastTermsAccepted report success action', () => {
    testSucceededRequestAction(initialState, usageTermsReducer, 'checkLastTermsAccepted', fetchCheckLastTermsAcceptedSuccess, true);
  });

  // acceptCurrentTerms

  it('returns the correct state on acceptCurrentTerms action', () => {
    testInitRequestAction(initialState, usageTermsReducer, 'acceptCurrentTerms', fetchAcceptCurrentTermsInit);
  });

  it('returns the correct state on acceptCurrentTerms failure action', () => {
    testFailedRequestAction(initialState, usageTermsReducer, 'acceptCurrentTerms', fetchAcceptCurrentTermsFailure);
  });

  it('returns the correct state on acceptCurrentTerms success action', () => {
    testSucceededRequestAction(initialState, usageTermsReducer, 'acceptCurrentTerms', fetchAcceptCurrentTermsSuccess);
  });

});