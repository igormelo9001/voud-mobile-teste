// NPM imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import { Alert, StyleSheet, ScrollView, View, Image, Text } from "react-native";
import DeviceInfo from "react-native-device-info";

// VouD imports
import { logout } from "../../redux/login";
import { colors } from "../../styles";
import { navigateToRoute } from "../../redux/nav";
import { GAEventParams, GATrackEvent } from "../../shared/analytics";
import { routeNames } from "../../shared/route-names";
import { getHasProfileAlerts } from "../../redux/selectors";

// Group imports
import MenuItem from "./MenuItem";
import { openSupportEmail } from "../../utils/mailto-util";
import VoudModal from "../../components/Modal";
import VoudText from "../../components/VoudText";
import Icon from "../../components/Icon";
import VoudTouchableOpacity from "../../components/TouchableOpacity";

// image
const arrowLeftImg = require("../../images/arrow-left.png");

// component
class LoggedMenuView extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      menuIsVisible: false
    };
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired
  };

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.setState({ menuIsVisible: true });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _renderMenuItems = (items, isSecondary = false) => {
    return items.map(item => (
      <MenuItem
        onPress={() =>
          this._navigate(item.routeName, item.eventLabel, item.routeParams)
        }
        text={item.text}
        icon={item.icon}
        isSecondary={isSecondary}
        key={item.routeName}
        badge={item.notification}
      />
    ));
  };

  renderLoggedContent = () => {
    const {
      MENU_PURCHASE_HISTORY,
      MENU_MY_PROFILE,
      MENU_PAYMENT_METHODS
    } = GAEventParams.labels;
    const items = [
      {
        text: "Dados cadastrais",
        icon: "profile-info",
        routeName: routeNames.MY_PROFILE,
        eventLabel: MENU_MY_PROFILE,
        notification: this.props.hasProfileAlerts
      },
      {
        text: "Histórico de compras",
        icon: "history",
        routeName: routeNames.PURCHASE_HISTORY,
        eventLabel: MENU_PURCHASE_HISTORY,
        notification: false
      },
      {
        text: "Formas de pagamento",
        icon: "credit-card",
        routeName: routeNames.PAYMENT_METHODS,
        eventLabel: MENU_PAYMENT_METHODS,
        notification: false
      }
    ];
    const { userData } = this.props;

    return (
      <View style={styles.container}>
        <View style={[styles.headerContainer]}>
          <Icon name="people" style={styles.headerIcon} />
          <VoudText
            style={styles.headerText}
            numberOfLines={2}
            elipseMode="tail"
          >
            {`Olá, ${userData.name}`}
          </VoudText>
        </View>
        <ScrollView scrollsToTop={false} contentContainerStyle={styles.content}>
          {this._renderMenuItems(items)}
          <MenuItem
            onPress={this._openSupportEmailUrl}
            text="Suporte"
            icon="mail"
          />
          <MenuItem
            onPress={this._logout}
            text="Sair"
            icon="logout"
            noIconRight
          />
        </ScrollView>

        <View style={styles.footerContainer}>
          <Text style={{ flex: 2 }}>{`VouD v${DeviceInfo.getVersion()}`}</Text>
        </View>
      </View>
    );
  };

  _openSupportEmailUrl = () => {
    const { userData, dispatch } = this.props;

    // Open mailto
    openSupportEmail(userData);

    // Dispatch GATrackEvent for support
    const {
      categories: { BUTTON },
      actions: { CLICK },
      labels: { MENU_SUPPORT }
    } = GAEventParams;
    GATrackEvent(BUTTON, CLICK, MENU_SUPPORT);

    // Close Menu
    this._close();
  };

  _close = callback => {
    this.setState({ menuIsVisible: false }, () => {
      this.props.dispatch(NavigationActions.back());
      if (typeof callback === "function") callback();
    });
  };

  _navigate = (routeName, eventLabel = "") => {
    const { dispatch } = this.props;
    const {
      categories: { BUTTON },
      actions: { CLICK }
    } = GAEventParams;

    GATrackEvent(BUTTON, CLICK, eventLabel);
    this._close(() => {
      dispatch(navigateToRoute(routeName));
    });
  };

  _logout = () => {
    const { dispatch } = this.props;

    Alert.alert("Sair", "Você tem certeza que deseja sair do VouD?", [
      {
        text: "Cancelar",
        onPress: () => {}
      },
      {
        text: "Sim",
        onPress: () => {
          this._close();

          const {
            categories: { BUTTON },
            actions: { CLICK },
            labels: { MENU_LOGOUT }
          } = GAEventParams;
          GATrackEvent(BUTTON, CLICK, MENU_LOGOUT);
          dispatch(logout());
        }
      }
    ]);
  };

  render() {
    return (
      <VoudModal
        isVisible={this.state.menuIsVisible}
        style={[styles.containerModal]}
        onSwipe={this._close}
        onBackdropPress={this._close}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        backdropOpacity={0.3}
        swipeDirection="left"
      >
        {this.renderLoggedContent()}
        <VoudTouchableOpacity
          style={styles.arrowLeftContainer}
          onPress={this._close}
          pointerEvents="box-none"
        >
          <Image source={arrowLeftImg} />
        </VoudTouchableOpacity>
      </VoudModal>
    );
  }
}

const styles = StyleSheet.create({
  containerModal: {
    margin: 0,
    paddingRight: 64
    // flex:1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_LIGHTEST
  },
  icon: {
    fontSize: 24,
    color: colors.BRAND_PRIMARY
  },
  content: {
    backgroundColor: "white"
  },
  arrowLeftContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 24,
    justifyContent: "center"
  },
  headerContainer: {
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_LIGHTER
  },
  footerContainer: {
    flex: 1,
    width: 100,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "flex-end"
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24,
    color: colors.BRAND_PRIMARY_DARKER,
    flex: 1
  },
  headerIcon: {
    fontSize: 20,
    color: colors.BRAND_PRIMARY,
    marginLeft: 4,
    marginRight: 20
  }
});

// redux connect and export
const mapStateToProps = state => {
  return {
    cards: state.transportCard.list,
    userData: state.profile.data,
    hasProfileAlerts: getHasProfileAlerts(state)
  };
};

export const LoggedMenu = connect(mapStateToProps)(LoggedMenuView);
