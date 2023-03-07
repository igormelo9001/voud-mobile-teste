// NPM imports
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  BackHandler,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from "react-native";

import { StackActions } from "react-navigation";

// VouD imports
import BrandContainer from "../../components/BrandContainer";
import TouchableNative from "../../components/TouchableNative";
import KeyboardDismissView from "../../components/KeyboardDismissView";
import LoadMask from "../../components/LoadMask";
import Icon from "../../components/Icon";
import { GAEventParams, GATrackEvent } from "../../shared/analytics";
import { getStatusBarHeight } from "../../styles/util";
import { colors } from "../../styles/constants";

import {
  getPreAuthUI,
  getLoginUI,
  getRegisterUI,
  getConfirmMobileUI,
  getRecoverPasswordUI,
  getChangePasswordUI,
  getFBLoginUI,
  getEditEmailUI,
  getEditMobileUI,
  getConfirmEmailUI
} from "../../redux/selectors";
import {
  authSteps,
  changeCpf,
  forgetPassword,
  cancelRecover,
  authBack,
  closeAuth,
  changeStep,
  authTypes
} from "../../redux/auth";
import {
  fetchPreAuth,
  fetchLogin,
  fetchRecoverPassword,
  fetchChangePassword,
  loginClear,
  logout
} from "../../redux/login";
import {
  fetchRegister,
  fetchConfirmMobile,
  fetchResendMobileConfirmation,
  fetchConfirmEmail
} from "../../redux/register";
import { fetchFBLogin, fbStatusCode } from "../../redux/facebook";

import { removeAccent } from "../../utils/parsers-formaters";

// Group imports
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ConfirmMobileForm from "./ConfirmMobileForm";
import RegisterSuccess from "./RegisterSuccess";
import RecoverPasswordForm from "./RecoverPasswordForm";
import ChangePasswordForm from "./ChangePasswordForm";
import FBPreAuthForm from "./FBPreAuthForm";
import FBRegisterForm from "./FBRegisterForm";
import FBConnectForm from "./FBConnectForm";
import ConfirmEmailForm from "./ConfirmEmailForm";
import { showToast, toastStyles } from "../../redux/toast";
import EditMobileForm from "./EditMobileForm";
import { fetchEditMobile, fetchEditEmail } from "../../redux/profile-edit";
import EditEmailForm from "./EditEmailForm";
import { navigateToRoute, backToHome } from "../../redux/nav";
import { routeNames } from "../../shared/route-names";

// Login component
class AuthView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skipping: false
    };
  }

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._backHandler);
  }

  _backHandler = () => {
    const { dispatch, currentStep, forceUpdateProfile } = this.props;

    if (forceUpdateProfile) {
      dispatch(logout());
      return true;
    }

    if (
      currentStep === authSteps.CONFIRM_MOBILE ||
      currentStep === authSteps.EDIT_MOBILE
    ) {
      dispatch(
        navigateToRoute(routeNames.SKIP_REGISTRATION_PROMPT, { type: "mobile" })
      );
      return true;
    }

    if (
      currentStep === authSteps.CONFIRM_EMAIL ||
      currentStep === authSteps.EDIT_EMAIL
    ) {
      dispatch(
        navigateToRoute(routeNames.SKIP_REGISTRATION_PROMPT, { type: "email" })
      );
      return true;
    }

    dispatch(authBack(currentStep));

    if (
      currentStep === authSteps.LOGIN ||
      currentStep === authSteps.REGISTER ||
      currentStep === authSteps.FB_PRE_AUTH
    ) {
      dispatch(backToHome());
    }
    return true;
  };

  _close = () => {
    const { dispatch, currentStep, forceUpdateProfile } = this.props;
    if (forceUpdateProfile) {
      dispatch(logout());
      return;
    }

    if (currentStep === authSteps.REGISTER_SUCCESS) {
      const {
        categories: { FORM },
        actions: { SUBMIT },
        labels: { FINISH_REGISTER }
      } = GAEventParams;
      GATrackEvent(FORM, SUBMIT, FINISH_REGISTER);
    }

    if (
      currentStep === authSteps.CONFIRM_MOBILE ||
      currentStep === authSteps.EDIT_MOBILE
    ) {
      dispatch(
        navigateToRoute(routeNames.SKIP_REGISTRATION_PROMPT, { type: "mobile" })
      );
      return;
    }

    if (
      currentStep === authSteps.CONFIRM_EMAIL ||
      currentStep === authSteps.EDIT_EMAIL
    ) {
      dispatch(
        navigateToRoute(routeNames.SKIP_REGISTRATION_PROMPT, { type: "email" })
      );
      return;
    }

    dispatch(closeAuth());
  };

  _preAuth = ({ cpf }) => {
    const { dispatch } = this.props;

    dispatch(fetchPreAuth(cpf));
  };

  _changeCpf = () => {
    this.props.dispatch(changeCpf());
    this.props.dispatch(closeAuth());
  };

  _login = ({ cpf, password }) => {
    this.props.dispatch(fetchLogin(cpf, password, this.props.fcmToken));
  };

  _onRegisterSuccess = () => {
    this.props.dispatch(changeStep(authSteps.CONFIRM_MOBILE));
  };

  _notifySuccessfulDiscount = responseData => {
    const { dispatch } = this.props;

    if (
      responseData.payload &&
      responseData.payload.details &&
      responseData.payload.details.hasOwnProperty("referredBy")
    ) {
      dispatch(
        showToast(
          "Agora você tem 1 recarga do BOM ou BU isento de tarifa. Recarregue já.",
          toastStyles.DEFAULT
        )
      );
    }
  };

  _register = ({
    name,
    lastName,
    cpf,
    password,
    email,
    discountCode,
    mobile,
    isAllowSendMail,
    birthDate,
    motherName,
    addressFields
  }) => {
    const { fcmToken } = this.props;
    this.props
      .dispatch(
        fetchRegister(
          name,
          lastName,
          cpf,
          password,
          email,
          discountCode,
          mobile,
          isAllowSendMail,
          fcmToken,
          birthDate,
          motherName,
          addressFields
        )
      )
      .then(this._onRegisterSuccess);
  };

  _forgetPassword = () => {
    const {
      categories: { BUTTON },
      actions: { CLICK },
      labels: { FORGET_PASSWORD }
    } = GAEventParams;
    GATrackEvent(BUTTON, CLICK, FORGET_PASSWORD);
    this.props.dispatch(forgetPassword());
  };

  _recoverPassword = ({ cpf, mobile, last3Digits, email }) => {
    const isEmail =
      last3Digits !== "" || last3Digits !== undefined ? false : true;
    this.props.dispatch(
      fetchRecoverPassword(cpf, mobile, last3Digits, email, isEmail)
    );
  };

  _changePassword = ({ cpf, password, verificationCode }) => {
    const { dispatch } = this.props;
    dispatch(fetchChangePassword(cpf, password, verificationCode));
  };

  _cancelRecover = () => {
    const { dispatch } = this.props;
    dispatch(cancelRecover());
  };

  // Facebook
  _initLoginWithFB = () => {
    const { dispatch } = this.props;
    dispatch(fetchFBLogin())
      .then(() => this._loginWithFB({}))
      .catch(() => {});
  };

  _registerWithFB = ({
    cpf,
    discountCode,
    password,
    mobile,
    isAllowSendMail,
    birthDate,
    motherName,
    addressFields
  }) => {
    const {
      dispatch,
      fbData: { fbId, name, lastName, email, accessToken },
      fcmToken
    } = this.props;
    dispatch(
      fetchRegister(
        removeAccent(name),
        lastName,
        cpf,
        password,
        email,
        discountCode,
        mobile,
        isAllowSendMail,
        fcmToken,
        birthDate,
        motherName,
        addressFields,
        fbId,
        accessToken
      )
    ).then(this._onRegisterSuccess);
  };

  _loginWithFB = ({ cpf, password }) => {
    const {
      dispatch,
      currentStep,
      fcmToken,
      fbData: { fbId, accessToken }
    } = this.props;
    dispatch(fetchLogin(cpf, password, fcmToken, fbId, accessToken)).catch(
      error => {
        if (
          currentStep === null &&
          error.statusCode === fbStatusCode.FB_ACCOUNT_NOT_LINKED
        ) {
          dispatch(loginClear());
          dispatch(changeStep(authSteps.FB_PRE_AUTH));
        }
      }
    );
  };

  _changeToFBPreAuthStep = () => {
    const { dispatch } = this.props;
    dispatch(changeStep(authSteps.FB_PRE_AUTH));
  };

  // Mobile
  _confirmMobile = ({ verificationCode }) => {
    const { dispatch, authType } = this.props;
    dispatch(fetchConfirmMobile(verificationCode, true)).then(() => {
      const nextStep =
        authType === authTypes.FACEBOOK
          ? authSteps.REGISTER_SUCCESS
          : authSteps.CONFIRM_EMAIL;
      dispatch(changeStep(nextStep));
    });
  };

  _resendSMS = () => {
    const { dispatch, mobile } = this.props;
    dispatch(fetchResendMobileConfirmation(mobile)).catch(error => {
      dispatch(showToast(error.message, toastStyles.ERROR));
    });
  };

  _editMobile = ({ name, mobile, email }) => {
    const { dispatch } = this.props;
    dispatch(fetchEditMobile(name, mobile, email)).then(() => {
      dispatch(changeStep(authSteps.CONFIRM_MOBILE));
    });
  };

  // Email

  _confirmEmail = ({ verificationCode }) => {
    const { dispatch } = this.props;
    dispatch(fetchConfirmEmail(verificationCode)).then(() => {
      this._changeToRegisterSuccess();
    });
  };

  _editEmail = ({ name, mobile, email }) => {
    const { dispatch } = this.props;
    dispatch(fetchEditEmail(name, mobile, email)).then(() => {
      dispatch(changeStep(authSteps.CONFIRM_EMAIL));
    });
  };

  _changeToRegisterSuccess = () => {
    const { dispatch } = this.props;
    dispatch(changeStep(authSteps.REGISTER_SUCCESS));
  };

  _renderContent = () => {
    const {
      currentStep,
      name,
      mobile,
      email,
      preAuthUI,
      loginUI,
      registerUI,
      confirmMobileUI,
      recoverPasswordUI,
      changePasswordUI,
      editMobileUI,
      editEmailUI,
      confirmEmailUI
    } = this.props;

    // const { skipping } = this.state;

    switch (currentStep) {
      case authSteps.LOGIN:
        return (
          <LoginForm
            style={styles.content}
            name={name}
            ui={loginUI}
            onSubmit={this._login}
            onChangeCpf={this._changeCpf}
            onForget={this._forgetPassword}
          />
        );

      case authSteps.REGISTER:
        return (
          <RegisterForm
            style={styles.content}
            ui={registerUI}
            onSubmit={this._register}
            onChangeCpf={this._changeCpf}
          />
        );

      case authSteps.RECOVER_PASSWORD:
        return (
          <RecoverPasswordForm
            style={styles.content}
            mobile={mobile}
            email={email}
            ui={recoverPasswordUI}
            onSubmit={this._recoverPassword}
            onCancel={this._cancelRecover}
          />
        );

      case authSteps.CHANGE_PASSWORD:
        return (
          <ChangePasswordForm
            style={styles.content}
            ui={changePasswordUI}
            onSubmit={this._changePassword}
            onCancel={this._cancelRecover}
          />
        );

      case authSteps.FB_PRE_AUTH:
        return (
          <FBPreAuthForm
            style={styles.content}
            ui={preAuthUI}
            onSubmit={this._preAuth}
          />
        );

      case authSteps.FB_REGISTER:
        return (
          <FBRegisterForm
            style={styles.content}
            ui={registerUI}
            onSubmit={this._registerWithFB}
            onChangeCpf={this._changeToFBPreAuthStep}
          />
        );

      case authSteps.FB_CONNECT:
        return (
          <FBConnectForm
            style={styles.content}
            ui={loginUI}
            onSubmit={this._loginWithFB}
            onForget={this._forgetPassword}
            onChangeCpf={this._changeToFBPreAuthStep}
          />
        );

      case authSteps.CONFIRM_MOBILE:
        return (
          <ConfirmMobileForm
            style={styles.content}
            mobile={mobile}
            ui={confirmMobileUI}
            onSubmit={this._confirmMobile}
            onResendSMS={this._resendSMS}
          />
        );

      case authSteps.EDIT_MOBILE:
        return (
          <EditMobileForm
            style={styles.content}
            mobile={mobile}
            ui={editMobileUI}
            onSubmit={this._editMobile}
            onCancel={this._changeToRegisterSuccess}
          />
        );

      case authSteps.CONFIRM_EMAIL:
        return (
          <ConfirmEmailForm
            style={styles.content}
            ui={confirmEmailUI}
            onSubmit={this._confirmEmail}
          />
        );

      case authSteps.EDIT_EMAIL:
        return (
          <EditEmailForm
            style={styles.content}
            ui={editEmailUI}
            onSubmit={this._editEmail}
            onCancel={this._changeToRegisterSuccess}
          />
        );
    }
  };

  render() {
    const {
      currentStep,
      preAuthUI,
      loginUI,
      registerUI,
      confirmMobileUI,
      confirmEmailUI,
      recoverPasswordUI,
      changePasswordUI,
      editMobileUI,
      editEmailUI
    } = this.props;

    const { skipping } = this.state;

    return currentStep !== authSteps.REGISTER_SUCCESS ? (
      <BrandContainer>
        <View style={styles.statusBarSpaceHolder} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
        >
          <KeyboardDismissView>{this._renderContent()}</KeyboardDismissView>
          {currentStep !== null && !skipping ? (
            <TouchableNative
              borderless
              onPress={this._close}
              style={styles.dismissButton}
            >
              <Icon name="close" style={styles.dismissIcon} />
            </TouchableNative>
          ) : null}
        </ScrollView>
        {(preAuthUI.isFetching ||
          loginUI.isFetching ||
          registerUI.isFetching ||
          confirmMobileUI.isFetching ||
          confirmEmailUI.isFetching ||
          recoverPasswordUI.isFetching ||
          changePasswordUI.isFetching ||
          editMobileUI.isFetching ||
          editEmailUI.isFetching) && <LoadMask />}
      </BrandContainer>
    ) : (
      <RegisterSuccess onComplete={this._close} />
    );
  }
}

// styles
const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingTop: 0,
    flexGrow: 1
  },
  statusBarSpaceHolder: {
    height: getStatusBarHeight(),
    backgroundColor: colors.BRAND_PRIMARY
  },
  content: {
    alignSelf: "stretch",
    paddingTop: 16,
    paddingHorizontal: 16
  },
  dismissButton: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: Platform.OS === "ios" ? 8 : 12,
    left: Platform.OS === "ios" ? 8 : 12,
    width: 32,
    height: 32,
    backgroundColor: "transparent"
  },
  dismissIcon: {
    fontSize: 24,
    color: "white"
  },
  listContainer: {
    alignSelf: "stretch"
  },
  listContainerContent: {
    flexGrow: 1,
    overflow: "visible",
    flexDirection: "row",
    paddingVertical: 8,
    paddingRight: 8
  }
});

// redux and connect
const mapStateToProps = state => {
  return {
    name: state.profile.data.name,
    mobile: state.profile.data.mobile,
    email: state.profile.data.email,
    fcmToken: state.profile.fcmToken,
    currentStep: state.auth.currentStep,
    authType: state.auth.type,
    preAuthUI: getPreAuthUI(state),
    loginUI: getLoginUI(state),
    registerUI: getRegisterUI(state),
    confirmMobileUI: getConfirmMobileUI(state),
    confirmEmailUI: getConfirmEmailUI(state),
    recoverPasswordUI: getRecoverPasswordUI(state),
    changePasswordUI: getChangePasswordUI(state),
    editMobileUI: getEditMobileUI(state),
    editEmailUI: getEditEmailUI(state),
    fbData: state.facebook.login.data,
    fbLoginUi: getFBLoginUI(state),
    activeDiscountCode: state.config.activeDiscountCode,
    forceUpdateProfile: state.profile.data.forceUpdateProfile
  };
};

export const Auth = connect(mapStateToProps)(AuthView);
