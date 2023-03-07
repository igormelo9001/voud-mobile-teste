// NPM imports
import React, { Component } from 'react';
import SideMenu from 'react-native-side-menu';
import { connect } from 'react-redux';

import {
  Dimensions,
  StyleSheet,
  View,
  Animated,
  Easing,
  BackHandler
} from 'react-native';

import {
  addNavigationHelpers,
  createNavigator,
  TabRouter,
  Transitioner
} from 'react-navigation';

// VouD imports
import { openMenu, closeMenu } from '../redux/menu';
import { routeNames } from '../shared/route-names';

import {
  Home,
  Help,
  Reports,
  PhoneRecharge,
  Menu,
} from '../screens';
import { getIsLoggedIn } from '../redux/selectors';

// component
class MenuView extends Component {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  _backHandler = () => {
    const { isOpen, dispatch } = this.props;
    if (isOpen) {
      dispatch(closeMenu());
      return true;
    }

    return false;
  };

  _configureTransition = (transitionProps, prevTransitionProps) => {
    return {
      duration: 1000,
      easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
      timing: Animated.timing,
    }
  };

  _renderScene = (transitionProps, onEnter) => {
    const { progress, scene } = transitionProps;
    const opacity = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    const Scene = this.props.router.getComponentForRouteName(scene.route.routeName);

    if (onEnter)
      return (
        <Animated.View
          style={StyleSheet.flatten([styles.animatedViewContainer, { opacity }])}
          key={scene.key}
        >
          <Scene navigation={addNavigationHelpers({
            ...this.props.navigation,
            state: this.props.navigation.state.routes[scene.index],
          })} />
        </Animated.View>
      );

    return (
      <Animated.View
        key={scene.key}
        style={styles.previousViewContainer}
      >
        <Scene />
      </Animated.View>
    );
  };

  _render = (transitionProps, prevTransitionProps) => {
    const previousScene = !!prevTransitionProps ? this._renderScene(prevTransitionProps, false) : null;
    const actualScene = this._renderScene(transitionProps, true);
    const menu = <Menu navigation={this.props.navigation} />;

    return (
      <SideMenu
        disableGestures={this.props.isLoggedIn}
        menu={menu}
        isOpen={this.props.isOpen}
        onChange={this.updateMenuState}
        openMenuOffset={Dimensions.get('window').width - 56}
      >
        <View style={styles.mainContainer}>
          {previousScene}
          {actualScene}
        </View>
      </SideMenu>
    );
  };

  updateMenuState = isOpen => {
    if (isOpen)
      this.props.dispatch(openMenu());
    else
      this.props.dispatch(closeMenu());
  };

  render() {
    return (
      <Transitioner
        configureTransition={this._configureTransition}
        navigation={this.props.navigation}
        render={this._render}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    isOpen: state.menu.isOpen,
    isLoggedIn: getIsLoggedIn(state),
  }
};
const MenuViewContainer = connect(mapStateToProps)(MenuView);

const MenuRouter = TabRouter(
  {
    [routeNames.HOME]: { screen: Home },
    [routeNames.PHONE_RECHARGE]: { screen: PhoneRecharge },
    [routeNames.HELP_NOT_LOGGED_IN]: { screen: Help },
    [routeNames.REPORTS_NOT_LOGGED_IN]: { screen: Reports },
  },
  {
    initialRouteName: routeNames.HOME
  }
);

const MenuNavigator = createNavigator(MenuRouter)(MenuViewContainer);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: -4,
      height: 0
    },
    shadowOpacity: 0.25,
    elevation: 8,
  },
  previousViewContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  animatedViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    opacity: 0,
  }
});

export default MenuNavigator;

