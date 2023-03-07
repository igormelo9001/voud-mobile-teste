import { Platform } from 'react-native';
// VouD imports
import Moment from 'moment';
import { loginActions } from './login';
import { registerActions } from './register';
import { profileEditActions } from './profile-edit';
import { userEditActions } from '../flows/EditUserData/store';
import { initActions, asyncStorageKeys, persistData, clearData } from './init';
import {
  getCurrentPosition,
  getDefaultRequestPositionConfig,
  checkAndroidLocationPermission,
} from '../utils/geolocation';
import { VoudError } from '../shared/custom-errors';

// Actions
const SET_FCM_TOKEN = 'voud/profile/SET_FCM_TOKEN';

const GETTING_POSITION = 'voud/profile/GETTING_POSITION';
const SET_POSITION = 'voud/profile/SET_POSITION';
const SET_POSITION_FAILURE = 'voud/profile/SET_POSITION_FAILURE';
const SET_WATCH_POSITION_ID = 'voud/profile/SET_WATCH_POSITION_ID';

// Reducer
export const initialState = {
  data: {},
  position: {
    latitude: null,
    longitude: null,
    // default: Marco Zero de São Paulo
    defaultLat: -23.550148,
    defaultLng: -46.633879,
    geolocPermGranted: false,
    error: null,
    watchPositionId: null,
    isGettingPosition: false,
    positionReadingDate: null,
  },
  fcmToken: '',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case initActions.HYDRATE:
      return {
        ...state,
        data: action.data.profileData || state.data,
        position: {
          ...state.position,
          ...(action.data.currentPosition && action.data.currentPosition.coords
            ? action.data.currentPosition.coords
            : {}),
          positionReadingDate: action.data.currentPosition
            ? action.data.currentPosition.positionReadingDate
            : null,
        },
      };
    case loginActions.PRE_AUTH:
      return {
        ...state,
        data: {
          ...state.data,
          cpf: action.cpf,
        },
      };
    case loginActions.PRE_AUTH_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          mobile: action.response.payload.mobile || '',
          name: action.response.payload.name ? action.response.payload.name.trim() : '',
        },
      };
    case loginActions.LOGIN_SUCCESS:
    case registerActions.REGISTER_SUCCESS:
      return {
        ...state,
        data: {
          ...action.response.payload,
          isForceUpdateProfile: false,
          name: action.response.payload.name ? action.response.payload.name.trim() : '',
        },
      };

    case loginActions.LOGIN_FORCE_UPDATE_PROFILE:
      return {
        ...state,
        data: {
          ...action.response.payload,
          isForceUpdateProfile: true,
          name: action.response.payload.name ? action.response.payload.name.trim() : '',
        },
      };
    case registerActions.CONFIRM_MOBILE_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          isValidMobile: true,
        },
      };
    case registerActions.CONFIRM_EMAIL_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          isValidEmail: true,
        },
      };
    case loginActions.LOGOUT:
      return {
        ...state,
        data: {
          cpf: state.data.cpf,
          name: state.data.name,
          mobile: state.data.mobile,
        },
        position: {
          ...state.position,
          error: null,
        },
      };
    case GETTING_POSITION:
      return {
        ...state,
        position: {
          ...state.position,
          isGettingPosition: true,
          error: null,
        },
      };
    case SET_POSITION:
      return {
        ...state,
        position: {
          ...state.position,
          latitude: action.latitude,
          longitude: action.longitude,
          latitudeDelta: action.latitudeDelta,
          longitudeDelta: action.longitudeDelta,
          positionReadingDate: action.positionReadingDate,
          geolocPermGranted: true,
          error: null,
          isGettingPosition: false,
        },
      };

    case SET_POSITION_FAILURE:
      return {
        ...state,
        position: {
          ...state.position,
          latitude: state.position.defaultLat,
          longitude: state.position.defaultLng,
          geolocPermGranted: false,
          error:
            'Não localizamos você. Por favor, verifique se a permissão de geolocalização está habilitada.',
          isGettingPosition: false,
        },
      };
    case SET_WATCH_POSITION_ID:
      return {
        ...state,
        position: {
          ...state.position,
          watchPositionId: action.watchId,
        },
      };

    case SET_FCM_TOKEN:
      return {
        ...state,
        fcmToken: action.token,
      };

    // Edit actions
    case profileEditActions.EDIT_PERSONAL_DATA_SUCCESS:
    case profileEditActions.EDIT_EMAIL_SUCCESS:
    case profileEditActions.EDIT_MOBILE_SUCCESS:
    case profileEditActions.EDIT_EMAIL_PREFERENCES_SUCCESS:
    case profileEditActions.EDIT_ADDRESS_SUCCESS:
      return {
        ...state,
        data: {
          authenticationToken: state.data.authenticationToken,
          ...action.response.payload,
        },
      };

    case userEditActions.EDIT_USER_DATA_SUCCESS:
      return {
        ...state,
        data: {
          authenticationToken: state.data.authenticationToken,
          isForceUpdateProfile: false,
          ...action.response.payload,
        },
      };

    default:
      return state;
  }
}

export default reducer;

// Actions creators
export function setPosition(latitude, longitude, latitudeDelta = null, longitudeDelta = null) {
  const positionReadingDate = Moment();
  persistData(asyncStorageKeys.currentPosition, {
    coords: { latitude, longitude },
    positionReadingDate,
  });
  return {
    type: SET_POSITION,
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
    positionReadingDate,
  };
}

export function setPositionFailed() {
  return { type: SET_POSITION_FAILURE };
}

export function gettingPosition() {
  return { type: GETTING_POSITION };
}

function _setWatchPositionId(watchId) {
  return { type: SET_WATCH_POSITION_ID, watchId };
}

export function setFCMToken(token) {
  return {
    type: SET_FCM_TOKEN,
    token,
  };
}

// Utility functions

// export function forceUpdateProfile(state) {
//   persistData(asyncStorageKeys.forceUpdateProfile, state.profile.data);
// }

export function persistProfile(state) {
  persistData(asyncStorageKeys.profileData, state.profile.data);
}

// export function persistForceUpdateProfile(state) {
//   persistData(asyncStorageKeys.forceUpdateProfile, state.profile.dataForceUpdateProfile);
// }

export function clearProfileStorage() {
  clearData(asyncStorageKeys.profileData);
  clearData(asyncStorageKeys.isServiceMenuCollapsed);
  clearData(asyncStorageKeys.forceUpdateProfile);
}

const CACHE_LOCATION_TIMEOUT = 60; // in minutes

export function configurePosition(centerLocation) {
  return async function(dispatch, getState) {
    const cachedLocation = getState().profile.position;
    const cacheAge = cachedLocation.positionReadingDate
      ? Moment().diff(Moment(cachedLocation.positionReadingDate), 'minute')
      : 0;
    const useCachedLocation =
      cachedLocation.latitude && cachedLocation.longitude && cacheAge < CACHE_LOCATION_TIMEOUT;

    try {
      if (useCachedLocation && Platform.OS === 'android') {
        const hasPermission = await checkAndroidLocationPermission();
        if (!hasPermission) throw new VoudError('Sem permissão de geolocalização');
      }

      dispatch(gettingPosition());
      const coords = useCachedLocation
        ? cachedLocation
        : await getCurrentPosition(
            getDefaultRequestPositionConfig(true),
            true,
            getDefaultRequestPositionConfig(false)
          );
      dispatch(setPosition(coords.latitude, coords.longitude));
    } catch (error) {
      if (__DEV__) console.tron.log(error, true);
      dispatch(setPositionFailed());
    }

    dispatch(setWatchPosition());
    if (useCachedLocation) {
      dispatch(updatePosition(centerLocation));
    }
  };
}

function updatePosition(centerLocation) {
  return async function(dispatch) {
    try {
      dispatch(gettingPosition());
      const coords = await getCurrentPosition(
        getDefaultRequestPositionConfig(true),
        true,
        getDefaultRequestPositionConfig(false)
      );
      dispatch(setPosition(coords.latitude, coords.longitude));
      centerLocation();
    } catch (error) {
      if (__DEV__) console.tron.log(error, true);
      dispatch(setPositionFailed());
    }
  };
}

export function setWatchPosition(onPositionUpdate) {
  return async function(dispatch, getState) {
    const { geolocPermGranted, watchPositionId } = getState().profile.position;

    if (watchPositionId !== null || !geolocPermGranted) return;

    const watchId = navigator.geolocation.watchPosition(
      // success cb
      data => {
        const { latitude, longitude } = data.coords;
        dispatch(setPosition(latitude, longitude));
        onPositionUpdate && onPositionUpdate(data.coords);
      },
      error => {
        if (__DEV__) console.tron.log(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000, distanceFilter: 10 }
    );

    dispatch(_setWatchPositionId(watchId));
  };
}
