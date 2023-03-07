import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";

// VouD imports
import Header from "../../components/Header";
import ServicesMenu from "../../components/ServicesMenu";
import PointsOfInterestMap from "../../components/PointsOfInterestMap";
import { colors } from "../../../../styles";
import { configurePosition } from "../../../../redux/profile";
import { fetchCardList } from "../../../../redux/transport-card";
import { getNotifications } from "../../../../redux/notifications";

import {
  getCardListUI,
  getNotificationsUI,
  getHasProfileAlerts,
  getHasNotificationAlerts,
  getConfigContentUI
} from "../../../../redux/selectors";

import {
  fetchPointsOfInterest,
  fetchDynamicPoints,
  fetchDynamicPointsClear,
  fetchPointsOfInterestClear,
  fetchPointsOfTembici,
  fetchPointsOfTembiciClear,
  fetchPointsOfZazcar,
  fetchPointsOfZazcarClear,
  showDirectionZazcarAction
} from "../../actions";
import { pointsOfInterestTypes } from "../../actions/enums";

import { getStateCurrentRouteName } from "../../../../utils/nav-util";
import { routeNames } from "../../../../shared/route-names";
import { getVouDRadiusFromViewableArea } from "../../../../utils/get-radius-from-viewable-area";
import { mergeRequestUI } from "../../../../redux/utils";
import { shouldRenderDynamicPoints } from "../../actions/utils";
import { getPointsOfInterest, getNeabyZazcar } from "../../reducer";
import { dispatchCheckLastTermsAccepted } from "../../../usage-terms/utils";
import { navigateToRoute, navigateFromHome } from "../../../../redux/nav";
import { GATrackEvent, GAEventParams } from "../../../../shared/analytics";
import { clearPreAuthRequestCardClear } from "../../../../redux/login";
import { fetchVerifyCardRequested } from "../../../RequestCard/store/requestCard";

import {
  fetchPointsRide,
  pointRideClear
} from "../../../scooter/store/ducks/pointsRide";

import { fetchAuthRide } from "../../../scooter/store/ducks/authRide";
import {
  fetchPendingRide,
  fetchPendingTransactionRide
} from "../../../../redux/scooter";
import { getJson } from "../../../../utils/async-storage";
import { asyncStorageKeys } from "../../../../redux/init";
import { editPersonalDataClear } from "../../../EditUserData/store";
import { fetchTicketUnitaryList } from "../../../TicketUnitary/store/ducks/ticketUnitary";
import { fetchUnitaryAvailable } from "../../../TicketUnitary/store/ducks/ticketUnitaryAvailable";
import { getPointsOfInterestVisible } from "../../../../shared/remote-config";

class LoggedHome extends Component {
  static propTypes = {
    watchPositionId: PropTypes.number,
    dispatch: PropTypes.func,
    hasAlert: PropTypes.bool,
    currentRouteName: PropTypes.string,
    position: PropTypes.object,
    currentMapPosition: PropTypes.object,
    notificationsUi: PropTypes.object,
    cardListUi: PropTypes.object,
    pointsOfInterestData: PropTypes.array,
    pointsOfInterestUi: PropTypes.object,
    isServiceMenuCollapsed: PropTypes.bool,
    geolocPermGranted: PropTypes.bool,
    positionError: PropTypes.object,
    hasProfileAlerts: PropTypes.bool,
    hasNotificationAlerts: PropTypes.bool,
    nearbyTembici: PropTypes.object,
    nearbyZazcar: PropTypes.object,
    showDirectionZazcar: PropTypes.bool,
    serviceMenuType: PropTypes.string,
    pointsRideData: PropTypes.array
  };

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      initPosition: false,
      isTembici: false,
      isZazcar: false,
      isBus: true,
      isScoo: false
    };

    this._mapRef = null;
    this._renderDelay = null;
  }

  componentDidMount() {
    this._isMounted = true;

    const {
      dispatch,
      serviceMenuType,
      position,
      isRequestCard,
      hasAlert
    } = this.props;
    this._renderDelay = setTimeout(() => {
      dispatch(configurePosition(this._centerLocation)).then(() =>
        this.setState({ initPosition: true })
      );
    }, 1000);

    const modal =
      serviceMenuType == "rentCar"
        ? pointsOfInterestTypes.RENT_CAR
        : serviceMenuType == "scooter"
        ? pointsOfInterestTypes.SCOO
        : null;

    const callback =
      serviceMenuType == "rentCar"
        ? () => {
            dispatch(fetchPointsOfZazcar(position));
          }
        : () => dispatch(fetchPointsRide());

    modal && this._selectModalMap(modal, callback);

    this.refreshAvailable();
    this._renderRidePendindAndTransaction();
    this._refreshNotifications();
    this._refreshCardList();

    dispatchCheckLastTermsAccepted(dispatch);

    // if (isRequestCard && !hasAlert) {
    //   dispatch(clearPreAuthRequestCardClear());
    //   this._checkCard().then(response => {
    //     if (parseInt(response) === 200) {
    //       dispatch(navigateFromHome(routeNames.REQUEST_CARD));
    //     }
    //   });
    // }
  }

  _checkCard = async () => {
    const { dispatch, profileData } = this.props;
    const response = await dispatch(fetchVerifyCardRequested(profileData.cpf));
    return response.returnCode;
  };

  _renderRidePoints = async () => {
    const { dispatch, profileData } = this.props;

    const sessionTokenRide = await getJson(asyncStorageKeys.scooterToken);

    if (!sessionTokenRide) {
      dispatch(
        fetchAuthRide(profileData.name, profileData.cpf, profileData.email)
      ).then(() => {
        dispatch(fetchPointsRide());
      });
    } else {
      dispatch(fetchPointsRide());
    }
  };

  componentWillReceiveProps(nextProps) {
    const {
      hasProfileAlerts,
      editUser: {
        personalData: { forceUpdateSucess }
      },
      dispatch
    } = this.props;

    if (hasProfileAlerts && !nextProps.hasProfileAlerts) {
      this._refreshCardList();
    }

    if (forceUpdateSucess) {
      this._refreshCardList();
      dispatch(editPersonalDataClear());
    }
  }

  _renderRidePendindAndTransaction = () => {
    const { dispatch, profileData } = this.props;
    dispatch(
      fetchAuthRide(profileData.name, profileData.cpf, profileData.email)
    ).then(response => {
      dispatch(fetchPendingRide(profileData.id)).then(response => {
        if (!response.pendingRide) {
          dispatch(fetchPendingTransactionRide(profileData.id));
        }
      });
    });
  };

  clearMap = (dispatch, watchPositionId) => {
    clearTimeout(this._renderDelay);
    navigator.geolocation.clearWatch(watchPositionId);

    dispatch(fetchDynamicPointsClear());
    dispatch(fetchPointsOfInterestClear());
    dispatch(fetchPointsOfTembiciClear());
    dispatch(fetchPointsOfZazcarClear());
    dispatch(pointRideClear());
  };

  componentWillUnmount() {
    const { dispatch, watchPositionId } = this.props;
    this.clearMap(dispatch, watchPositionId);
  }

  shouldComponentUpdate() {
    const { currentRouteName } = this.props;
    return (
      currentRouteName === routeNames.HOME ||
      currentRouteName === routeNames.TRANSPORT_SEARCH_RESULT
    );
  }

  _shouldRenderMap() {
    const { position, currentRouteName } = this.props;
    // We can't render two MapViews on Android, because it causes marker to flick
    // See - https://stackoverflow.com/questions/37743929/two-mapviews-in-one-android-activity-jumping-flickering-markers
    if (currentRouteName === routeNames.TRANSPORT_SEARCH_RESULT) return false;
    return this.state.initPosition && position.latitude;
  }

  _selectModalMap = (select, fetchCallBack) => {
    this.setState(
      { isTembici: false, isBus: false, isZazcar: false, isScoo: false },
      () => {
        switch (select) {
          case pointsOfInterestTypes.RENT_CAR:
            this.setState({ isZazcar: true }, () => {
              fetchCallBack();
            });
            break;
          case pointsOfInterestTypes.BIKE:
            this.setState({ isTembici: true }, () => {
              fetchCallBack();
            });
            break;
          case pointsOfInterestTypes.BUS:
            this.setState({ isBus: true }, fetchCallBack);

            break;

          case pointsOfInterestTypes.SCOO:
            this.setState({ isScoo: true }, fetchCallBack);
            break;

          default:
            this.setState({ isBus: true }, this._fetchPointsOfInterest());
            break;
        }
      }
    );
  };

  navigateToZazcar = () => {
    const { nearbyZazcar } = this.props;
    if (!nearbyZazcar) return;
    const { detail, name, description } = nearbyZazcar;
    const {
      categories: { BUTTON },
      actions: { CLICK },
      labels: { MENU_MOBILITY_RENTCAR }
    } = GAEventParams;

    GATrackEvent(BUTTON, CLICK, MENU_MOBILITY_RENTCAR);
    this.props.dispatch(
      navigateToRoute(routeNames.ZAZCAR, {
        pointName: name,
        pointAddress: description,
        details: detail
      })
    );
  };

  _refreshCardList = () => {
    const { cardListUi, dispatch } = this.props;

    if (!cardListUi.isFetching) {
      dispatch(fetchCardList());
    }
  };

  refreshAvailable = async () => {
    const { dispatch } = this.props;
    dispatch(fetchUnitaryAvailable());
  };

  _refreshNotifications = () => {
    const { notificationsUi, dispatch } = this.props;

    if (!notificationsUi.isFetching) {
      dispatch(getNotifications());
    }
  };

  _fetchDynamicPoints = (regionRadius, latitude, longitude) => {
    this.props.dispatch(fetchDynamicPoints(regionRadius, latitude, longitude));
  };

  _fetchPointsOfInterest = async (mapPosition, regionRadius) => {
    const isPointOfInterest = JSON.parse(await getPointsOfInterestVisible());
    if (!isPointOfInterest.visible) return;

    const { dispatch, dynamicPointsUi } = this.props;
    const currentMapPosition = mapPosition || this.props.currentMapPosition;
    const {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta
    } = currentMapPosition;

    if (latitude == null && longitude == null) return;
    const mapRegionRadius =
      regionRadius ||
      getVouDRadiusFromViewableArea(
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta
      );

    const canRenderDynamicPoints = shouldRenderDynamicPoints(longitudeDelta);

    if (dynamicPointsUi.error) {
      if (canRenderDynamicPoints) {
        this._fetchDynamicPoints(mapRegionRadius, latitude, longitude);
      } else {
        dispatch(fetchDynamicPointsClear());
      }
      return;
    }

    dispatch(
      fetchPointsOfInterest(
        mapRegionRadius,
        latitude,
        longitude,
        longitudeDelta
      )
    );

    if (canRenderDynamicPoints) {
      this._fetchDynamicPoints(mapRegionRadius, latitude, longitude);
    }
  };

  _centerLocation = () => {
    if (this._mapRef) this._mapRef.centerLocation();
  };

  _onNearbyTembiciLocation = () => {
    const { isTembici } = this.state;
    if (isTembici) {
      if (this._mapRef) this._mapRef.centerTembiciLocation();
    }
  };

  _onNearbyZazcarLocation = () => {
    const { showDirectionZazcar, dispatch } = this.props;

    const { isZazcar } = this.state;

    dispatch(showDirectionZazcarAction(!showDirectionZazcar));

    if (isZazcar) {
      if (this._mapRef) this._mapRef.centerZazCarLocation();
      setTimeout(() => {
        this.navigateToZazcar();
      }, 2000);
    }
  };

  _busLocation = () => {
    const { dispatch, watchPositionId } = this.props;

    this.clearMap(dispatch, watchPositionId);

    this._selectModalMap(
      pointsOfInterestTypes.BUS,
      this._fetchPointsOfInterest
    );
  };

  _onScooLocation = () => {
    const { dispatch, watchPositionId } = this.props;

    this.clearMap(dispatch, watchPositionId);

    this._selectModalMap(pointsOfInterestTypes.SCOO, this._renderRidePoints);
  };

  _bycicleLocation = () => {
    const { dispatch, watchPositionId, position } = this.props;

    this.clearMap(dispatch, watchPositionId);

    this._selectModalMap(pointsOfInterestTypes.BIKE, () => {
      dispatch(fetchPointsOfTembici(position));
    });
  };

  _rentCarLocation = () => {
    const { dispatch, watchPositionId, position } = this.props;

    this.clearMap(dispatch, watchPositionId);

    this._selectModalMap(pointsOfInterestTypes.RENT_CAR, () => {
      dispatch(fetchPointsOfZazcar(position));
    });
  };

  _menuTembiciLocation = () => {
    const { dispatch, watchPositionId, position } = this.props;

    this.clearMap(dispatch, watchPositionId);

    this._selectModalMap(pointsOfInterestTypes.BIKE, () => {
      dispatch(fetchPointsOfTembici(position));
    });
  };

  _menuZazcarLocation = () => {
    const { dispatch, watchPositionId, position } = this.props;

    this.clearMap(dispatch, watchPositionId);

    dispatch(fetchPointsOfZazcar(position));

    this._selectModalMap(pointsOfInterestTypes.RENT_CAR, () => {
      dispatch(fetchPointsOfZazcar(position));
    });
  };

  _navigateToMyProfile = () => {
    this.props.dispatch(navigateToRoute(routeNames.MY_PROFILE));
  };

  _parentRequestsRetry = () => {
    const { isTembici } = this.state;
    if (!isTembici) {
      this._fetchPointsOfInterest();
    }
  };

  render() {
    const {
      pointsOfInterestData,
      position,
      pointsOfInterestUi,
      isServiceMenuCollapsed,
      serviceMenuType,
      geolocPermGranted,
      positionError,
      hasProfileAlerts,
      hasNotificationAlerts,
      currentMapPosition,
      nearbyTembici,
      nearbyZazcar,
      showDirectionZazcar,
      pointsRideData
    } = this.props;

    const { isTembici, isBus, isZazcar, isScoo, renderRoute } = this.state;
    return (
      <Fragment>
        <View style={styles.container}>
          {this._shouldRenderMap() && (
            <PointsOfInterestMap
              mapPosition={currentMapPosition}
              pointsOfInterestData={pointsOfInterestData}
              onFetchPointOfInterest={this._fetchPointsOfInterest}
              onFetchPointOfTembici={fetchPointsOfTembici}
              onFetchPointsOfZazcar={fetchPointsOfZazcar}
              userPosition={position}
              isTembici={isTembici}
              isZazcar={isZazcar}
              isBus={isBus}
              isScoo={isScoo}
              showDirectionZazcar={showDirectionZazcar}
              nearbyTembici={nearbyTembici}
              nearbyZazcar={nearbyZazcar}
              isServiceMenuCollapsed={isServiceMenuCollapsed}
              renderRoute={renderRoute}
              onRef={ref => {
                this._mapRef = ref;
              }}
              pointsRideData={pointsRideData}
            />
          )}
          <Header
            geolocPermGranted={geolocPermGranted}
            hasProfileAlerts={hasProfileAlerts}
            hasNotificationAlerts={hasNotificationAlerts}
          />
        </View>
        <ServicesMenu
          isServiceMenuCollapsed={isServiceMenuCollapsed}
          serviceMenuType={serviceMenuType}
          parentRequestsUi={pointsOfInterestUi}
          positionError={positionError}
          onParentRequestsRetry={this._parentRequestsRetry}
          shouldRenderCenterOnLocationButton
          onCenterLocation={this._centerLocation}
          onBycicleLocation={this._bycicleLocation}
          onRentCarLocation={this._rentCarLocation}
          onBusLocation={this._busLocation}
          onScooLocation={this._onScooLocation}
          menuTembiciLocation={this._menuTembiciLocation}
          onNearbyTembiciLocation={this._onNearbyTembiciLocation}
          onNearbyZazcarLocation={this._onNearbyZazcarLocation}
          menuZazcar={this._menuZazcar}
          isTembici={isTembici}
          isZazcar={isZazcar}
          isBus={isBus}
          isScoo={isScoo}
          onCompleteRegistration={this._navigateToMyProfile}
        />
      </Fragment>
    );
  }
}

export const SERVICE_MENU_HEIGHT = 162;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: SERVICE_MENU_HEIGHT,
    backgroundColor: "white"
  },
  containerModal: {
    justifyContent: "flex-start",
    backgroundColor: "white",
    margin: 0,
    marginLeft: 48
  },
  loaderContainer: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: colors.BRAND_PRIMARY
  }
});

function mapStateToProps(state) {
  return {
    currentRouteName: getStateCurrentRouteName(state.nav),
    position: {
      latitude: state.profile.position.latitude,
      longitude: state.profile.position.longitude,
      latitudeDelta: state.profile.position.latitudeDelta,
      longitudeDelta: state.profile.position.longitudeDelta
    },
    currentMapPosition: {
      latitude: state.pointsOfInterest.currentMapPosition.latitude,
      longitude: state.pointsOfInterest.currentMapPosition.longitude,
      latitudeDelta: state.pointsOfInterest.currentMapPosition.latitudeDelta,
      longitudeDelta: state.pointsOfInterest.currentMapPosition.longitudeDelta
    },
    cardListUi: getCardListUI(state),
    notificationsUi: getNotificationsUI(state),
    pointsOfInterestData: getPointsOfInterest(state),
    dynamicPointsUi: state.pointsOfInterest.dynamicPoints,
    pointsOfInterestUi: mergeRequestUI([
      state.pointsOfInterest.staticPoints,
      {
        ...state.pointsOfInterest.dynamicPoints,
        error: "" // Note - Dynamic points silenced due to intermittent SPTrans service
      }
    ]),
    isServiceMenuCollapsed: state.config.isServiceMenuCollapsed,
    serviceMenuType: state.config.serviceMenuType,
    geolocPermGranted: state.profile.position.geolocPermGranted,
    positionError: state.profile.position.error,
    hasProfileAlerts: getHasProfileAlerts(state),
    hasNotificationAlerts: getHasNotificationAlerts(state),
    pointsRideData: state.pointsRide.data,
    profileData: state.profile.data,
    nearbyTembici: state.pointsOfInterest.nearbyTembici,
    nearbyZazcar: getNeabyZazcar(state),
    showDirectionZazcar: state.pointsOfInterest.showDirectionZazcar,
    isRequestCard: state.login.preAuthRequestCard.isRequestCard,
    hasAlert: getHasProfileAlerts(state),
    content: state.config.content,
    editUser: state.editUser
  };
}

export default connect(mapStateToProps)(LoggedHome);
