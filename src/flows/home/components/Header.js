// NPM imports
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";

// VouD imports
import ButtonIcon from "./ButtonIcon";
import ButtonField from "./ButtonField";
import { navigateToRoute, waitAndNavigateToRoute } from "../../../redux/nav";
import { routeNames } from "../../../shared/route-names";
import { showLocationWithoutPermissionAlert } from "../../../utils/geolocation";

export const HEADER_HEIGHT = 140;

class Header extends Component {
  constructor(props) {
    super(props);
  }

  _openSearch = () => {
    const { dispatch, geolocPermGranted } = this.props;
    if (geolocPermGranted) {
      dispatch(navigateToRoute(routeNames.SEARCH_POINTS_OF_INTEREST));
    } else {
      showLocationWithoutPermissionAlert();
    }
  };

  _openMenu = () => {
    this.props.dispatch(waitAndNavigateToRoute(routeNames.LOGGED_MENU));
  };

  _openNotifications = () => {
    this.props.dispatch(waitAndNavigateToRoute(routeNames.NOTIFICATION_CENTER));
  };

  render() {
    return (
      <View style={styles.container} pointerEvents="box-none">
        <LinearGradient
          colors={["rgba(110, 62, 145, 1)", "transparent"]}
          style={styles.linearGradient}
          pointerEvents="none"
        />
        <View style={styles.wrapper}>
          <ButtonIcon
            onPress={this._openMenu}
            icon="people"
            badge={this.props.hasProfileAlerts}
          />
          <ButtonField onPress={this._openSearch} icon="md-search" />
          <ButtonIcon
            onPress={this._openNotifications}
            icon="notifications"
            badge={this.props.hasNotificationAlerts}
          />
        </View>
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    position: "absolute",
    width: "100%"
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 56,
    paddingHorizontal: 10
  },
  linearGradient: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: 140
  }
});

export default connect()(Header);
