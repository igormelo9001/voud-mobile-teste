// NPM imports
import { NavigationActions } from 'react-navigation';

// VouD imports
import { AppNavigator } from '../navigators/AppNavigator';
import { loginActions } from './login';
import { initActions } from './init';
import { authActions } from './auth';
import { profileEditActions } from './profile-edit';
import { cardActions } from './transport-card';
import { routeNames } from '../shared/route-names';
import { getStateCurrentRouteName, waitRouteTransition } from '../utils/nav-util';
import { userEditActions } from '../flows/EditUserData/store';

// Actions
const NAVIGATE_TO_ROUTE = 'voud/navigation/NAVIGATE_TO_ROUTE';
const BACK_TO_HOME = 'voud/navigation/BACK_TO_HOME';
const BACK_TO_ROUTE = 'voud/navigation/BACK_TO_ROUTE';
const NAVIGATE_FROM_HOME = 'voud/navigation/NAVIGATE_FROM_HOME';

export const navActions = {
  NAVIGATE_TO_ROUTE,
  BACK_TO_HOME,
};

const getStateForBackToRoute = (state, routeName, previousRouteName = '') => {
  const stateCurrentRouteName = getStateCurrentRouteName(state);
  if (stateCurrentRouteName === routeName || stateCurrentRouteName === previousRouteName)
    return state;

  return getStateForBackToRoute(
    AppNavigator.router.getStateForAction(NavigationActions.back(), state),
    routeName,
    stateCurrentRouteName
  );
};

// Reducer

// Start with two routes: The home screen, with the welcome screen on top
const initialState = AppNavigator.router.getStateForAction(NavigationActions.init());

function reducer(state = initialState, action) {
  switch (action.type) {
    case initActions.HYDRATE:
      if (action.shouldShowOnboarding)
        return AppNavigator.router.getStateForAction(
          NavigationActions.navigate({ routeName: routeNames.ONBOARDING }),
          state
        );
      return state;

    case loginActions.LOGOUT:
    case cardActions.REMOVE_CARD_SUCCESS:
    case BACK_TO_HOME:
      return getStateForBackToRoute(state, routeNames.HOME);

    case NAVIGATE_FROM_HOME:
      return AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: action.routeName, params: action.params }),
        getStateForBackToRoute(state, routeNames.HOME)
      );

    case BACK_TO_ROUTE:
      return getStateForBackToRoute(state, action.routeName);

    case NAVIGATE_TO_ROUTE: {
      if (action.route === getStateCurrentRouteName(state)) return state;
      // support multiple routes
      if (Array.isArray(action.route))
        return action.route.reduce((accState, curRoute) => {
          const navAction =
            typeof curRoute === 'object'
              ? curRoute
              : NavigationActions.navigate({ routeName: curRoute, params: action.params });
          return AppNavigator.router.getStateForAction(navAction, accState);
        }, state);
      return AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: action.route,
          params: action.params,
        }),
        state
      );
    }

    // Back/close actions
    case profileEditActions.EDIT_PERSONAL_DATA_SUCCESS:
    case loginActions.LOGIN_SUCCESS:
    case authActions.CLOSE:
    case profileEditActions.EDIT_PASSWORD_SUCCESS:
    case profileEditActions.EDIT_ADDRESS_SUCCESS:
    case cardActions.ADD_CARD_SUCCESS:
    case cardActions.UPDATE_CARD_SUCCESS:
      return AppNavigator.router.getStateForAction(NavigationActions.back(), state);

    case loginActions.LOGIN_FORCE_UPDATE_PROFILE:
      return AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: routeNames.USER_EDIT_DATA,
        }),
        state
      );

    case userEditActions.EDIT_USER_BLOCKED:
    case loginActions.LOGIN_USER_BLOCKED:
      return AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: routeNames.USER_BLOCKED,
        }),
        state
      );

    case userEditActions.EDIT_USER_DATA_SUCCESS:
      return getStateForBackToRoute(state, routeNames.HOME);

    default: {
      const currentState = AppNavigator.router.getStateForAction(action, state);
      return currentState || {};
    }
  }
}

export default reducer;

// Action creators
export function navigateToRoute(route, params = {}) {
  return {
    type: NAVIGATE_TO_ROUTE,
    route,
    params,
  };
}

export function backToHome() {
  return { type: BACK_TO_HOME };
}

export function backToRoute(routeName) {
  return { type: BACK_TO_ROUTE, routeName };
}

export function navigateFromHome(routeName, params = {}) {
  return { type: NAVIGATE_FROM_HOME, routeName, params };
}

export function waitAndNavigateToRoute(route, params = {}) {
  return async (dispatch, getState) => {
    await waitRouteTransition(getState);
    dispatch(navigateToRoute(route, params));
  };
}
