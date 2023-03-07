// NPM imports
import { 
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

// VouD imports
import { requestErrorHandler } from '../shared/request-error-handler';

// consts

export const fbStatusCode = {
  FB_ACCOUNT_NOT_LINKED: '401002',
  FB_ID_NOT_COMPATIBLE: '401004',
  INVALID_ACCESS_TOKEN: '401005',
  ACCESS_TOKEN_BELONGS_TO_ANOTHER_APP: '401006',
  FB_CONNECTION_FAILED: '401007'
};

const fbPermissions = {
  PUBLIC_PROFILE: 'public_profile',
  EMAIL: 'email'
};

const hasFBPermission = (permissionsList, permission) => permissionsList.some(el => el === permission);

// Actions
const LOGIN = 'voud/facebook/LOGIN';
const LOGIN_SUCCESS = 'voud/facebook/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'voud/facebook/LOGIN_FAILURE';
const LOGIN_CLEAR = 'voud/facebook/LOGIN_CLEAR';

// Reducer
const initialState = {
  login: {
    isFetching: false,
    error: '',
    data: {}
  },
};

function reducer(state = initialState, action) {

  switch (action.type) {
    // LOGIN
    case LOGIN:
      return {
        ...state,
        login: {
          ...state.login,
          isFetching: true,
          error: '',
          data: {}
        }
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        login: {
          ...state.login,
          isFetching: false,
          error: '',
          data: {
            fbId: action.response.id,
            name: action.response.first_name,
            lastName: action.response.last_name,
            email: action.response.email,
            accessToken: action.response.accessToken,
          }
        }
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        login: {
          ...state.login,
          isFetching: false,
          error: action.error
        }
      };
    case LOGIN_CLEAR:
      return {
        ...state,
        login: {
          ...state.login,
          isFetching: false,
          error: ''
        }
      };

    default:
      return state;
  }
}

export default reducer;

// Actions creators

// LOGIN ACTIONS
function loginFB() {
  return { type: LOGIN };
}
function loginFBSuccess(response) {
  return {
    type: LOGIN_SUCCESS,
    response
  };
}
function loginFBFailure(error) {
  return {
    type: LOGIN_FAILURE,
    error
  };
}
export function loginFBClear() {
  return { type: LOGIN_CLEAR };
}

// thunk action creators
function _getUserInfoRequest() {
  return new Promise((resolve, reject) => {
    const infoRequest = new GraphRequest(
      '/me?fields=id,first_name,last_name,email',
      null,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  });
}


export function fetchFBLogin() {

  return async dispatch => {
    dispatch(loginFB());

    try {
      let accessTokenResponse = await AccessToken.getCurrentAccessToken();
      if (accessTokenResponse) {
        LoginManager.logOut();
      }

      const loginFBResponse = await LoginManager.logInWithPermissions([fbPermissions.PUBLIC_PROFILE, fbPermissions.EMAIL]);
      if (__DEV__) console.tron.log(loginFBResponse);

      const { grantedPermissions } = loginFBResponse;

      if (!grantedPermissions || !hasFBPermission(grantedPermissions, fbPermissions.PUBLIC_PROFILE) ||
        !hasFBPermission(grantedPermissions, fbPermissions.EMAIL)) {
          throw new Error('As permissões de perfil público e e-mail são necessárias para logar.');
      }

      const userInfoResponse = await _getUserInfoRequest();
      if (__DEV__) console.tron.log(userInfoResponse);

      accessTokenResponse = await AccessToken.getCurrentAccessToken();
      if (__DEV__) console.tron.log(accessTokenResponse);

      dispatch(loginFBSuccess({
        ...userInfoResponse,
        accessToken: accessTokenResponse.accessToken
      }));
    }
    catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (!requestErrorHandler(dispatch, error, loginFBFailure(error.message))) {
        throw error;
      }
    }
  }
}