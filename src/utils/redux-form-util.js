import { destroy, change, untouch, touch } from "redux-form";
import { AppState, Platform } from "react-native";

export const clearReduxForm = (dispatch, formName) => {
  // Note - It keeps redux form data if app is in background on Android, because in this scenario
  // the app can be restarted and the form data aren't lost.
  if (Platform.OS === "ios" || AppState.currentState === "active") {
    dispatch(destroy(formName));
  }
};

export const resetReduxForm = (dispatch, formName, inputName) => {
  // Note - It keeps redux form data if app is in background on Android, because in this scenario
  // the app can be restarted and the form data aren't lost.
  if (Platform.OS === "ios" || AppState.currentState === "active") {
    dispatch(change(formName, inputName, null));
  }
};

export const untochReduxForm = (dispatch, formName, inputName) => {
  // Note - It keeps redux form data if app is in background on Android, because in this scenario
  // the app can be restarted and the form data aren't lost.
  if (Platform.OS === "ios" || AppState.currentState === "active") {
    dispatch(untouch(formName, inputName));
  }
};

export const tochReduxForm = (dispatch, formName, inputName) => {
  // Note - It keeps redux form data if app is in background on Android, because in this scenario
  // the app can be restarted and the form data aren't lost.
  if (Platform.OS === "ios" || AppState.currentState === "active") {
    dispatch(touch(formName, inputName));
  }
};
