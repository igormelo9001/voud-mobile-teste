// NPM imports
import { NavigationActions } from 'react-navigation';

// VouD imports
import { authStepToRouteName } from '../redux/auth';
import { initActions } from '../redux/init';
import { mobileEditingSteps } from '../redux/profile-edit';
import { getIsLoggedIn } from '../redux/selectors';
import { routeNames } from '../shared/route-names';

import { GATrackScreen } from '../shared/analytics';
import { getStateCurrentRouteName } from '../utils/nav-util';

// utils

// Handle screen with internal screens in the same route

const handleInternalScreen = (state, screen) => {
  switch (screen) {
    case routeNames.AUTH: {
      const { auth } = state;
      return authStepToRouteName(auth.currentStep);
    }
    case routeNames.HOME:
      return getIsLoggedIn(state) ? routeNames.HOME : routeNames.HOME_NOT_LOGGED_IN;
    case routeNames.EDIT_MOBILE: {
      const { profileEdit } = state;
      const { profile } = state;

      if (profileEdit.mobile.currentStep === mobileEditingSteps.INITIAL) {
        return profile.data.isValidMobile ? routeNames.EDIT_MOBILE_CHECKED : routeNames.EDIT_MOBILE_CONFIRMATION;
      } else {
        return routeNames.EDIT_MOBILE;
      }
    }
    case routeNames.EDIT_EMAIL: {
      const { profileEdit } = state;
      const { profile } = state;

      if (profileEdit.email.currentStep === mobileEditingSteps.INITIAL) {
        return profile.data.isValidEmail ? routeNames.EDIT_EMAIL_CHECKED : routeNames.EDIT_EMAIL_CONFIRMATION;
      } else {
        return routeNames.EDIT_EMAIL;
      }
    }
    default:
      return screen;
  }
};

const handleGaScreenId = (screen, gaScreenId) => (`${screen}${gaScreenId ? `-${gaScreenId}` : ''}`);

const getScreenName = (state, screen, params) => {
  const internalScreen = handleInternalScreen(state, screen);
  const gaScreenId = params && params.gaScreenId ? params.gaScreenId : null;

  return handleGaScreenId(internalScreen, gaScreenId);
}

// middlewares

// Google Analytics screen tracker
let previousTrackedScreen = '';

export const googleAnalyticsScreenTracker = ({ getState }) => next => action => {
  if (
    action.type !== NavigationActions.NAVIGATE &&
    action.type !== NavigationActions.BACK &&
    !(/^voud/.test(action.type))
  )
    return next(action);

  const currentScreen = getScreenName(getState(), getStateCurrentRouteName(getState().nav));
  const result = next(action);
  const nextScreen = getScreenName(getState(), getStateCurrentRouteName(getState().nav), action.params);

  const screenChanged = nextScreen !== currentScreen;
  const previousTracked = previousTrackedScreen === nextScreen;
  
  // Note - in race conditions, the same screen can be tracked multiple times. To prevent this,
  // we check if the next screen was already tracked in the last transition.
  if (!previousTracked && (action.type === initActions.HYDRATE || screenChanged)) {
    previousTrackedScreen = nextScreen;
    GATrackScreen(nextScreen);
    if (__DEV__) console.tron.log('Tracking Screen: ' + nextScreen);
  }
  return result;
};
