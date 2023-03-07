// Reactotron config
import "./ReactotronConfig.js";

// NPM imports
import React, { Component } from "react";
import { Provider } from "react-redux";
import firebase from "react-native-firebase";
import Moment from "moment";
import SplashScreen from "react-native-splash-screen";
import { Platform, StatusBar } from "react-native";
import "moment/locale/pt-br";
import "intl";
import "intl/locale-data/jsonp/pt-BR";

//VouD imports
import store from "./ReduxConfig";
import RatingInit from "./RatingRequestConfig";
import { hydrateFromAsyncStorage } from "./redux/init";

import KeyboardAvoidingView from "./components/KeyboardAvoidingView";

import Toast from "./components/Toast";
import ConfigError from "./components/ConfigError";
import { makePushController } from "./utils/push-controller";
import { AppWithNavigationStateX } from "./navigators/AppNavigator";

import RNUxcam from "react-native-ux-cam";

import {
  fetchContent,
  handleDiscountCode,
  setDeviceId,
  setDeviceBrand,
  setDeviceModel,
  setDeviceIP
} from "./redux/config";
import { emitInvalidDiscountToast } from "./utils/member-get-member";
import { navigateToRoute } from "./redux/nav";
import { routeNames } from "./shared/route-names";
import {
  getDeviceId,
  getDeviceBrand,
  getDeviceModel,
  getDeviceIP
} from "./utils/device-info";

RNUxcam.startWithKey("dgpaeiuijsx1o99");
import RNSmisdkPlugin from "react-native-smisdk-plugin";

RatingInit(store);

export default class VoudApp extends Component {
  onSdStageChange = event => {
    if (__DEV__) {
      console.tron.log("state: " + event.sd_state);
      console.tron.log("reason: " + event.sd_reason);
      console.tron.log("carrier: " + event.carrier_name);
      console.tron.log("client ip: " + event.client_ip);
    }
  };

  constructor(props) {
    super(props);
    const { addiOSEventEmitter, addDeviceEmitterAndroid } = RNSmisdkPlugin;
    if (Platform.OS === "android") {
      addDeviceEmitterAndroid(this.onSdStageChange);
    } else {
      addiOSEventEmitter(this.onSdStageChange);
    }
  }

  componentDidMount() {
    Moment.locale("pt-br");

    // firebase.perf().setPerformanceCollectionEnabled(true);

    getDeviceId().then(deviceId => {
      store.dispatch(setDeviceId(deviceId));
    });

    getDeviceModel().then(deviceModel => {
      store.dispatch(setDeviceModel(deviceModel));
    });

    getDeviceBrand().then(deviceBrand => {
      store.dispatch(setDeviceBrand(deviceBrand));
    });

    getDeviceIP().then(ip => {
      store.dispatch(setDeviceIP(ip));
    });

    store.dispatch(hydrateFromAsyncStorage()).then(() => {
      this._handleFirebaseDeepLink();

      // Subscribe to URL open events even if the app is already running
      firebase.links().onLink(openedLink => {
        this._handleFirebaseDeepLink(openedLink);
      });
    });

    SplashScreen.hide();

    this.pushController = makePushController(store.dispatch);
    this.pushController.init();

    store.dispatch(fetchContent());
  }

  componentWillUnmount() {
    this.pushController.removeListeners();
  }

  // Check if opened deep link has a valid discountCode and
  // check if user is already logged in. If both are true
  // show a toast stating that the discount code is valid only for
  // new users only.
  _handleFirebaseDeepLink = async openedLink => {
    store
      .dispatch(handleDiscountCode(openedLink))
      .then(({ userIsLoggedIn, discountCode, onboardingViewed }) => {
        if (userIsLoggedIn && discountCode) {
          emitInvalidDiscountToast(store.dispatch);
        }
        if (!userIsLoggedIn && discountCode && onboardingViewed) {
          store.dispatch(navigateToRoute(routeNames.AUTH));
        }
      });
  };

  render() {
    return (
      <Provider store={store}>
        <KeyboardAvoidingView>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor="transparent"
          />
          <AppWithNavigationStateX />
          <Toast />
          <ConfigError />
        </KeyboardAvoidingView>
      </Provider>
    );
  }
}
