import { Platform  } from 'react-native';
import firebase from "react-native-firebase";

import { loginActions } from './login';
import { requestErrorHandler } from '../shared/request-error-handler';
import { voudRequest } from '../shared/services';
import { getUnreadNotificationCount, getIsLoggedIn } from './selectors';
import { navigateFromHome } from './nav';
import { routeNames } from '../shared/route-names';

// Consts
export const notificationTypes = {
  ALERT: 'ALERT',
  CAMPAIGN_MGM: 'CAMPAIGN_MGM',
  PARTNER: 'PARTNER',
};

// Actions
const GET_NOTIFICATIONS = 'voud/notifications/GET_NOTIFICATIONS';
const GET_NOTIFICATIONS_SUCCESS = 'voud/notifications/GET_NOTIFICATIONS_SUCCESS';
const GET_NOTIFICATIONS_FAILURE = 'voud/notifications/GET_NOTIFICATIONS_FAILURE';

const ADD_NOTIFICATION = 'voud/notifications/ADD_NOTIFICATION';

const MARK_NOTIFICATION_AS_READ = 'voud/notifications/MARK_NOTIFICATION_AS_READ';
const MARK_NOTIFICATION_AS_READ_SUCCESS = 'voud/notifications/MARK_NOTIFICATION_AS_READ_SUCCESS';
const MARK_NOTIFICATION_AS_READ_FAILURE = 'voud/notifications/MARK_NOTIFICATION_AS_READ_FAILURE';

export const REMOVE_NOTIFICATION = 'voud/notifications/REMOVE_NOTIFICATION';
export const REMOVE_NOTIFICATION_SUCCESS = 'voud/notifications/REMOVE_NOTIFICATION_SUCCESS';
export const REMOVE_NOTIFICATION_FAILURE = 'voud/notifications/REMOVE_NOTIFICATION_FAILURE';

// Initial state
export const initialState = {
  notificationList: {
    isFetching: false,
    error: '',
    data: [],
  },
  markAsRead: {
    isFetching: false,
    error: '',
  },
  remove: {
    isFetching: false,
    error: '',
  },
};

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_NOTIFICATIONS: {
      return {
        ...state,
        notificationList: {
          ...state.notificationList,
          isFetching: true,
          error: '',
        },
      }
    }

    case GET_NOTIFICATIONS_SUCCESS: {
      return {
        ...state,
        notificationList: {
          ...state.notificationList,
          isFetching: false,
          data: action.response.payload ? action.response.payload.map(el => {
            const existingNotification = state.notificationList.data.find(notif => notif.id === el.id);
            return {
              ...el,
              read: existingNotification ? existingNotification.read : el.read
            }
          }) : [],
        },
      }
    }

    case GET_NOTIFICATIONS_FAILURE: {
      return {
        ...state,
        notificationList: {
          ...state.notificationList,
          isFetching: false,
          error: action.error,
        }
      }
    }

    case loginActions.LOGOUT: {
      return {
        ...state,
        notificationList: {
          ...state.notificationList,
          data: [],
        },
      }
    }

    case ADD_NOTIFICATION: {
      return {
        ...state,
        notificationList: {
          ...state.notificationList,
          data: state.notificationList.data.find(el => action.data && action.data.id === el.id) ?
          state.notificationList.data : [{ ...action.data }, ...state.notificationList.data],
        },
      }
    }

    case MARK_NOTIFICATION_AS_READ: {
      return {
        ...state,
        notificationList: {
          ...state.notificationList,
          data: state.notificationList && state.notificationList.data.map(el => {
            if (el.id === action.id) {
              el.read = action.read;
            }
            return el;
          })
        },
        markAsRead: {
          isFetching: true,
          error: ''
        }
      };
    }

    case MARK_NOTIFICATION_AS_READ_SUCCESS: {
      return {
        ...state,
        markAsRead: {
          isFetching: false,
          error: ''
        }
      };
    }

    case MARK_NOTIFICATION_AS_READ_FAILURE: {
      return {
        ...state,
        markAsRead: {
          isFetching: false,
          error: action.error
        }
      };
    }

    case REMOVE_NOTIFICATION: {
      return {
        ...state,
        remove: {
          isFetching: true,
          error: ''
        }
      };
    }

    case REMOVE_NOTIFICATION_SUCCESS: {
      return {
        ...state,
        notificationList: {
          ...state.notificationList,
          data: state.notificationList.data.filter(el => el.message && el.message.id !== action.id)
        },
        remove: {
          isFetching: false,
          error: ''
        }
      };
    }

    case REMOVE_NOTIFICATION_FAILURE: {
      return {
        ...state,
        remove: {
          isFetching: false,
          error: action.error
        }
      };
    }

    default:
      return state;
  }
}

// Private action creators
function _getNotifications() {
  return { type: GET_NOTIFICATIONS };
}

function _getNotificationsSuccess(response) {
  return {
    type: GET_NOTIFICATIONS_SUCCESS,
    response,
  };
}

function _getNotificationsFailure(error) {
  return {
    type: GET_NOTIFICATIONS_FAILURE,
    error,
  };
}

export function addNotification(data) {
  return {
    type: ADD_NOTIFICATION,
    data,
  };
}

function _markNotificationAsRead(id, read = true) {
  return { type: MARK_NOTIFICATION_AS_READ, id, read };
}

function _markNotificationAsReadSuccess() {
  return {
    type: MARK_NOTIFICATION_AS_READ_SUCCESS
  };
}

function _markNotificationAsReadFailure(error) {
  return {
    type: MARK_NOTIFICATION_AS_READ_FAILURE,
    error,
  };
}

export function removeNotification() {
  return { type: REMOVE_NOTIFICATION };
}

export function removeNotificationSuccess(id) {
  return {
    type: REMOVE_NOTIFICATION_SUCCESS,
    id
  };
}

export function removeNotificationFailure(error) {
  return {
    type: REMOVE_NOTIFICATION_FAILURE,
    error,
  };
}

// Thunks
export const openNotification = notification => {
  return async (dispatch, getState) => {
    const isLoggedIn = getIsLoggedIn(getState());
    if (isLoggedIn && !notification.read) {
      dispatch(markNotificationAsRead(notification.id));
    }
    
    const gaScreenId = notification.message ? notification.message.id : null;
    dispatch(navigateFromHome(routeNames.NOTIFICATION_DETAIL, { notification, gaScreenId }));
  }
}

export function getNotifications() {
  return async (dispatch, getState) => {
    dispatch(_getNotifications());

    try {
      const response = await voudRequest(`/notification`, 'GET', '', true);

      dispatch(_getNotificationsSuccess(response));

      if (Platform.OS === 'ios') {
        firebase.notifications().setBadge(getUnreadNotificationCount(getState()));
      }

      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (!requestErrorHandler(dispatch, error, _getNotificationsFailure(error.message))) {
        throw error;
      }
    }
  }
}

export function markNotificationAsRead(id, read = true) {
  return async (dispatch, getState) => {

    dispatch(_markNotificationAsRead(id, read));

    try {

      if (Platform.OS === 'ios') {
        firebase.notifications().setBadge(getUnreadNotificationCount(getState()));
      }
      
      const requestBody = {
        read
      };
      
      const response = await voudRequest(`/notification/${id}`, 'PUT', requestBody, true);

      dispatch(_markNotificationAsReadSuccess());

      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (!requestErrorHandler(dispatch, error, _markNotificationAsReadFailure(error.message))) {
        throw error;
      }
    }
  }
}

export function fetchRemoveNotification(id) {
  return async (dispatch, getState) => {

    dispatch(removeNotification());

    try {
      const response = await voudRequest(`/notification/${id}`, 'DELETE', null, true);

      dispatch(removeNotificationSuccess(id));

      if (Platform.OS === 'ios') {
        firebase.notifications().setBadge(getUnreadNotificationCount(getState()));
      }

      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      if (!requestErrorHandler(dispatch, error, removeNotificationFailure(error.message))) {
        throw error;
      }
    }
  }
}