// VouD imports
import { loginActions } from './login';
import { routeNames } from '../shared/route-names';
import { navigateToRoute } from './nav';

// Actions
const CHANGE_CPF = 'voud/auth/CHANGE_CPF';
const FORGET_PASSWORD = 'voud/auth/FORGET_PASSWORD';
const CANCEL_RECOVER = 'voud/auth/CANCEL_RECOVER';
const CHANGE_STEP = 'voud/auth/CHANGE_STEP';
const CLOSE = 'voud/auth/CLOSE';

export const authActions = {
  CLOSE,
};

// aux consts
export const authSteps = {
  LOGIN: 1,
  REGISTER: 2,
  CONFIRM_MOBILE: 3,
  EDIT_MOBILE: 4,
  CONFIRM_EMAIL: 5,
  EDIT_EMAIL: 6,
  REGISTER_SUCCESS: 7,
  RECOVER_PASSWORD: 8,
  CHANGE_PASSWORD: 9,
  FB_PRE_AUTH: 10,
  FB_REGISTER: 11,
  FB_CONNECT: 12,
};

export const authStepToRouteName = (step) => {
  step = Number(step);
  switch (step) {
    case authSteps.LOGIN:
      return routeNames.LOGIN;
    case authSteps.REGISTER:
      return routeNames.REGISTER;
    case authSteps.CONFIRM_MOBILE:
      return routeNames.CONFIRM_MOBILE;
    case authSteps.EDIT_MOBILE:
      return routeNames.REGISTER_EDIT_MOBILE;
    case authSteps.CONFIRM_EMAIL:
      return routeNames.CONFIRM_EMAIL;
    case authSteps.EDIT_EMAIL:
      return routeNames.REGISTER_EDIT_EMAIL;
    case authSteps.REGISTER_SUCCESS:
      return routeNames.REGISTER_SUCCESS;
    case authSteps.RECOVER_PASSWORD:
      return routeNames.RECOVER_PASSWORD;
    case authSteps.CHANGE_PASSWORD:
      return routeNames.CHANGE_PASSWORD;
    case authSteps.FB_PRE_AUTH:
      return routeNames.FB_PRE_AUTH;
    case authSteps.FB_REGISTER:
      return routeNames.FB_REGISTER;
    case authSteps.FB_CONNECT:
      return routeNames.FB_CONNECT;
    default:
    return;
  }
};

export const isFBStep = step => step === authSteps.FB_PRE_AUTH || step === authSteps.FB_REGISTER ||
  step === authSteps.FB_CONNECT;

export const authTypes = {
  CPF: 'CPF',
  FACEBOOK: 'FACEBOOK',
};

// Reducer
const initialState = {
  currentStep: null,
  type: '',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case loginActions.PRE_AUTH_SUCCESS: {
      let currentStep, type;
      if (state.currentStep === authSteps.FB_PRE_AUTH) {
        currentStep = action.response.payload.isRegistered ? authSteps.FB_CONNECT : authSteps.FB_REGISTER;
        type = authTypes.FACEBOOK;
      } else {
        currentStep = action.response.payload.isRegistered ? authSteps.LOGIN : authSteps.REGISTER;
        type = authTypes.CPF;
      }
      return {
        ...state,
        currentStep,
        type,
      };
    }
    case loginActions.LOGOUT:
    case CHANGE_CPF:
      return {
        ...state,
        currentStep: null
      };

    case FORGET_PASSWORD:
      return {
        ...state,
        currentStep: authSteps.RECOVER_PASSWORD
      };
    case loginActions.RECOVER_PASSWORD_SUCCESS:
      return {
        ...state,
        currentStep: authSteps.CHANGE_PASSWORD
      };
    case loginActions.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        currentStep: state.type === authTypes.FACEBOOK ? authSteps.FB_CONNECT : authSteps.LOGIN,
      };
    case CANCEL_RECOVER:
      return {
        ...state,
        currentStep: state.type === authTypes.FACEBOOK ? authSteps.FB_CONNECT : authSteps.LOGIN
      };

    case CHANGE_STEP:
      return {
        ...state,
        currentStep: action.step
      };
    case CLOSE: {
      return {
        ...state,
        currentStep: null
      };
    }

    default:
      return state;
  }
}

export default reducer;

// Actions creators

export function changeCpf() {
  return { type: CHANGE_CPF };
}

export function forgetPassword() {
  return { type: FORGET_PASSWORD };
}

export function cancelRecover() {
  return { type: CANCEL_RECOVER };
}

export function changeStep(step) {
  return { type: CHANGE_STEP, step };
}

export function authBack(currentStep) {

  if (currentStep === authSteps.LOGIN || currentStep === authSteps.REGISTER || currentStep === authSteps.FB_PRE_AUTH)
    return changeStep(null);

  if (currentStep === authSteps.RECOVER_PASSWORD || currentStep === authSteps.CHANGE_PASSWORD)
    return changeStep(authSteps.LOGIN);

  if (currentStep === authSteps.FB_REGISTER || currentStep === authSteps.FB_CONNECT)
    return changeStep(authSteps.FB_PRE_AUTH);

  if (currentStep === authSteps.CONFIRM_MOBILE || currentStep === authSteps.EDIT_MOBILE ||
    currentStep === authSteps.CONFIRM_EMAIL || currentStep === authSteps.EDIT_EMAIL)
    return navigateToRoute(
      routeNames.SKIP_REGISTRATION_PROMPT,
      (
        currentStep === authSteps.CONFIRM_MOBILE
        || currentStep === authSteps.EDIT_MOBILE
      )
      ? navigateToRoute(routeNames.SKIP_REGISTRATION_PROMPT, { type: 'mobile'})
      : navigateToRoute(routeNames.SKIP_REGISTRATION_PROMPT, { type: 'email' })
    )

  return { type: CLOSE };
}

export function closeAuth() {
  return { type: CLOSE };
}
