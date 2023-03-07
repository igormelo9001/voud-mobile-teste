// NPM imports
import React, { Component } from 'react';
import { View, StyleSheet, AppState } from 'react-native';
import { connect } from 'react-redux';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { NavigationActions } from 'react-navigation';

// VouD imports
import Header, { headerActionTypes } from '../../../components/Header';
import Button from '../../../components/Button';
import Loader from '../../../components/Loader';
import LoadMask from '../../../components/LoadMask';
import { openMenu } from '../../../redux/menu';
import { navigateToRoute } from '../../../redux/nav';
import { colors } from '../../../styles';
import { routeNames } from '../../../shared/route-names';
import { getCurrentPosition } from '../../../utils/geolocation';
import { showToast, toastStyles } from '../../../redux/toast';

// Module imports
import OriginDestinationSearch from '../components/OriginDestinationSearch';
import { fetchPlaceDetails, fetchPlaceTextSearch, searchChangeDirections, clearPlaceDetails } from '../actions';
import { setPosition } from '../../../redux/profile';
import { getPaddingForNotch } from '../../../utils/is-iphone-with-notch';

// Screen component
class MobilityServicesView extends Component {
  constructor(props) {
    super(props);

    this.mapViewRef = null;

    this.state = {
      shouldRenderMap: false,
      isSettingLocal: false,
    };
  }

  componentDidMount() {
    // wait 1s before render map
    this.renderDelay = setTimeout(() => {
      this.setState({ shouldRenderMap: true });
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.renderDelay);
    clearTimeout(this.getUserLocationDelay);

    // Note - the place details should only be cleared if the screen was unmounted by an user interaction (active state).
    // On Android, a screen could be unmounted if the Activity is stopped. This can occur when the app is in background and the free memory is low.
    if (AppState.currentState === 'active') {
      this.props.dispatch(clearPlaceDetails());
    }
  }

  changeDirections = () => {
    this.props.dispatch(searchChangeDirections());
  };

  getUserLocation = (config, shouldRetry = false, retryConfig) => {
    const { dispatch } = this.props;

    return new Promise(async (resolve, reject) => {
      try {
        const position = await getCurrentPosition(config, shouldRetry, retryConfig);
        dispatch(setPosition(position.latitude, position.longitude));
        this.setState({ isGettingUserLocation: false });
        resolve(true);
      } catch (error) {
        this.setState({ isGettingUserLocation: false });
        reject(false);
      }
    });
  }

  fitToSuppliedMarkers = () => {
    const { origin, destination } = this.props;
    const hasOrigin = origin && origin.geometry && origin.geometry.location;
    const hasDestination = destination && destination.geometry && destination.geometry.location;

    if (this.mapViewRef && (hasOrigin || hasDestination)) {
      this.mapViewRef.fitToSuppliedMarkers(['origin', 'destination'], true);
    } 
  }

  getPlaceDetails = (placeId, isOrigin = false, isDestination = false) => {
    this.setState({ isSettingLocal: true });
    this.props.dispatch(fetchPlaceDetails(placeId, isOrigin, isDestination)).then(
      () => {
        this.setState({ isSettingLocal: false });
        this.fitToSuppliedMarkers();
      },
      (error) => {
        if (__DEV__) console.tron.log(error);
        this.setState({ isSettingLocal: false });
        this.props.dispatch(showToast('Ocorreu um erro ao consultar os dados do local selecionado.', toastStyles.ERROR));
      },
    );
  };

  useMyLocation = async () => {
    const { dispatch, position } = this.props;
    const { latitude, longitude } = position;

    try {
      const response = await dispatch(fetchPlaceTextSearch(`${latitude},${longitude}`));
      this.getPlaceDetails(response.results[0].place_id, true);
      return true;
    } catch (error) {
      if (__DEV__) console.tron.log(error);
      this.setState({ isSettingLocal: false });
      this.props.dispatch(showToast('Ocorreu um erro ao consultar os dados da sua localização.', toastStyles.ERROR));
      return false;
    }
  };

  openMenu = () => {
    const { dispatch } = this.props;
    dispatch(openMenu());
  };

  renderMap = () => {
    const { shouldRenderMap, isGettingUserLocation } = this.state;
    const { position, origin, destination } = this.props;
    const { latitude, longitude, defaultLat, defaultLng } = position;
    
    if (shouldRenderMap && !isGettingUserLocation) {
      const hasOrigin = origin && origin.geometry && origin.geometry.location;
      const hasDestination = destination && destination.geometry && destination.geometry.location;

      return (
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={(el) => { this.mapViewRef = el; }}
          initialRegion={{
            latitude: latitude || defaultLat,
            longitude: longitude || defaultLng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
          style={styles.map}
          onMapReady={this.fitToSuppliedMarkers}
          onLayout={this.fitToSuppliedMarkers}
          showsIndoors={false}
          showsIndoorLevelPicker={false}
        >
          { hasDestination && hasOrigin && (
            <MapView.Marker
              identifier="origin"
              coordinate={{
                latitude: origin.geometry.location.lat,
                longitude: origin.geometry.location.lng
              }}
            />
          )}
          { hasDestination && (
            <MapView.Marker
              identifier="destination"
              coordinate={{
                latitude: destination.geometry.location.lat,
                longitude: destination.geometry.location.lng
              }}
            />
          )}
        </MapView>
      );
    }
      
    return (
      <Loader text="Carregando mapa..." />
    );
  };

  render() {
    const { dispatch, origin, destination } = this.props;

    return (
      <View style={styles.container}>
        <Header
          title="Taxi e mobilidade"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: () => dispatch(NavigationActions.back())
          }}
        />
        <OriginDestinationSearch
          origin={origin}
          destination={destination}
          onOriginPress={() => {
            dispatch(navigateToRoute(
              routeNames.MOBILITY_SERVICES_SEARCH_ADDRESS,
              {
                checkPermissionAndUseLocation: this.useMyLocation,
                select: this.getPlaceDetails,
                isOrigin: true,
                isDestination: false,
              },
            ));
          }}
          onDestinationPress={() => {
            dispatch(navigateToRoute(
              routeNames.MOBILITY_SERVICES_SEARCH_ADDRESS,
              {
                select: this.getPlaceDetails,
                isOrigin: false,
                isDestination: true,
              },
            ));
          }}
          onMyLocationPress={this.useMyLocation}
          onChangeDirection={this.changeDirections}
        />
        <View style={styles.mapContainer}>
          {this.renderMap()}
          <Button
            onPress={() => { dispatch(navigateToRoute(routeNames.MOBILITY_SERVICES_ESTIMATES)); }}
            disabled={!origin.name || !destination.name}
            style={styles.button}
          >
            Comparar preços
          </Button>
        </View>
        {this.state.isSettingLocal && <LoadMask message="Selecionando local" />}
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    lineHeight: 32,
  },
  mapContainer: {
    flex: 1,
    paddingBottom: getPaddingForNotch(),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: colors.GRAY_LIGHTER,
    backgroundColor: colors.GRAY_LIGHTER
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
  button: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 24
  },
});

// Redux

const mapStateToProps = state => ({
  position: state.profile.position,
  origin: state.mobilityServices.placeDetails.data.origin,
  destination: state.mobilityServices.placeDetails.data.destination,
});

export const MobilityServices = connect(mapStateToProps)(MobilityServicesView);

export * from './MobilityServicesSearchAddress';
export * from './MobilityServicesEstimates';
export * from './MobilityServicesConfirmation';
