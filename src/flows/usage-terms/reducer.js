// NPM imports
import { createSelector } from 'reselect';

// VouD imports
import actionTypes from './actions';
import { extractRequestUI } from '../../redux/utils';

// Reducer
export const initialState = {
  checkLastTermsAccepted: {
    isFetching: false,
    error: '',
    errorStatusCode: null
  },
  acceptCurrentTerms: {
    isFetching: false,
    error: '',
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // checkLastTermsAccepted
    case actionTypes.CHECK_LAST_TERMS_ACCEPTED:
      return {
        ...state,
        checkLastTermsAccepted: {
          ...state.checkLastTermsAccepted,
          isFetching: true,
        },
      };

    case actionTypes.CHECK_LAST_TERMS_ACCEPTED_SUCCESS:
      return {
        ...state,
        checkLastTermsAccepted: {
          ...state.checkLastTermsAccepted,
          isFetching: false,
          error: '',
          errorStatusCode: null,
        },
      };

    case actionTypes.CHECK_LAST_TERMS_ACCEPTED_FAILURE:
      return {
        ...state,
        checkLastTermsAccepted: {
          ...state.checkLastTermsAccepted,
          isFetching: false,
          error: action.error,
          errorStatusCode: action.errorStatusCode,
        },
      };

    // acceptCurrentTerms
    case actionTypes.ACCEPT_CURRENT_TERMS:
      return {
        ...state,
        acceptCurrentTerms: {
          ...state.acceptCurrentTerms,
          isFetching: true,
          error: '',
        },
      };

    case actionTypes.ACCEPT_CURRENT_TERMS_SUCCESS:
      return {
        ...state,
        acceptCurrentTerms: {
          ...state.acceptCurrentTerms,
          isFetching: false,
          error: '',
        },
      };

    case actionTypes.ACCEPT_CURRENT_TERMS_FAILURE:
      return {
        ...state,
        acceptCurrentTerms: {
          ...state.acceptCurrentTerms,
          isFetching: false,
          error: action.error,
        },
      };

    // Default
    default:
      return state;
  }
}

// Selectors

export const usageTermsSelector = (state) => state.usageTerms;

export const getCheckLastTermsAcceptedUi = createSelector(
  usageTermsSelector,
  usageTermsState => extractRequestUI(usageTermsState.checkLastTermsAccepted),
);

export const getAcceptCurrentTermsUi = createSelector(
  usageTermsSelector,
  usageTermsState => extractRequestUI(usageTermsState.acceptCurrentTerms),
);
