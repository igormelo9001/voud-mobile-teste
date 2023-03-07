// NPM imports
import React from 'react';
import { StyleSheet, Platform, PixelRatio } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

// Module imports
import UserMarker from '../../../../flows/home/components/PointsOfInterestMap/UserMarker';
import StopMarker from '../../../../flows/home/components/PointsOfInterestMap/StopMarker';
import mapStyle from '../../../../flows/home/components/PointsOfInterestMap/mapStyle';
import BusMarker from '../../../../flows/home/components/PointsOfInterestMap/BusMarker';
import { pointsOfInterestTypes } from '../../../../flows/home/actions/enums';
import { centerMarker, DEFAULT_LAT_DELTA, DEFAULT_LNG_DELTA } from '../../../../flows/home/actions/utils';
import { SERVICE_MENU_HEIGHT } from '../../../../flows/home/screens/LoggedHome';
import { routeTypes } from '..';
import { TYPES } from '../../components/SwitchTypeSearch';
import { companies } from '.';

// Component

class TransportSearchMap extends React.Component {
  constructor(props) {
    super(props);
    this._markerRefs = {};
    this._mapRef = null;
    this._mapHeight = 0;
    this._centerDelay = null;
  }

  componentDidMount() {
    this.props.onRef(this);
  }
  
  _fitToCoordinates = (pos, otherPos) => {
    let edgePadding = {
      top: 200,
      bottom: 68 + (this.props.isServiceMenuCollapsed ? 0 : SERVICE_MENU_HEIGHT / 2),
      left: 104,
      right: 104,
    };

    if (Platform.OS === 'android') {
      edgePadding = {
        top: PixelRatio.getPixelSizeForLayoutSize(edgePadding.top),
        right: PixelRatio.getPixelSizeForLayoutSize(edgePadding.right),
        left: PixelRatio.getPixelSizeForLayoutSize(edgePadding.left),
        bottom: PixelRatio.getPixelSizeForLayoutSize(edgePadding.bottom)
      };
    }

    if (this._mapRef) {
      this._mapRef.fitToCoordinates(
        [ pos, otherPos ],
        {
          edgePadding,
          animated: true,
        },
      );
    }
  }

  // public method, to be used in a parent component
  centerLocation = () => {
    const { userPosition, nextPoint: { data }, searchType, searchItem } = this.props;

    if (searchType === TYPES.POINTS) {
      this._fitToCoordinates(userPosition, 
        { latitude: searchItem.positionLatitude, longitude: searchItem.positionLongitude, });
      this._markerRefs[searchItem.id].showCallout();
      return;
    }

    if (this._hasNextPoint()) {
      const nearestStation = data.points.find(el => el.isNearPoint);

      if (nearestStation) {
        this._fitToCoordinates(userPosition, 
          { latitude: nearestStation.positionLatitude, longitude: nearestStation.positionLongitude });

        // Requested
        if (this._markerRefs[nearestStation.id] && data.pointType !== pointsOfInterestTypes.STOP_BUS || 
            this._hasArrivalForecast()) {
          this._markerRefs[nearestStation.id].showCallout();
        }
      } else {
        if (__DEV__) console.tron.log('nearestStation is null', true);
      }
    }
  };

  _onMapReady = () => {
    const { searchType, onMapReady } = this.props;

    if (searchType === TYPES.POINTS) {
      clearInterval(this._centerDelay);
      this._centerDelay = setTimeout(() => {
        this.centerLocation();
      }, 750);
    }
    onMapReady();
  };

  _hasNextPoint = () => Object.keys(this.props.nextPoint.data).length > 0;

  _hasArrivalForecast = () => Object.keys(this.props.arrivalForecast.data).length > 0;

  _renderPointsOfInterest = () => {
    const { 
      userPosition,
      searchType,
      nextPoint,
      arrivalForecast,
      searchItem,
      busLineSearch,
    } = this.props;

    if (searchType === TYPES.POINTS) {
      return (
        <StopMarker
          key={searchItem.id}
          userPosition={userPosition}
          coordinate={{ latitude: searchItem.positionLatitude, longitude: searchItem.positionLongitude }}
          type={pointsOfInterestTypes.RECHARGE}
          pointName={searchItem.name}
          pointAddress={searchItem.description}
          markerRef={el => { this._markerRefs[searchItem.id] = el; }}
        />
      );
    }

    if (this._hasNextPoint()) {

      const nearestStation = nextPoint.data.points.find(el => el.isNearPoint);
      let forecastData =  null;
      if (this._hasArrivalForecast() && nextPoint.data.routeType === routeTypes.BUS) {
        forecastData = {
          arrivalTime: arrivalForecast.data.busList && arrivalForecast.data.busList.length > 0 ?
          arrivalForecast.data.busList[0].estimatedArrivalTime : null
        };
      }
      const hasForecastData = forecastData && forecastData.arrivalTime;
      // Merge Stops/Stations with Bus points
      const pointsData = [...nextPoint.data.points, ...busLineSearch.data];

      return pointsData.map(item => {
        const isNearestStation = item.id === nearestStation.id;
        const line = item.lines[0] ? item.lines[0] : null;
        const alertMessage = isNearestStation && searchItem.company === companies.EMTU ?
          'A EMTU não disponibiliza a localização dos ônibus.' : null;

        return item.pointType === pointsOfInterestTypes.BUS ? 
        (
          <BusMarker
            key={item.externalId}
            coordinate={{
              latitude: item.positionLatitude,
              longitude: item.positionLongitude,
            }}
            lineColor={line ? line.lineColor : ''}
            acceptedCards={item.acceptedCards}
            lineNumber={line ? line.lineNumber : ''}
            lineOrigin={line ? line.origin : ''}
            lineDestiny={line ? line.destiny : ''}
          />
        )
        :
        (
          <StopMarker
            key={item.id}
            userPosition={userPosition}
            coordinate={{ latitude: item.positionLatitude, longitude: item.positionLongitude }}
            type={item.pointType}
            stopName={item.name}
            lines={item.lines}
            timeToArrival={hasForecastData && isNearestStation ? forecastData.arrivalTime : null}
            alertMessage={alertMessage}
            markerRef={el => { this._markerRefs[item.id] = el }}
          />
        )
      });
    }
    return null;
  }

  _renderUserMarker = () => {
    return (
      <UserMarker
        coordinate={this.props.userPosition}
        mapRef={this._mapRef}
      />
    )
  }

  _animateToMarker = (e) => {
    const coordinate = e.nativeEvent.coordinate;
    const latitudeDelta = this._mapPosition ? this._mapPosition.latitudeDelta : DEFAULT_LAT_DELTA;
    const longitudeDelta = this._mapPosition ? this._mapPosition.longitudeDelta : DEFAULT_LNG_DELTA;

    centerMarker(this._mapRef, this._mapHeight, this.props.isServiceMenuCollapsed, coordinate.latitude, coordinate.longitude,
      latitudeDelta, longitudeDelta);
  }

  _onRegionChange = (mapPosition) => {
    this._mapPosition = mapPosition;
  }

  render() {
    const { userPosition } = this.props;

    return (
      <MapView
        ref={(ref) => { this._mapRef = ref }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          ...userPosition,
          latitudeDelta: DEFAULT_LAT_DELTA,
          longitudeDelta: DEFAULT_LNG_DELTA,
        }}
        style={styles.mapContainer}
        onMapReady={this._onMapReady}
        onRegionChangeComplete={this._onRegionChange}
        customMapStyle={mapStyle}
        moveOnMarkerPress={false}
        onLayout={(event) => {
          this._mapHeight = event.nativeEvent.layout.height;
        }}
        onMarkerPress={this._animateToMarker}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
      >
        {this._renderPointsOfInterest()}
        {this._renderUserMarker()}
      </MapView>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  mapContainer: {
    flexGrow: 1,
  },
});

export default TransportSearchMap;
