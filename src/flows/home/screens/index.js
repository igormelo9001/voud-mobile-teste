// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';

// VouD imports
import Header, { headerActionTypes } from '../../../components/Header';
import BrandContainer from '../../../components/BrandContainer';
import FadeInView from '../../../components/FadeInView';
import Loader from '../../../components/Loader';
import { openMenu } from '../../../redux/menu';
import { navigateToRoute, navigateFromHome } from '../../../redux/nav';
import { GAEventParams, GATrackEvent } from '../../../shared/analytics';
import { routeNames } from '../../../shared/route-names';
import {
  getIsLoggedIn,
  getCardListUI,
  getCardHelpId,
  getCurrentCardNextRecharges,
  getHasConfigError,
  getUnreadNotificationCount,
  getConfigContentUI,
  getTransportCards,
  getCurrentTransportCard,
  getNotificationsUI,
  getIssuerConfig,
  getIsLoggedInForceUpdateProfile,
  getBOMCreditValueRange,
} from '../../../redux/selectors';

// Group imports
import { ScooterServices } from '../../scooter/screens';
import LoggedHome from './LoggedHome';
import UnloggedHome from './UnloggedHome';
import NewBrandContainer from '../components/NewBrandContainer';
import { getStateCurrentRouteName } from '../../../utils/nav-util';
import { unloggedModalNames } from '../../../shared/unlogged-modal-names';

// Home screen
class HomeView extends Component {
  constructor(props) {
    super(props);
    this._openOnLoginModalName = '';
    this._loggedHomeRef = null;
    this.state = {
      initPosition: false,
    };
  }

  _navigateToRoute = (routeName, eventLabel = '') => {
    this.pdispatch(navigateFromHome(routeName));
  };

  componentDidUpdate(prevProps, prevState) {
    const { openOnLogin, clearOpenOnLogin, dispatch } = this.props;
    const {
      labels: { MENU_MOBILITY_SERVICES, MENU_SMART_PURCHASE },
    } = GAEventParams;
    const { VOUD_CARRO, SCHEDULED_PURCHASE, DISCOUNT } = unloggedModalNames;

    if (
      (prevProps.currentRoute === routeNames.AUTH ||
        prevProps.currentRoute === routeNames.SKIP_REGISTRATION_PROMPT) &&
      this.props.currentRoute === routeNames.HOME
    ) {
      switch (this._openOnLoginModalName) {
        case SCHEDULED_PURCHASE:
          dispatch(navigateToRoute(routeNames.SMART_PURCHASE));
          this._clearOpenOnLogin();
          break;
        case DISCOUNT:
          if (this._loggedHomeRef) this._loggedHomeRef.toggleDiscountModal();
          this._clearOpenOnLogin();
          break;
      }
    }

    if (
      this._openOnLoginModalName === VOUD_CARRO &&
      !prevState.initPosition &&
      this.state.initPosition
    ) {
      dispatch(navigateToRoute(routeNames.MOBILITY_SERVICES));
      this._clearOpenOnLogin();
    }
  }

  _clearOpenOnLogin = () => {
    this._openOnLoginModalName = '';
  };

  _openMenu = () => {
    const { dispatch } = this.props;
    dispatch(openMenu());
  };

  _goToAuth = () => {
    const {
      categories: { BUTTON },
      actions: { CLICK },
      labels: { LOGIN },
    } = GAEventParams;
    GATrackEvent(BUTTON, CLICK, LOGIN);
    this.props.dispatch(navigateToRoute(routeNames.AUTH));
  };

  _renderHeader = () => {
    // app initialization
    if (!this.props.isInitialized || this.props.isLoadingConfig) return <Header withLogo />;

    // user not logged
    return (
      <Header
        withLogo
        left={{
          type: headerActionTypes.MENU,
          onPress: this._openMenu,
        }}
      />
    );
  };

  _setOpenOnLogin = name => {
    this._openOnLoginModalName = name;
  };

  _onInitPosition = init => {
    this.setState({ initPosition: init });
  };

  render() {
    const {
      isLoggedIn,
      isInitialized,
      configUi,
      isScooterServiceActive,
      isForceUpdateProfile,
    } = this.props;

    if (!isInitialized || (configUi.error === '' && configUi.isFetching))
      return (
        <BrandContainer bottomPos={-200}>
          <FadeInView style={styles.main} key="1">
            <Loader text="Carregando..." style={styles.loader} isLight />
          </FadeInView>
        </BrandContainer>
      );

    if (isLoggedIn && isScooterServiceActive) {
      return <ScooterServices />;
    }
    if (isLoggedIn && !isForceUpdateProfile) {
      return (
        <LoggedHome
          onRef={ref => {
            this._loggedHomeRef = ref;
          }}
          openOnLogin={this._openOnLoginModalName}
          initPosition={this.state.initPosition}
          onInitPosition={this._onInitPosition}
        />
      );
    }

    return (
      <NewBrandContainer bottomPos={-200} shouldShowBgMountains={false} shouldBeGradient>
        <UnloggedHome openOnLogin={this._setOpenOnLogin} />
        {/* { __DEV__ &&
          <Button
            onPress={() => {
              sendNotification(this.props.fcmToken);
            }}
            style={{marginTop: 8}}
          >
            Enviar notificação
          </Button>
        } */}
      </NewBrandContainer>
    );
  }
}

// component styles
const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 36,
  },
  mainEmptyState: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 36,
  },
  loader: {
    alignSelf: 'center',
  },
  loginInfo: {
    paddingHorizontal: 16,
    marginTop: -24,
  },
  loginText: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: 'white',
  },
  requestFeedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
};

// redux connect and export
const mapStateToProps = state => {
  const isForceUpdateProfile = state.data ? state.data.profile.isForceUpdateProfile : false;

  return {
    configUi: getConfigContentUI(state),
    hasConfigError: getHasConfigError(state),
    isInitialized: state.init,
    isLoggedIn: getIsLoggedIn(state),
    cards: getTransportCards(state),
    cardData: getCurrentTransportCard(state),
    cardListUi: getCardListUI(state),
    cardHelpId: getCardHelpId(state),
    bomCreditValueRange: getBOMCreditValueRange(state),
    fcmToken: state.profile.fcmToken,
    currentCardId: state.transportCard.currentDetailId,
    currentCardIdNextRecharges: getCurrentCardNextRecharges(state),
    notificationsUi: getNotificationsUI(state),
    notificationCount: getUnreadNotificationCount(state),
    issuerConfig: getIssuerConfig(state),
    currentStep: state.auth.currentStep,
    isScooterServiceActive: state.scooter.isActive,
    currentRoute: getStateCurrentRouteName(state.nav),
    isLoggedInForceUpdateProfile: getIsLoggedInForceUpdateProfile(state),
    isForceUpdateProfile,
  };
};

const Home = connect(mapStateToProps)(HomeView);

export default Home;