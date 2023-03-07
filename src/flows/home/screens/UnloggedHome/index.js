// NPM imports
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Image, Keyboard, StyleSheet, View, ScrollView } from "react-native";

// VouD imports
import BrandText from "../../../../components/BrandText";
import FacebookButton from "../../../../components/FacebookButton";
import MessageBox from "../../../../components/MessageBox";
import { formatCpf, parseCpf } from "../../../../utils/parsers-formaters";
import FadeInView from "../../../../components/FadeInView";
import { preAuthClear, loginClear, fetchLogin } from "../../../../redux/login";
import { loginFBClear, fbStatusCode } from "../../../../redux/facebook";
import { cpfValidator, required } from "../../../../utils/validators";
import { clearReduxForm } from "../../../../utils/redux-form-util";
import CardButton from "../../../../components/CardButton";
import { routeNames } from "../../../../shared/route-names";

import { unloggedModalNames } from "../../../../shared/unlogged-modal-names";

// component
import TextField from "../../../../components/TextField";
import { navigateToRoute } from "../../../../redux/nav";
import UnloggedInfoModal from "./UnloggedInfoModal";
import KeyboardDismissView from "../../../../components/KeyboardDismissView";
import LoadMask from "../../../../components/LoadMask";
import { fetchFBLogin } from "../../../../redux/facebook";
import { fetchPreAuth } from "../../../../redux/login";
import {
  getFBLoginUI,
  getPreAuthUI,
  getLoginUI,
  getRegisterUI,
  getConfirmMobileUI,
  getConfirmEmailUI,
  getRecoverPasswordUI,
  getChangePasswordUI,
  getEditMobileUI,
  getEditEmailUI
} from "../../../../redux/selectors";
import { changeStep, authSteps } from "../../../../redux/auth";
import NewButton from "../../../../components/NewButton";
import NewFacebookButton from "../../../../components/NewFacebookButton";
import { GATrackEvent, GAEventParams } from "../../../../shared/analytics";
import { openSupportEmail } from "../../../../utils/mailto-util";

const reduxFormName = "preAuth";

const voudLogoImg = require("../../../../images/logo-voud.png");
const cloudsImg = require("../../../../images/nuvens.png");
const socitarCartao = require("../../../../images/ic-solicitar-cartao.png");

const voudCarro = {
  img: require("../../../../images/voud-carro.png"),
  title: "VouD Carro",
  description:
    "Cadastre-se ou acesse a sua conta no VouD e chame Uber, 99, Cabify e Lady Drivers com os melhores cupons de desconto."
};

const scheduledPurchase = {
  img: require("../../../../images/scheduled-purchase.png"),
  title: "Compra Programada",
  description:
    "Cadastre-se ou acesse a sua conta no VouD e programe a conta dos seus créditos todos os meses. Daí é só validar em um dos nossos postos de recarga e pronto!"
};

const discount = {
  img: require("../../../../images/discount.png"),
  title: "Descontos para Você",
  description:
    "Cadastre-se ou acesse a sua conta no VouD e seja direcionado para um monte de descontos incríveis e exclusivos! Para utilizar, basta ter em mãos seu número do BOM. Experimente!"
};

class UnloggedHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeModal: ""
    };
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(preAuthClear());
    dispatch(loginFBClear());
    clearReduxForm(dispatch, reduxFormName);
  }

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
          dispatch(navigateToRoute(routeNames.AUTH));
          dispatch(loginClear());
          dispatch(changeStep(authSteps.FB_PRE_AUTH));
        }
      }
    );
  };

  _initLoginWithFB = () => {
    const { dispatch } = this.props;
    dispatch(fetchFBLogin())
      .then(() => this._loginWithFB({}))
      .catch(() => {});
  };

  _preAuth = ({ cpf }) => {
    const { dispatch } = this.props;

    dispatch(fetchPreAuth(cpf)).then(() => {
      dispatch(navigateToRoute(routeNames.AUTH));
    });
  };

  _submit = () => {
    const { handleSubmit, preAuthUI, valid } = this.props;

    Keyboard.dismiss();

    if (valid && !preAuthUI.isFetching) handleSubmit(this._preAuth)();
  };

  _toggleDiscountModal = () => {
    this.setState({
      isDiscountModalVisible: !this.state.isDiscountModalVisible
    });
  };

  _setActiveModal = modalName => {
    this.setState({ activeModal: modalName });
  };

  _openSupportEmailUrl = () => {
    // Open mailto
    openSupportEmail({
      name: "",
      lastName: "",
      email: ""
    });

    // Dispatch GATrackEvent for support
    const {
      categories: { BUTTON },
      actions: { CLICK },
      labels: { UNLOGGED_MENU_SUPORT }
    } = GAEventParams;
    GATrackEvent(BUTTON, CLICK, UNLOGGED_MENU_SUPORT);
  };

  _renderCardButtons = () => {

    return (
      <Fragment>
        {__DEV__ && (
          <CardButton
            iconName="bus"
            text="Force Error"
            onPress={() => {
              throw new Error("Error");
            }}
            style={styles.cardButton}
          />
        )}
        {/* <CardButton
          iconName="bom-card"
          text="Solicitar cartão BOM"
          style={styles.cardButton}
          availableUnlogged
          onPress={() => {
            const { dispatch } = this.props;
            const {
              categories: { BUTTON },
              actions: { CLICK },
              labels: { UNLOGGED_REQUESTCARD }
            } = GAEventParams;
            GATrackEvent(BUTTON, CLICK, UNLOGGED_REQUESTCARD);
            dispatch(navigateToRoute(routeNames.REQUEST_CARD_PREAUTH));
          }}
        /> */}

        <CardButton
          iconName="feedback"
          text="Denúncias"
          style={styles.cardButton}
          availableUnlogged
          onPress={() => {
            const { dispatch } = this.props;
            const {
              categories: { BUTTON },
              actions: { CLICK },
              labels: { UNLOGGED_MENU_REPORT }
            } = GAEventParams;

            GATrackEvent(BUTTON, CLICK, UNLOGGED_MENU_REPORT);
            dispatch(navigateToRoute(routeNames.REPORTS));
          }}
        />
        <CardButton
          iconName="help-outline"
          text="Faq"
          style={styles.cardButton}
          availableUnlogged
          onPress={() => {
            const { dispatch } = this.props;
            const {
              categories: { BUTTON },
              actions: { CLICK },
              labels: { UNLOGGED_MENU_HELP }
            } = GAEventParams;

            GATrackEvent(BUTTON, CLICK, UNLOGGED_MENU_HELP);
            dispatch(navigateToRoute(routeNames.HELP));
          }}
        />
        <CardButton
          iconName="mail"
          text="Suporte"
          style={styles.cardButton}
          availableUnlogged
          onPress={this._openSupportEmailUrl}
        />

      </Fragment>
    );
  };

  render() {
    const { VOUD_CARRO, SCHEDULED_PURCHASE, DISCOUNT } = unloggedModalNames;

    const { openOnLogin, preAuthUI, fbLoginUi, loginUI, valid } = this.props;

    return (
      <Fragment>
        <KeyboardDismissView>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="always"
          >
            <View style={styles.imagesWrapper}>
              <Image source={voudLogoImg} style={styles.logo} />
            </View>
            <FadeInView style={styles.container}>
              <Field
                name="cpf"
                props={{
                  textFieldRef: el => (this.CPFField = el),
                  isPrimary: true,
                  label: "Informe seu CPF",
                  keyboardType: "numeric",
                  onSubmitEditing: () => {
                    Keyboard.dismiss();
                  }
                }}
                format={formatCpf}
                parse={parseCpf}
                maxLength={14}
                component={TextField}
                validate={[required, cpfValidator]}
              />
              {preAuthUI.error ? (
                <MessageBox
                  message={preAuthUI.error}
                  style={styles.errorMessage}
                />
              ) : null}
              <NewButton
                onPress={this._submit}
                style={styles.buttonContainer}
                buttonStyle={styles.button}
                disabled={!valid || preAuthUI.isFetching}
              >
                Acessar ou Cadastrar
              </NewButton>
              <BrandText style={styles.orText}>ou</BrandText>
              <NewFacebookButton
                buttonText="Conectar com Facebook"
                onPress={this._initLoginWithFB}
                isRound
              />
              {fbLoginUi.error || loginUI.error ? (
                <MessageBox
                  message={fbLoginUi.error || loginUI.error}
                  style={styles.errorMessage}
                />
              ) : null}
            </FadeInView>
            <View style={styles.cardWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.menuButtonsContainer}
              >
                {this._renderCardButtons()}
              </ScrollView>
            </View>
          </ScrollView>
        </KeyboardDismissView>
        {preAuthUI.isFetching && <LoadMask />}
        <UnloggedInfoModal
          onDismiss={() => {
            this._setActiveModal("");
          }}
          isVisible={this.state.activeModal === VOUD_CARRO}
          image={voudCarro.img}
          title={voudCarro.title}
          description={voudCarro.description}
          buttonCallback={() => {
            openOnLogin("voudCarro");
            if (this.CPFField) this.CPFField.focus();
          }}
        />
        <UnloggedInfoModal
          onDismiss={() => {
            this._setActiveModal("");
          }}
          isVisible={this.state.activeModal === SCHEDULED_PURCHASE}
          image={scheduledPurchase.img}
          title={scheduledPurchase.title}
          description={scheduledPurchase.description}
          buttonCallback={() => {
            openOnLogin("scheduledPurchase");
            if (this.CPFField) this.CPFField.focus();
          }}
        />
        <UnloggedInfoModal
          onDismiss={() => {
            this._setActiveModal("");
          }}
          isVisible={this.state.activeModal === DISCOUNT}
          image={discount.img}
          title={discount.title}
          description={discount.description}
          buttonCallback={() => {
            openOnLogin("discount");
            if (this.CPFField) this.CPFField.focus();
          }}
        />
      </Fragment>
    );
  }
}

// styles
const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 0,
    flexGrow: 1
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 40,
    marginBottom: 32
  },
  imagesWrapper: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  clouds: {
    position: "absolute"
  },
  fieldAndButtonWrapper: {},
  textInput: {
    color: "white"
  },
  logo: {
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "white",
    textAlign: "center"
  },
  errorMessage: {
    marginTop: 8
  },
  buttonContainer: {
    marginTop: 40
  },
  button: {
    borderRadius: 27
  },
  orText: {
    marginVertical: 8,
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 20,
    color: "white",
    textAlign: "center"
  },
  cardButton: {
    marginRight: 8,
    elevation: 4
  },
  cardWrapper: {
    marginLeft: 40
  },
  menuButtonsContainer: {
    paddingBottom: 16
  }
});

// Redux
const mapStateToProps = state => {
  return {
    initialValues: {
      cpf: state.profile.data.cpf
    },
    name: state.profile.data.name,
    mobile: state.profile.data.mobile,
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
    activeDiscountCode: state.config.activeDiscountCode
  };
};

export default connect(mapStateToProps)(
  reduxForm({ form: reduxFormName, destroyOnUnmount: false })(UnloggedHome)
);
