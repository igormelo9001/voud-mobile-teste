import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
  Platform
} from "react-native";
import { connect } from "react-redux";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";

import Loader from "../../../components/Loader";
import UserMarker from "../../home/components/PointsOfInterestMap/UserMarker";
import { colors } from "../../../styles";
import { padStart } from "../../../utils/string-util";

import { getPaddingForNotch } from "../../../utils/is-iphone-with-notch";
import {
  getDefaultRequestPositionConfig,
  getCurrentPosition
} from "../../../utils/geolocation";
import { setPosition } from "../../../redux/profile";
import Icon from "../../../components/Icon";
import IconButton from "../../../components/IconButton";
import { navigateToRoute } from "../../../redux/nav";
import { routeNames } from "../../../shared/route-names";
import { centerMarker } from "../../home/actions/utils";
import ScooterServicesReportProblemView from "./ScooterServicesReportProblem";
import VoudText from "../../../components/VoudText";
import mapStyle from "../../home/components/PointsOfInterestMap/mapStyle";
import PointsRide from "../components/PointsRide";
import { getJson } from "../../../utils/async-storage";
import { asyncStorageKeys } from "../../../redux/init";

import { fetchPointsRide } from "../../../flows/scooter/store/ducks/pointsRide";
import { fetchAuthRide } from "../../../flows/scooter/store/ducks/authRide";

const windowHeight = Dimensions.get("window").height;
const { width } = Dimensions.get("window");

const imageExclamation = require("../../../images/scoo-exclamation.png");

export class ScooterServicesView extends PureComponent {
  constructor(props) {
    super(props);

    this.mapViewRef = null;
    this._timer = null;
    this.state = {
      shouldRenderMap: false,
      isGettingUserLocation: false,
      isSettingLocal: false,
      elapsedTime: moment().diff(
        moment(props.scooterService.startDate),
        "seconds"
      )
    };
  }

  componentDidMount() {
    const { pointsRideData } = this.props;
    // if (pointsRideData.length === 0) {
    this._renderPoints();
    // }

    // wait 1s before render map
    this.renderDelay = setTimeout(() => {
      this.setState({ shouldRenderMap: true });
    }, 1000);

    // wait 1 second to get user position, avoiding
    // alert over half closed menu
    this.setState({ isGettingUserLocation: true });

    this.getUserLocationDelay = setTimeout(() => {
      this._getUserLocation(
        getDefaultRequestPositionConfig(true),
        true,
        getDefaultRequestPositionConfig(false)
      );
    }, 1000);

    this._timer = setInterval(() => {
      this.setState({
        elapsedTime: moment().diff(
          moment(this.props.scooterService.startDate),
          "seconds"
        )
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  _renderPoints = async () => {
    const { dispatch, profileData } = this.props;

    const sessionTokenRide = await getJson(asyncStorageKeys.scooterToken);

    if (!sessionTokenRide) {
      dispatch(
        fetchAuthRide(profileData.name, profileData.cpf, profileData.email)
      ).then(response => {
        dispatch(fetchPointsRide());
      });
    } else {
      dispatch(fetchPointsRide());
    }
  };

  _getUserLocation = (config, shouldRetry = false, retryConfig) => {
    const { dispatch } = this.props;

    return new Promise(async (resolve, reject) => {
      try {
        const position = await getCurrentPosition(
          config,
          shouldRetry,
          retryConfig
        );
        dispatch(setPosition(position.latitude, position.longitude));
        this.setState({ isGettingUserLocation: false });
        resolve(true);
      } catch (error) {
        this.setState({ isGettingUserLocation: false });
        reject(false);
      }
    });
  };

  _renderUserMarker = () => {
    return (
      <UserMarker
        coordinate={this.props.position}
        mapRef={this._mapRef}
        mapPosition={this.props.mapPosition}
      />
    );
  };

  _renderRidePoints = () => {
    const { pointsRideData } = this.props;
    return <PointsRide data={pointsRideData} />;
  };

  fitToSuppliedMarkers = () => {
    const hasOrigin = origin && origin.geometry && origin.geometry.location;
    const hasDestination =
      destination && destination.geometry && destination.geometry.location;

    if (this.mapViewRef && (hasOrigin || hasDestination)) {
      this.mapViewRef.fitToSuppliedMarkers(["origin", "destination"], true);
    }
  };

  _renderMap() {
    const { shouldRenderMap, isGettingUserLocation } = this.state;
    const { position, payload, financialRide, endRide } = this.props;
    const { latitude, longitude, defaultLat, defaultLng } = position;

    if (shouldRenderMap && !isGettingUserLocation) {
      return (
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={r => (this._mapRef = r)}
          initialRegion={{
            latitude: latitude || defaultLat,
            longitude: longitude || defaultLng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
          style={styles.map}
          customMapStyle={mapStyle}
        >
          {this._renderUserMarker()}
          {this._renderRidePoints()}
        </MapView>
      );
    }

    if (
      !payload.isFetching &&
      !financialRide.isFetching &&
      !endRide.isFetching
    ) {
      return (
        <Modal
          animationType="fade"
          transparent={true}
          visible={true}
          onRequestClose={() => {}}
        >
          <View style={styles.containerModal}>
            <View style={styles.modal}>
              <Loader text="Carregando mapa..." />
            </View>
          </View>
        </Modal>
      );
    }

    return;
  }

  _centerLocation = () => {
    const { latitude, longitude } = this.props.position;
    if (this._mapRef) {
      centerMarker(
        this._mapRef,
        windowHeight,
        true,
        latitude,
        longitude,
        0.005,
        0.005,
        2000
      );
    }
  };

  _handleScooterReport = () => {
    this.props.dispatch(navigateToRoute(routeNames.SCOOTER_REPORT));
  };

  _handleScooterEnd = () => {
    this.props.dispatch(navigateToRoute(routeNames.SCOOTER_SERVICES_QRCODE));
  };

  _renderElapsedTime() {
    const minutes = parseInt(this.state.elapsedTime / 60);
    const seconds = this.state.elapsedTime - minutes * 60;
    return `${padStart(minutes.toString(), "0", 2)}:${padStart(
      seconds.toString(),
      "0",
      2
    )}`;
  }

  _renderCurrentPrice() {
    const {
      initialValue,
      valuePerMinute,
      minuteFree
    } = this.props.scooterService;
    let minutes = parseInt(this.state.elapsedTime / 60) - minuteFree;
    if (minutes < 0) minutes = 0;

    const price = initialValue + minutes * valuePerMinute;

    return `R$ ${price
      .toFixed(2)
      .toString()
      .replace(".", ",")}`;
  }

  render() {
    return (
      <View style={styles.view}>
        <View style={styles.mapContainer}>
          {this._renderMap()}
          <LinearGradient
            colors={["rgba(110, 62, 145, 1)", "transparent"]}
            style={styles.linearGradient}
            pointerEvents="none"
          />
          <View style={styles.counterContainer}>
            <View style={styles.counter}>
              <Icon style={styles.counterIcon} name="waiting" />
              <VoudText style={styles.textCount}>
                {this._renderElapsedTime()}
              </VoudText>
            </View>
            <View style={styles.separator}></View>
            <View style={styles.counter}>
              <Icon style={styles.counterIcon} name="money" />
              <VoudText style={styles.textCount}>
                {this._renderCurrentPrice()}
              </VoudText>
            </View>
          </View>
        </View>
        <View style={styles.containerLocation}>
          <IconButton
            iconName="my-location"
            style={styles.roundButton}
            iconStyle={styles.roundButtonIcon}
            onPress={this._centerLocation}
          />
        </View>
        <View style={[styles.buttonsContainer]}>
          <View style={[styles.buttonsFinishContainer]}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 2, y: 0 }}
              colors={[
                colors.BRAND_PRIMARY_DARKER,
                colors.BRAND_PRIMARY_LIGHTER
              ]}
              style={styles.buttonScoo}
            >
              <TouchableOpacity
                onPress={this._handleScooterEnd}
                style={{
                  ...Platform.select({
                    android: {
                      padding: 60
                    },
                    ios: {
                      padding: 0
                    }
                  })
                }}
              >
                <VoudText style={styles.textScoo}> Finalizar</VoudText>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <View style={[styles.containerEnd]}>
            <TouchableOpacity
              onPress={this._handleScooterReport}
              style={{ padding: 2 }}
            >
              <View style={[styles.containerReport]}>
                <Image source={imageExclamation} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "white"
  },
  mapContainer: {
    flex: 1,
    paddingBottom: getPaddingForNotch(),
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderColor: colors.GRAY_LIGHTER,
    backgroundColor: colors.GRAY_LIGHTER
  },
  map: {
    flex: 1,
    alignSelf: "stretch"
  },
  linearGradient: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: 140
  },
  counterContainer: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    left: 22,
    right: 22,
    top: 40,
    backgroundColor: "#fff",
    borderRadius: 31,
    height: 55
  },
  counter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  counterIcon: {
    fontSize: 24,
    color: colors.BRAND_PRIMARY
  },
  counterText: {
    fontSize: 19,
    fontWeight: "400",
    color: colors.BRAND_PRIMARY
  },
  separator: {
    width: 1,
    backgroundColor: "#979797",
    marginVertical: 5
  },
  buttonsContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 89,
    borderRadius: 8,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    flex: 1,
    flexDirection: "row",
    height: 36,
    backgroundColor: colors.BRAND_PRIMARY,
    marginHorizontal: 18
  },
  buttonIcon: {
    color: "#fff",
    fontSize: 14
  },
  buttonText: {
    color: "#fff",
    fontWeight: "400"
  },
  roundButton: {
    borderColor: colors.BRAND_PRIMARY,
    backgroundColor: "#FFF",
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    elevation: 2,
    shadowColor: "#000"
  },
  roundButtonIcon: {
    color: colors.BRAND_PRIMARY,
    fontSize: 20
  },
  containerScoo: {
    width: width - 20,
    height: 66,
    borderRadius: 13,
    backgroundColor: "#FFF",
    position: "absolute",
    top: 110,
    bottom: 0,
    left: 10,
    elevation: 2
  },
  containerInformationScoo: {
    flexDirection: "row",
    flex: 1
  },
  imageScoo: {
    justifyContent: "center",
    marginLeft: 16,
    padding: 10
  },
  textScoo: {
    justifyContent: "center",
    padding: 10,
    fontWeight: "bold",
    fontSize: 14
  },
  titleScoo: {
    fontSize: 14,
    color: "#4d1e71",
    fontWeight: "bold"
  },
  subtitleScoo: {
    fontSize: 12,
    color: "#4d1e71"
  },
  buttonsFinishContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "flex-end",
    padding: 5,
    marginLeft: 18
  },
  buttonScoo: {
    borderRadius: 27,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    // width: 290,
    height: 36,
    flex: 1
  },
  textScoo: {
    color: "#FFF",
    fontSize: 12
  },
  textCount: {
    // fontSize: 10,
    // lineHeight: 14,
    // fontWeight: 'bold',
    color: colors.BRAND_PRIMARY_DARKER,
    fontSize: 17
  },
  containerEnd: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  containerReport: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    backgroundColor: "#FFF"
  },
  containerLocation: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    bottom: 110,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
    paddingHorizontal: 25,
    padding: 10
  },
  containerModal: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  modal: {
    width: 160,
    height: 160,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2
  }
});

const mapStateToProps = state => ({
  position: {
    latitude: state.profile.position.latitude,
    longitude: state.profile.position.longitude,
    latitudeDelta: state.profile.position.latitudeDelta,
    longitudeDelta: state.profile.position.longitudeDelta
  },
  scooterService: {
    startDate: state.scooter.startDate,
    initialValue: state.scooter.initialValue,
    valuePerMinute: state.scooter.valuePerMinute,
    minuteFree: state.scooter.minuteFree
  },
  pointsRideData: state.pointsRide.data,
  payload: state.scooter,
  financialRide: state.financialRide,
  endRide: state.authEnd
});

export const ScooterServices = connect(mapStateToProps)(ScooterServicesView);

export * from "./ScooterServicesQrCode";
export * from "./ScooterServicesInfo";
export * from "./ScooterServicesReceipt";
export const ScooterServicesReportProblem = ScooterServicesReportProblemView;
