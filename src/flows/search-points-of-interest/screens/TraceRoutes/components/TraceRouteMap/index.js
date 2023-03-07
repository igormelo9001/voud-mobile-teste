import React, { Component, Fragment } from "react";
import {
  View,
  Dimensions,
  Platform,
  Modal,
  TouchableWithoutFeedback
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import styles from "./style";
import Directions from "../Directions";
import { getPixelSize, decodePolyline } from "../../utils";

const imageMarker = require("../../images/circle.png");
const imageMarkerStop = require("../../images/circleStop.png");
const imageDestination = require("../../images/ic-end.png");
const imageOrigin = require("../../images/ic-start.png");
import { adaptColor } from "../../../../utils/adapt-route-json";
import mapStyle from "../../../../../../flows/home/components/PointsOfInterestMap/mapStyle";
// import VoudTouchableOpacity from "../../../../../../components/TouchableOpacity";
// import Icon from "../../../../../../components/Icon";

// const { height } = Dimensions.get("window");

class TraceRouteMapView extends Component {
  constructor(props) {
    super(props);

    const { data, stops } = this.props;
    const { startLocation, endLocation } = data;

    this.way = [];
    this.wayWalking = [];
    this.decodedPolyline = [];

    data.steps.map(item => {
      const polyline = decodePolyline(item.polyline.encodedPath);
      let lineColor = "#007aff";

      if (item.travelMode === "TRANSIT") {
        const color = item.transitDetails.line.color;
        lineColor = color === undefined ? "#8c8c8c" : adaptColor(color);

        const {
          transitDetails: {
            line: { vehicle }
          }
        } = item;

        this.way.push({
          travelMode: item.travelMode,
          lngLtn: polyline,
          lineColor: lineColor,
          transportType: vehicle.name.toUpperCase()
        });
      } else {
        this.way.push({
          travelMode: item.travelMode,
          lngLtn: polyline,
          lineColor: lineColor,
          transportType: "CAMINHADA"
        });
      }

      polyline.map(item => {
        this.decodedPolyline.push({
          latitude: item.latitude,
          longitude: item.longitude
        });
      });
    });

    let coordinate = [];

    stops.map(item => {
      coordinate.push({
        longitude: parseFloat(item.longitude),
        latitude: parseFloat(item.latitude)
      });
    });

    this.state = {
      region: {
        latitude: startLocation.lat,
        longitude: startLocation.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      },
      destination: {
        latitude: endLocation.lat,
        longitude: endLocation.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      },
      markersCoordinates: coordinate
    };

    this.mapRef = null;
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  renderMapCenter = (rightSize, leftSize, topSize, bottomSize) => {
    if (this.mapRef) {
      this.mapRef.fitToCoordinates(this.decodedPolyline, {
        edgePadding: {
          right: getPixelSize(rightSize),
          left: getPixelSize(leftSize),
          top: getPixelSize(topSize),
          bottom: getPixelSize(bottomSize)
        },
        animated: true
      });
    }
  };

  _handlerLocation = (right, left, top, bottom) => {
    this.renderMapCenter(right, left, top, bottom);
  };

  render() {
    const { region, destination, markersCoordinates } = this.state;

    const { isOverlayActive } = this.props;

    const markerAnchorDestination = {
      x: Platform.OS === "ios" ? 0 : 0.3,
      y: Platform.OS === "ios" ? 0 : 0
    };

    const markerAnchorStops = {
      x: Platform.OS === "ios" ? 0 : 0.5,
      y: Platform.OS === "ios" ? 0 : 0
    };

    const right = Platform.OS === "ios" ? 15 : 0;
    const left = Platform.OS === "ios" ? 15 : 0;

    return (
      <View style={styles.container}>
        <MapView
          ref={ref => {
            this.mapRef = ref;
          }}
          style={styles.containerMap}
          initialRegion={region}
          loadingEnabled
          onMapReady={() => this.renderMapCenter(right, left, 0, 90)}
          customMapStyle={mapStyle}
          onLayout={event => {
            this._mapHeight = event.nativeEvent.layout.height;
          }}
        >
          {destination && (
            <Fragment>
              <Directions way={this.way} />

              <Marker
                coordinate={region}
                anchor={{ x: 0, y: 0 }}
                image={imageOrigin}
                calloutOffset={{ x: 0, y: 0 }}
              />

              {markersCoordinates.map((item, index) => {
                return (
                  <Marker
                    key={index}
                    coordinate={item}
                    anchor={markerAnchorStops}
                    image={imageMarkerStop}
                  />
                );
              })}

              <Marker
                coordinate={destination}
                anchor={markerAnchorDestination}
                image={imageDestination}
              />
            </Fragment>
          )}
        </MapView>
        {isOverlayActive && (
          <TouchableWithoutFeedback onPress={this.props.onPressOverlay}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}

export default TraceRouteMapView;
