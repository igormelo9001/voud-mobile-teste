import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";

//3rd party components
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

// Components
import BusMarker from "./BusMarker";
import UserMarker from "./UserMarker";
import StopMarker from "./StopMarker";
import BikeMarker from "./BikeMarker";
import RentCarMarker from "./RentCarMarker";
import PointsRide from "../../../scooter/components/PointsRide";

// redux
import { pointsOfInterestTypes, updateMapPosition } from "../../actions";
import { calculateDistance } from "../../../../utils/haversine";
import { getVouDRadiusFromViewableArea } from "../../../../utils/get-radius-from-viewable-area";

// utils
import { colors } from "../../../../styles";
import mapStyle from "./mapStyle";
import {
  centerMarker,
  DEFAULT_LAT_DELTA,
  DEFAULT_LNG_DELTA
} from "../../actions/utils";
import { isScoo } from "../../../../utils/purchase-history";

const APIKEY_DIRECTION = "AIzaSyBfvv9lgW3Lisf478v8OxHjjDnxtKSYFZw";

class PointsOfInterestMap extends Component {
  constructor(props) {
    super(props);

    this._lastFetchPosition = {
      latitude: null,
      longitude: null,
      latitudeDelta: null,
      longitudeDelta: null
    };
    this._lastFetchRadius = null;
    this._isInitialZoomFinished = false;
    this._mapRef = null;
    this._mapHeight = 0;
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    clearInterval(this._zoomTimeout);
  }

  centerLocation = () => {
    const { isServiceMenuCollapsed } = this.props;
    const { latitude, longitude } = this.props.userPosition;
    centerMarker(
      this._mapRef,
      this._mapHeight,
      isServiceMenuCollapsed,
      latitude,
      longitude,
      0.005,
      0.005,
      2000
    );
  };

  centerTembiciLocation = () => {
    const { isServiceMenuCollapsed, nearbyTembici } = this.props;
    if (!nearbyTembici) return;
    const { positionLatitude, positionLongitude } = nearbyTembici;
    centerMarker(
      this._mapRef,
      this._mapHeight,
      isServiceMenuCollapsed,
      positionLatitude,
      positionLongitude,
      0.003,
      0.003,
      2000
    );
  };

  centerZazCarLocation = () => {
    const { isServiceMenuCollapsed, nearbyZazcar } = this.props;
    if (!nearbyZazcar) return;
    const { positionLatitude, positionLongitude } = nearbyZazcar;
    centerMarker(
      this._mapRef,
      this._mapHeight,
      isServiceMenuCollapsed,
      positionLatitude,
      positionLongitude,
      0.003,
      0.003,
      2000
    );
  };

  // Render Pts of Interest
  // ====================
  _renderBusMarker = pointObj => {
    const line = pointObj.lines[0] ? pointObj.lines[0] : null;
    return (
      <BusMarker
        key={pointObj.externalId}
        coordinate={{
          latitude: pointObj.positionLatitude,
          longitude: pointObj.positionLongitude
        }}
        acceptedCards={pointObj.acceptedCards}
        mapRef={this._mapRef}
        mapPosition={this.props.mapPosition}
        lineColor={line ? line.lineColor : ""}
        lineNumber={line ? line.lineNumber : ""}
        lineOrigin={line ? line.origin : ""}
        lineDestiny={line ? line.destiny : ""}
      />
    );
  };

  _renderStopMarker = stopObj => {
    return (
      <StopMarker
        key={stopObj.id}
        mapRef={this._mapRef}
        mapPosition={this.props.mapPosition}
        coordinate={{
          latitude: stopObj.positionLatitude,
          longitude: stopObj.positionLongitude
        }}
        userPosition={this.props.userPosition}
        type={stopObj.pointType}
        stopName={stopObj.name}
        lines={stopObj.lines}
        pointAddress={stopObj.description}
        pointName={stopObj.name}
      />
    );
  };

  _renderRentCarMarker = rentCarObj => {
    return (
      <RentCarMarker
        key={rentCarObj.id}
        mapRef={this._mapRef}
        mapPosition={this.props.mapPosition}
        coordinate={{
          latitude: rentCarObj.positionLatitude,
          longitude: rentCarObj.positionLongitude
        }}
        dispatch={this.props.dispatch}
        userPosition={this.props.userPosition}
        type={rentCarObj.pointType}
        stopName={rentCarObj.name}
        lines={rentCarObj.lines}
        pointAddress={rentCarObj.description}
        pointName={rentCarObj.name}
        lastReported={rentCarObj.lastReported}
        carsCount={rentCarObj.carsCount}
        detail={rentCarObj.detail}
      />
    );
  };

  _renderBikeMarker = bikeObj => {
    return (
      <BikeMarker
        key={bikeObj.id}
        mapRef={this._mapRef}
        mapPosition={this.props.mapPosition}
        coordinate={{
          latitude: bikeObj.positionLatitude,
          longitude: bikeObj.positionLongitude
        }}
        dispatch={this.props.dispatch}
        userPosition={this.props.userPosition}
        type={bikeObj.pointType}
        stopName={bikeObj.name}
        lines={bikeObj.lines}
        pointAddress={bikeObj.tembiciAddress}
        pointName={bikeObj.name}
        lastReported={bikeObj.lastReported}
        detail={bikeObj.detail[0]}
      />
    );
  };

  _renderPointsOfInterest = () => {
    const { pointsOfInterestData } = this.props;

    if (pointsOfInterestData && pointsOfInterestData.length > 0) {
      return pointsOfInterestData.map(point => {
        return point.pointType === pointsOfInterestTypes.BUS
          ? this._renderBusMarker(point)
          : point.pointType === pointsOfInterestTypes.STOP_BUS ||
            point.pointType === pointsOfInterestTypes.STOP_SUBWAY ||
            point.pointType === pointsOfInterestTypes.STOP_TRAIN
          ? this._renderStopMarker(point)
          : null;
      });
    }
  };

  _renderPointsOfTembici = () => {
    const { pointsOfInterestData, nearbyTembici, userPosition } = this.props;

    const { latitude, longitude } = userPosition;

    if (!pointsOfInterestData && pointsOfInterestData.length == 0) return null;

    const markers = pointsOfInterestData.map(point => {
      return (
        point.pointType == pointsOfInterestTypes.BIKE &&
        this._renderBikeMarker(point)
      );
    });

    return (
      <Fragment>
        {markers}
        {nearbyTembici && (
          <MapViewDirections
            origin={{ latitude: latitude, longitude: longitude }}
            destination={{
              latitude: nearbyTembici.positionLatitude,
              longitude: nearbyTembici.positionLongitude
            }}
            mode={"WALKING"}
            apikey={APIKEY_DIRECTION}
            strokeWidth={3}
            strokeColor="purple"
            optimizeWaypoints={true}
          />
        )}
      </Fragment>
    );
  };

  _renderPointsOfZazcar = () => {
    const {
      pointsOfInterestData,
      nearbyZazcar,
      userPosition,
      showDirectionZazcar
    } = this.props;

    const { latitude, longitude } = userPosition;

    if (!pointsOfInterestData && pointsOfInterestData.length == 0) return null;

    const markers = pointsOfInterestData.map(point => {
      return (
        point.pointType == pointsOfInterestTypes.RENT_CAR &&
        this._renderRentCarMarker(point)
      );
    });

    return (
      <Fragment>
        {markers}
        {nearbyZazcar && showDirectionZazcar && (
          <MapViewDirections
            origin={{ latitude: latitude, longitude: longitude }}
            destination={{
              latitude: nearbyZazcar.positionLatitude,
              longitude: nearbyZazcar.positionLongitude
            }}
            mode={"WALKING"}
            apikey={APIKEY_DIRECTION}
            strokeWidth={3}
            strokeColor="purple"
            optimizeWaypoints={true}
          />
        )}
      </Fragment>
    );
  };

  _renderPointsRide = () => {
    const { pointsRideData } = this.props;
    return <PointsRide data={pointsRideData} mapRef={this._mapRef} />;
  };

  _renderUserMarker = () => {
    return (
      <UserMarker
        coordinate={this.props.userPosition}
        mapRef={this._mapRef}
        mapPosition={this.props.mapPosition}
      />
    );
  };

  _getPointsOfInterest = async (
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta
  ) => {
    const {
      onFetchPointOfInterest,
      onFetchPointOfTembici,
      isTembici,
      isZazcar,
      isBus,
      onFetchPointsOfZazcar,
      userPosition
    } = this.props;
    const regionRadius = getVouDRadiusFromViewableArea(
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta
    );

    const currentMapPosition = {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta
    };

    if (isTembici) {
      onFetchPointOfTembici(userPosition);
    } else if (isZazcar) {
      onFetchPointsOfZazcar(userPosition);
    } else if (isBus) {
      onFetchPointOfInterest(currentMapPosition, regionRadius);
    }

    // update local vars
    this._lastFetchPosition = currentMapPosition;
    this._lastFetchRadius = regionRadius;
  };

  _onMapReady = () => {
    // Zoom on map ready after 750ms
    // This triggers a onRegionChangeComplete on
    // <MapView /> so we dont need to fetch
    // points of interest here
    this._zoomTimeout = setTimeout(() => {
      // Update onRegionChangeComplete
      //  request-blocking flag
      (this._isInitialZoomFinished = true), this.centerLocation();
    }, 750);
  };

  _onRegionChange = ({
    longitude,
    latitude,
    longitudeDelta,
    latitudeDelta
  }) => {
    const { dispatch } = this.props;

    if (!this._isInitialZoomFinished) return;

    // update current map pos
    dispatch(
      updateMapPosition(latitude, longitude, latitudeDelta, longitudeDelta)
    );

    // get distance from lastFetch Pos
    const distanceToLastFetchPosition = calculateDistance(
      this._lastFetchPosition.latitude,
      this._lastFetchPosition.longitude,
      latitude,
      longitude
    );

    // if distance is smaller than radius, return
    // if zoom doesnt change, return
    const lastFetchLatitudeDelta = this._lastFetchPosition.latitudeDelta
      ? this._lastFetchPosition.latitudeDelta
      : 0;
    const currentLatitudeDelta = latitudeDelta ? latitudeDelta : 0;
    const isSameZoom =
      lastFetchLatitudeDelta.toFixed(5) === currentLatitudeDelta.toFixed(5);

    if (
      !isSameZoom ||
      (isSameZoom && distanceToLastFetchPosition >= this._lastFetchRadius)
    ) {
      // fetch points of interest
      this._getPointsOfInterest(
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta
      );
    }
    this._mapRef.zooOut;
  };

  _animateToMarker = e => {
    const { mapPosition, isServiceMenuCollapsed } = this.props;
    const coordinate = e.nativeEvent.coordinate;

    centerMarker(
      this._mapRef,
      this._mapHeight,
      isServiceMenuCollapsed,
      coordinate.latitude,
      coordinate.longitude,
      mapPosition.latitudeDelta,
      mapPosition.longitudeDelta
    );
  };

  renderMarker = () => {
    const { isTembici, isZazcar, isBus, isScoo } = this.props;
    if (isTembici) {
      return this._renderPointsOfTembici();
    } else if (isZazcar) {
      return this._renderPointsOfZazcar();
    } else if (isScoo) {
      return this._renderPointsRide();
    } else if (isBus) {
      return this._renderPointsOfInterest();
    }
  };

  render() {
    const { userPosition } = this.props;

    return (
      <MapView
        ref={ref => {
          this._mapRef = ref;
        }}
        provider={PROVIDER_GOOGLE}
        style={styles.mapContainer}
        initialRegion={{
          ...userPosition,
          latitudeDelta: DEFAULT_LAT_DELTA,
          longitudeDelta: DEFAULT_LNG_DELTA
        }}
        minZoomLevel={9}
        maxZoomLevel={18}
        onMapReady={this._onMapReady}
        onRegionChangeComplete={this._onRegionChange}
        customMapStyle={mapStyle}
        moveOnMarkerPress={false}
        onLayout={event => {
          this._mapHeight = event.nativeEvent.layout.height;
        }}
        onMarkerPress={this._animateToMarker}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
      >
        {this.renderMarker()}
        {this._renderUserMarker()}
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    flexGrow: 1
  }
});

PointsOfInterestMap.propTypes = {
  userPosition: PropTypes.object,
  onRef: PropTypes.func,
  pointsOfInterest: PropTypes.array,
  isBus: PropTypes.bool,
  onFetchPointsOfZazcar: PropTypes.func,
  pointsOfInterestData: PropTypes.array,
  onFetchPointOfInterest: PropTypes.func,
  onFetchPointOfTembici: PropTypes.func,
  dispatch: PropTypes.func,
  isServiceMenuCollapsed: PropTypes.bool,
  nearbyTembici: PropTypes.object,
  nearbyZazcar: PropTypes.object,
  isTembici: PropTypes.bool,
  isZazcar: PropTypes.bool,
  isScoo: PropTypes.bool,
  mapPosition: PropTypes.object,
  showDirectionZazcar: PropTypes.bool,
  pointsRideData: PropTypes.array
};
PointsOfInterestMap.defaultProps = {};

export default connect()(PointsOfInterestMap);
