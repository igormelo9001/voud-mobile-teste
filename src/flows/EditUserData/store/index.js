// NPM imports
import Moment from 'moment';

// VouD imports
import { voudRequest } from '../../../shared/services';
import { persistProfile, clearProfileStorage } from '../../../redux/profile';
import { requestErrorHandler } from '../../../shared/request-error-handler';

// Actions
const EDIT_USER_DATA = 'voud/profile/EDIT_USER_DATA';
const EDIT_USER_DATA_SUCCESS = 'voud/profile/EDIT_USER_DATA_SUCCESS';
const EDIT_USER_DATA_FAILURE = 'voud/profile/EDIT_USER_DATA_FAILURE';
const EDIT_USER_DATA_CLEAR = 'voud/profile/EDIT_USER_DATA_CLEAR';
const EDIT_USER_BLOCKED = 'voud/profile/EDIT_USER_BLOCKED';

const EDIT_USER_COUNT_ATTEMPT = 'voud/profile/EDIT_USER_COUNT_ATTEMPT';

export const userEditActions = {
  EDIT_USER_DATA_SUCCESS,
  EDIT_USER_BLOCKED,
};

// Reducer
const initialState = {
  personalData: {
    isFetching: false,
    error: '',
    countAttempt: 0,
    forceUpdateSucess: false,
  },
};

function reducer(state = initialState, action) {
  switch (action.type) {
    // Edit personal data
    case EDIT_USER_DATA:
      return {
        ...state,
        personalData: {
          isFetching: true,
          error: '',
        },
      };
    case EDIT_USER_DATA_FAILURE:
      return {
        ...state,
        personalData: {
          isFetching: false,
          error: action.error,
          countAttempt: action.countAttempt + 1,
        },
      };
    case EDIT_USER_DATA_SUCCESS:
      return {
        ...state,
        personalData: {
          isFetching: false,
          error: '',
          forceUpdateSucess: true,
        },
      };
    case EDIT_USER_DATA_CLEAR:
      return {
        ...state,
        personalData: {
          isFetching: false,
          error: '',
          forceUpdateSucess: false,
        },
      };
    case EDIT_USER_COUNT_ATTEMPT:
      return {
        ...state,
        personalData: {
          isFetching: false,
          error: '',
          countAttempt: 1,
          forceUpdateSucess: false,
        },
      };

    default:
      return state;
  }
}

export default reducer;

// Edit name actions
function editPersonalData() {
  return {
    type: EDIT_USER_DATA,
  };
}

function editPersonalDataSuccess(response) {
  return {
    type: EDIT_USER_DATA_SUCCESS,
    response,
  };
}

function editPersonalDataFailure(error, countAttempt) {
  return {
    type: EDIT_USER_DATA_FAILURE,
    error,
    countAttempt,
  };
}
export function editPersonalDataClear() {
  return {
    type: EDIT_USER_DATA_CLEAR,
  };
}

function editUserBlocked(response) {
  return {
    type: EDIT_USER_BLOCKED,
    response,
  };
}

export function setEditCountAttempt(numberOfAttempts) {
  return {
    type: EDIT_USER_COUNT_ATTEMPT,
    numberOfAttempts,
  };
}

export function fetchEditPersonalData(
  name,
  lastName,
  birthDate,
  mobile,
  email,
  motherName,
  countAttempt
) {
  return async (dispatch, getState) => {
    // dispatch request action
    dispatch(editPersonalData());

    try {
      const requestBody = {
        name,
        lastName,
        birthDate: Moment(birthDate, 'DDMMYYYY').format('YYYY-MM-DD'),
        mobile,
        email,
        motherName,
        isUpdateAddress: false,
      };

      const response = await voudRequest('/customer/update', 'POST', requestBody, true);
      clearProfileStorage();

      if (!response.payload.isBlocked && !response.payload.forceUpdateProfile) {
        dispatch(editPersonalDataSuccess(response));
        persistProfile(getState());
      } else if (response.payload.isBlocked) {
        dispatch(editUserBlocked(response));
      } else if (response.payload.forceUpdateProfile) {
        dispatch(editPersonalDataFailure(`Dados incorretos.`, countAttempt));
      }
    } catch (error) {
      if (!requestErrorHandler(dispatch, error, editPersonalDataFailure(error.message))) {
        throw error;
      }
    }
  };
}
