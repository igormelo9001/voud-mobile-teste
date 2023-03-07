import React, { Component } from "react";
import {
  View,
  BackHandler,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  Platform
} from "react-native";

import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";

//Voud Imports
import TraceRouteMapView from "../TraceRoutes/components/TraceRouteMap";
import ButtonIcon from "../../../../flows/home/components/ButtonIcon";
import { getStateCurrentRouteName } from "../../../../utils/nav-util";
import { routeNames } from "../../../../shared/route-names";
import StartRouteItem from "./components/StartRouteItem";
import StageRouteList from "./components/StageRouteList";
import VoudTouchableOpacity from "../../../../components/TouchableOpacity";
import Icon from "../../../../components/Icon";

import styles from "./styles";
const SCREEN_HEIGHT = Dimensions.get("window").height;

class TraceRouteView extends Component {
  constructor(props) {
    super(props);

    const { ...data } = this.props.navigation.state.params.item.legs[0];
    const { ...item } = this.props.navigation.state.params.item;

    const heighLocation = 190;

    this.state = {
      data,
      item,
      isScrollEnabled: false,
      initialHeight: SCREEN_HEIGHT - 130,
      initialHeightLocation: SCREEN_HEIGHT - heighLocation,
      isSelectDown: true,
      isOverlayActive: false
    };

    this.mapRef = null;
  }

  componentWillMount() {
    const { initialHeight, initialHeightLocation } = this.state;
    BackHandler.addEventListener("hardwareBackPress", this._backHandler);
    this.scrollOffset = 0;

    this.animation = new Animated.ValueXY({ x: 0, y: initialHeight });
    this.animationLocation = new Animated.Value(initialHeightLocation);

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) >= 4;
      },
      onPanResponderGrant: (evt, gestureState) => {},
      onPanResponderMove: (evt, gestureState) => {},
      onPanResponderRelease: (evt, gestureState) => {
        const {
          isSelectDown,
          initialHeight,
          initialHeightLocation
        } = this.state;

        const right = Platform.OS === "ios" ? 15 : 0;
        const left = Platform.OS === "ios" ? 15 : 0;

        if (isSelectDown) {
          this.renderMapCenterLocation(200, 200, 200, 200);
        } else {
          this.renderMapCenterLocation(right, left, 0, 90);
          this.renderScroIlnitial();
        }
        Animated.spring(this.animation.y, {
          toValue: isSelectDown ? 75 : initialHeight,
          tension: 0
        }).start();

        Animated.spring(this.animationLocation, {
          toValue: isSelectDown ? 25 : initialHeightLocation,
          tension: 0
        }).start();

        this.setState({
          isSelectDown: !isSelectDown,
          isScrollEnabled: isSelectDown,
          isOverlayActive: isSelectDown
        });
      }
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._backHandler);
  }

  _backHandler = () => {
    const { nav } = this.props;
    const currentRouteName = getStateCurrentRouteName(nav);

    if (currentRouteName === routeNames.TRACE_ROUTES) {
      this._back();
      return true;
    }
    return false;
  };

  _back = () => {
    this.props.dispatch(NavigationActions.back());
  };

  _handlerExpandRota = () => {
    const { isSelectDown, initialHeight, initialHeightLocation } = this.state;

    if (isSelectDown) {
      this.renderMapCenterLocation(200, 200, 200, 200);
    } else {
      const right = Platform.OS === "ios" ? 15 : 0;
      const left = Platform.OS === "ios" ? 15 : 0;

      this.renderMapCenterLocation(right, left, 0, 90);
      this.renderScroIlnitial();
    }

    Animated.spring(this.animation.y, {
      toValue: isSelectDown ? 75 : initialHeight,
      tension: 0
    }).start();

    Animated.spring(this.animationLocation, {
      toValue: isSelectDown ? 25 : initialHeightLocation,
      tension: 0
    }).start();

    this.setState({
      isSelectDown: !isSelectDown,
      isScrollEnabled: isSelectDown,
      isOverlayActive: isSelectDown
    });
  };

  onPressMap = () => {
    const { isSelectDown, initialHeight, initialHeightLocation } = this.state;
    if (!isSelectDown) {
      Animated.spring(this.animation.y, {
        toValue: initialHeight,
        tension: 0
      }).start();

      Animated.spring(this.animationLocation, {
        toValue: initialHeightLocation,
        tension: 0
      }).start();

      const right = Platform.OS === "ios" ? 15 : 0;
      const left = Platform.OS === "ios" ? 15 : 0;

      this.renderMapCenterLocation(right, left, 0, 90);
      this.renderScroIlnitial();
      this.setState({
        isSelectDown: true,
        isOverlayActive: false,
        isScrollEnabled: false
      });
    }
  };

  onPressLocation = () => {
    const { isSelectDown, initialHeight, initialHeightLocation } = this.state;

    if (!isSelectDown) {
      Animated.spring(this.animation.y, {
        toValue: initialHeight,
        tension: 0
      }).start();

      Animated.spring(this.animationLocation, {
        toValue: initialHeightLocation,
        tension: 0
      }).start();

      this.setState({
        isSelectDown: true,
        isOverlayActive: false,
        isScrollEnabled: false
      });
      this.renderScroIlnitial();
    }
    const right = Platform.OS === "ios" ? 15 : 0;
    const left = Platform.OS === "ios" ? 15 : 0;

    this.renderMapCenterLocation(right, left, 0, 90);
  };

  renderMapCenterLocation = (right, left, top, bottom) => {
    if (this.mapRef) {
      this.mapRef.renderMapCenter(right, left, top, bottom);
    }
  };

  renderScroIlnitial = () => {
    this.refs.scrollView.scrollTo({ x: 0, y: 0, animated: true });
  };

  render() {
    const {
      data,
      item,
      isSelectDown,
      isScrollEnabled,
      isOverlayActive
    } = this.state;

    const animatedHeight = {
      transform: this.animation.getTranslateTransform()
    };

    return (
      <Animated.View style={{ flex: 1, backgroundColor: "transparent" }}>
        <TraceRouteMapView
          data={data}
          stops={item.stops}
          isOverlayActive={isOverlayActive}
          onPressOverlay={this.onPressMap}
          onRef={ref => {
            this.mapRef = ref;
          }}
        />
        <View style={styles.wrapperHeader}>
          <ButtonIcon
            style={[styles.backIcon]}
            onPress={this._back}
            icon="md-arrow-back"
          />
        </View>

        <Animated.View
          style={[
            {
              position: "absolute",
              top: this.animationLocation,
              alignItems: "flex-end",
              right: 16,
              elevation: 0
            }
          ]}
        >
          <VoudTouchableOpacity
            onPress={this.onPressLocation}
            style={styles.centerPositionIconContainer}
          >
            <Icon
              style={styles.centerPositionIcon}
              name="my-location"
              size={20}
            />
          </VoudTouchableOpacity>
        </Animated.View>

        <Animated.View style={[animatedHeight, styles.modalContent]}>
          <Animated.View {...this.panResponder.panHandlers}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={[styles.handleArea, { padding: 15 }]}
              onPress={this._handlerExpandRota}
            >
              {isSelectDown && <View style={styles.handle} />}
              {!isSelectDown && <Icon name="ic-down" style={styles.icon} />}
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ marginTop: 0 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              scrollEnabled={isScrollEnabled}
              scrollEventThrottle={16}
              ref="scrollView"
              onScroll={event => {
                this.scrollOffset = event.nativeEvent.contentOffset.y;
              }}
            >
              <Animated.View style={{ paddingHorizontal: 10 }}>
                <StartRouteItem item={item} />
              </Animated.View>
              <Animated.View>
                <StageRouteList item={item} />
              </Animated.View>
              <View style={{ height: 140 }} />
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    );
  }
}

const mapTopProps = state => ({
  nav: state.nav
});

export const TraceRoutes = connect(mapTopProps)(TraceRouteView);
