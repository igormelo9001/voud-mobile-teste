import actionTypes from './types';
import { requestErrorHandler } from '../../../shared/request-error-handler';
import { voudRequest } from '../../../shared/services';

export default actionTypes;

// Synchronous actions

// Check Last Terms Accepted
export function fetchCheckLastTermsAcceptedInit() {
  return { type: actionTypes.CHECK_LAST_TERMS_ACCEPTED };
}

export function fetchCheckLastTermsAcceptedSuccess() {
  return { type: actionTypes.CHECK_LAST_TERMS_ACCEPTED_SUCCESS };
}

export function fetchCheckLastTermsAcceptedFailure(error, errorStatusCode) {
  return { type: actionTypes.CHECK_LAST_TERMS_ACCEPTED_FAILURE, error, errorStatusCode };
}

// AcceptCurrentTerms
export function fetchAcceptCurrentTermsInit() {
  return { type: actionTypes.ACCEPT_CURRENT_TERMS };
}

export function fetchAcceptCurrentTermsSuccess() {
  return { type: actionTypes.ACCEPT_CURRENT_TERMS_SUCCESS };
}

export function fetchAcceptCurrentTermsFailure(error) {
  return { type: actionTypes.ACCEPT_CURRENT_TERMS_FAILURE, error };
}

// Thunks

export function fetchCheckLastTermsAccepted() {
  return async (dispatch, getState) => {
    if (getState().usageTerms.checkLastTermsAccepted.isFetching) return;
    dispatch(fetchCheckLastTermsAcceptedInit());

    try {
      const response = await voudRequest('/customer/check-version-last-term', 'GET', null, true);
      dispatch(fetchCheckLastTermsAcceptedSuccess());
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message);
      if (!requestErrorHandler(dispatch, error, fetchCheckLastTermsAcceptedFailure(error.message, error.statusCode))) {
        throw error;
      }
    }
  }
}

export function fetchAcceptCurrentTerms() {
  return async dispatch => {
    dispatch(fetchAcceptCurrentTermsInit());

    try {
      const response = await voudRequest('/customer/accept-current-terms', 'GET', null, true);
      dispatch(fetchAcceptCurrentTermsSuccess());
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message);
      if (!requestErrorHandler(dispatch, error, fetchAcceptCurrentTermsFailure(error.message))) {
        throw error;
      }
    }
  }
}