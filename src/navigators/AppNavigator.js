// NPM imports
import React, { Component } from "react";
import { BackHandler } from "react-native";
import { NavigationActions } from "react-navigation";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addNavigationHelpers, StackNavigator } from "react-navigation";
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware
} from "react-navigation-redux-helpers";

// VouD imports
import ModalNavigator from "./ModalNavigator";
import DrawerNavigator from "./DrawerNavigator";
import { waitAndNavigateToRoute } from "../redux/nav";
import { routeNames } from "../shared/route-names";
import { colors } from "../styles/constants";

import {
  Auth,
  AddCardHelperDialog,
  SelectReportTypeDialog,
  SelectReportDetailsDialog,
  SelectReportModalTypeDialog,
  TransportCardRechargeSuccessful,
  SendReportSuccessful,
  Browser,
  UnsupportedVersionDialog,
  SelectStateDialog,
  ConfirmPhoneDialog,
  PhoneCarriersList,
  DebitCardRedirectAlert,
  DebitCardSupportedBanksHelperDialog,
  PhoneRechargeSuccessful,
  MobilityServicesConfirmation,
  UnsupportedDeviceDialog,
  PurchaseConfirmationDialog,
  PendingRegistrationModal,
  SkipRegistrationPrompt,
  RequestCardSuccessful,
  SelectStateDialogDelivery,
  TransportCardRechargePendingSuccessful,
  PurchaseTicketPaymentSuccessful,
  EditUserData,
  UserBlocked
} from "../screens";

import VerificationCard from "../flows/VerificationCard/screens/VerificationCard";
import VerificationCardConfirmation from "../flows/VerificationCard/screens/VerificationCardConfirmation";
import VerificationCardHandlerFeedBack from "../flows/VerificationCard/screens/VerificationCardHandlerFeedBack";

import { isEmulator } from "../utils/device-info";
import { getStateCurrentRouteName } from "../utils/nav-util";

// create custom transitioner for dialogs
function getDialogInterpolator(props) {
  const { position, scene } = props;

  const index = scene.index;

  const translateX = 0;
  const translateY = 0;

  const opacity = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0, 1, 1]
  });

  return {
    transform: [{ translateX }, { translateY }],
    opacity
  };
}

// export app navigator to control routes
export const AppNavigator = StackNavigator(
  {
    [routeNames.MODAL_NAVIGATOR]: { screen: ModalNavigator },
    [routeNames.DRAWER_NAVIGATOR]: { screen: DrawerNavigator },
    [routeNames.PENDING_REGISTRATION_MODAL]: {
      screen: PendingRegistrationModal
    },
    [routeNames.ADD_CARD_HELPER_DIALOG]: { screen: AddCardHelperDialog },
    [routeNames.SELECT_REPORT_TYPE_DIALOG]: { screen: SelectReportTypeDialog },
    [routeNames.SELECT_REPORT_DETAILS_DIALOG]: {
      screen: SelectReportDetailsDialog
    },
    [routeNames.SELECT_REPORT_MODAL_TYPE_DIALOG]: {
      screen: SelectReportModalTypeDialog
    },
    [routeNames.PAYMENT_SUCCESSFUL]: {
      screen: TransportCardRechargeSuccessful
    },
    [routeNames.DEBIT_CARD_REDIRECT_ALERT]: { screen: DebitCardRedirectAlert },
    [routeNames.SEND_REPORT_SUCCESSFUL]: { screen: SendReportSuccessful },
    [routeNames.BROWSER]: { screen: Browser },
    [routeNames.UNSUPPORTED_VERSION_DIALOG]: {
      screen: UnsupportedVersionDialog
    },
    [routeNames.UNSUPPORTED_DEVICE_DIALOG]: { screen: UnsupportedDeviceDialog },
    [routeNames.SELECT_STATE_DIALOG]: { screen: SelectStateDialog },
    [routeNames.CONFIRM_PHONE_DIALOG]: { screen: ConfirmPhoneDialog },
    [routeNames.PHONE_CARRIERS_LIST_DIALOG]: { screen: PhoneCarriersList },
    [routeNames.DEBIT_CARD_SUPPORTED_BANKS_HELPER_DIALOG]: {
      screen: DebitCardSupportedBanksHelperDialog
    },
    [routeNames.PHONE_RECHARGE_SUCCESSFUL]: { screen: PhoneRechargeSuccessful },
    [routeNames.MOBILITY_SERVICES_CONFIRMATION]: {
      screen: MobilityServicesConfirmation
    },
    [routeNames.PURCHASE_CONFIRMATION_DIALOG]: {
      screen: PurchaseConfirmationDialog
    },
    [routeNames.SKIP_REGISTRATION_PROMPT]: { screen: SkipRegistrationPrompt },
    [routeNames.REQUEST_CARD_PAYMENT_SUCCESSFUL]: {
      screen: RequestCardSuccessful
    },
    [routeNames.SELECT_STATE_DELIVERY_DIALOG]: {
      screen: SelectStateDialogDelivery
    },
    [routeNames.TRANSPORT_CARD_RECHARGE_PENDING_SUCCESSFUL]: {
      screen: TransportCardRechargePendingSuccessful
    },
    [routeNames.PURCHASE_TICKET_PAYMENT_SUCESSFUL]: {
      screen: PurchaseTicketPaymentSuccessful
    },
    [routeNames.USER_EDIT_DATA]: {
      screen: EditUserData
    },
    [routeNames.USER_BLOCKED]: { screen: UserBlocked },
    [routeNames.VERIFICATION_CARD]: { screen: VerificationCard },
    [routeNames.VERIFICATION_CARD_CONFIRMATION]: {
      screen: VerificationCardConfirmation
    },
    [routeNames.VERIFICATION_CARD_CONFIRMATION_FEEDBACK]: {
      screen: VerificationCardHandlerFeedBack
    }
  },
  {
    mode: "modal",
    navigationOptions: {
      gesturesEnabled: false,
      header: null
    },
    cardStyle: {
      backgroundColor: colors.OVERLAY,
      shadowOpacity: 0
    },
    transitionConfig: () => ({ screenInterpolator: getDialogInterpolator })
  }
);

// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
export const reactNavigationMiddleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav
);
const addListener = createReduxBoundAddListener("root");

export class AppWithNavigationState extends Component {
  componentWillMount() {
    const { dispatch } = this.props;

    BackHandler.addEventListener("hardwareBackPress", this._backHandler);

    if (isEmulator()) {
      dispatch(waitAndNavigateToRoute(routeNames.UNSUPPORTED_DEVICE_DIALOG));
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._backHandler);
  }

  _backHandler = () => {
    const { dispatch, nav } = this.props;
    const currentRouteName = getStateCurrentRouteName(nav);

    if (currentRouteName !== routeNames.HOME) {
      dispatch(NavigationActions.back());
      return true;
    }

    return false;
  };

  render() {
    const { dispatch, nav } = this.props;
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch,
          state: nav,
          addListener
        })}
      />
    );
  }
}

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  nav: state.nav
});

export const AppWithNavigationStateX = connect(mapStateToProps)(
  AppWithNavigationState
);
