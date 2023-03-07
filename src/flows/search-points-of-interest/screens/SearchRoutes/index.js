// NPM imports
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';

//3rd party components
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

// VouD Imports
import { colors } from '../../../../styles';
import ServicesMenu from '../../../../flows/home/components/ServicesMenu';
import ButtonIcon from '../../../../flows/home/components/ButtonIcon';
import RouteInfoModal from './RouteInfoModal';
import ResultSearchRouteList from './ResultSearchRouteList';
import SearchRouteHeader from './SearchRouteHeader';

import { getHasProfileAlerts } from '../../../../redux/selectors';
import { mergeRequestUI } from '../../../../redux/utils';
import { DEFAULT_LAT_DELTA, DEFAULT_LNG_DELTA } from '../../../../flows/home/actions/utils';
import mapStyle from '../../../../flows/home/components/PointsOfInterestMap/mapStyle';
import { fetchRoutes } from '../../actions';
import { navigateToRoute } from '../../../../redux/nav';
import { routeNames } from '../../../../shared/route-names';
import { GAEventParams, GATrackEvent } from '../../../../shared/analytics';

import {change } from 'redux-form';


const HEADER_HEIGHT = 148;

class SearchRoutesView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isServiceMenuCollapsed: true,
      isRouteInfoModalVisible: false,
    }
    this._mapRef = null;
    this._mapHeight = 0;
  }

  componentDidMount() {
    this._fetchRoutes();
  }

  _close = () => {
    this.props.dispatch(NavigationActions.back());
  }

  _toggleRouteInfoModal = (item) => {
    const { categories: { BUTTON }, actions: { CLICK }, labels: { OPEN_GOOGLE_MAPS_TRACE_ROUTE } } = GAEventParams;
    GATrackEvent(BUTTON, CLICK, `${OPEN_GOOGLE_MAPS_TRACE_ROUTE}`);

    this.props.dispatch(navigateToRoute(routeNames.TRACE_ROUTES,{
        item
      }));
  }

  _onOriginClear = () => {

    const { navigation } = this.props;
    const clearOriginCallback = navigation.getParam('clearOriginCallback');
    this.props.dispatch(change("searchForm", 'hasSelectedDestination', false));
    clearOriginCallback();
    this.props.dispatch(NavigationActions.back());
  }

  _onDestinationClear = () => {
    const { navigation } = this.props;
    const clearDestinationCallback = navigation.getParam('clearDestinationCallback');
    this.props.dispatch(change("searchForm", 'hasSelectedDestination', false));
    clearDestinationCallback();
    this.props.dispatch(NavigationActions.back());
  }

  _onOriginEdit = () => {
    const { navigation } = this.props;
    const editOriginCallback = navigation.getParam('editOriginCallback');
    editOriginCallback();
    this.props.dispatch(NavigationActions.back());
  }

  _onDestinationEdit = () => {
    const { navigation } = this.props;
    const editDestinationCallback = navigation.getParam('editDestinationCallback');
    editDestinationCallback();
    this.props.dispatch(NavigationActions.back());
  }

  //Result Search Route
  _renderResultSearchRouteList = () => {
    const { routeSearch } = this.props;
    return (
      <ResultSearchRouteList
        routeSearch={routeSearch}
        onToggleRouteInfoModal={this._toggleRouteInfoModal}
        onRetry={this._fetchRoutes}
      />
    );
  }

  _handleServiceMenuToggle = toggle => {
    this.setState({ isServiceMenuCollapsed: toggle });
  }

  _navigateToMyProfile = () => {
    this.props.dispatch(navigateToRoute(routeNames.MY_PROFILE));
  }

  _fetchRoutes = () => {
    const { navigation, dispatch } = this.props;
    const origin = navigation.getParam('originLocation');
    const destination = navigation.getParam('destinationLocation');

    dispatch(fetchRoutes({ origin, destination }));
  }

  render() {
    const {
      hasAlert,
      screenRequestsUi,
      userPosition,
      navigation,
      routeSearch,
    } = this.props;
    const {
      isServiceMenuCollapsed,
      isRouteInfoModalVisible,
    } = this.state;
    const origin = navigation.getParam('originLocation');
    const destination = navigation.getParam('destinationLocation');

    return (
      <View style={styles.container}>
        <MapView
          ref={ref => { this._mapRef = ref }}
          provider={PROVIDER_GOOGLE}
          style={styles.mapContainer}
          initialRegion={{
            ...userPosition,
            latitudeDelta: DEFAULT_LAT_DELTA,
            longitudeDelta: DEFAULT_LNG_DELTA,
          }}
          customMapStyle={mapStyle}
          showsIndoors={false}
          showsIndoorLevelPicker={false}
        >
        </MapView>
        <View style={styles.wrapperHeader}>
          <View style={styles.header}>
            <LinearGradient
              colors={['rgba(110, 62, 145, 1)', 'transparent']}
              style={styles.linearGradient}
              pointerEvents="none"
            />
            <ButtonIcon
              style={styles.backIcon}
              onPress={this._onDestinationEdit}
              icon="md-arrow-back"
            />
            <SearchRouteHeader
              origin={origin}
              destination={destination}
              onOriginClear={this._onOriginClear}
              onDestinationClear={this._onDestinationClear}
              onOriginEdit={this._onOriginEdit}
              onDestinationEdit={this._onDestinationEdit}
            />
          </View>
        </View>
        <ServicesMenu
          style={styles.serviceMenu}
          purchaseCredit
          onToggle={this._handleServiceMenuToggle}
          hasAlert={hasAlert}
          onCompleteRegistration={this._navigateToMyProfile}
          parentRequestsUi={screenRequestsUi}
          shouldRenderCenterOnLocationButton={false}
          renderOnTop={this._renderResultSearchRouteList}
          isServiceMenuCollapsed={isServiceMenuCollapsed}
          shouldRenderToast={false}
          isMenuService={false}
        />
        <RouteInfoModal
          isVisible={isRouteInfoModalVisible}
          onDismiss={this._toggleRouteInfoModal}
          origin={origin}
          destination={destination}
        />
      </View>
    )
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: HEADER_HEIGHT
  },
  wrapperHeader: {
    marginBottom: 8,
    height: HEADER_HEIGHT,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    elevation: 9,
    zIndex: 1,
  },
  mapContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 32,
    marginBottom: 16,
  },
  serviceMenu: {
    top: HEADER_HEIGHT + 8,
    backgroundColor: 'white'
  },
  icon: {
    fontSize: 24,
    color: colors.BRAND_PRIMARY
  },
  backIcon: {
    alignSelf: 'center',
    marginRight: 8,
  },
});

// Redux
const mapStateToProps = state => ({
  routeSearch: state.searchPointsOfInterest.routeSearch,
  journey: state.searchPointsOfInterest.routeSearch.data,
  hasAlert: getHasProfileAlerts(state),
  screenRequestsUi: mergeRequestUI([
    state.searchPointsOfInterest.nextPoint,
    {
      ...state.searchPointsOfInterest.arrivalForecast,
      error: '', // Note - Arrival forecast silenced due to intermittent SPTrans service
    },
    {
      ...state.searchPointsOfInterest.busLineSearch,
      error: '', // Note - Bus line search silenced due to intermittent SPTrans service
    }
  ]),
  userPosition: {
    latitude: state.profile.position.latitude,
    longitude: state.profile.position.longitude,
    latitudeDelta: state.profile.position.latitudeDelta,
    longitudeDelta: state.profile.position.longitudeDelta,
  },
});

export const SearchRoutes = connect(mapStateToProps)(SearchRoutesView);
