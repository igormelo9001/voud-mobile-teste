// NPM imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';

// VouD imports
import Button from '../../components/Button';
import { closeMenu } from '../../redux/menu';
import { colors, getStatusBarHeight } from '../../styles';
import { navigateToRoute } from '../../redux/nav';
import { GAEventParams, GATrackEvent } from '../../shared/analytics';
import { routeNames } from '../../shared/route-names';
import { getIsLoggedIn, getProfileAlertCount } from '../../redux/selectors';

// Group imports
import MenuItem from './MenuItem';
import { getPaddingForNotch } from '../../utils/is-iphone-with-notch';

// images
const voudLogo = require('../../images/logo-voud-sm.png');

// aux consts
const window = Dimensions.get('window');

// component
class MenuView extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  _renderMenuItems = (items, isSecondary = false) => {
    return items.map(item => (
      <MenuItem
        onPress={() => this._navigate(item.routeName, item.eventLabel, item.routeParams)}
        text={item.text}
        icon={item.icon}
        isSecondary={isSecondary}
        key={item.routeName}
      />
    ));
  };

  renderContent = () => {
    const { 
      MENU_HOME,
      MENU_REPORT,
      MENU_HELP,
      MENU_LOGIN,
    } = GAEventParams.labels;

    const items = [
      {
        text: 'Início',
        icon: 'home',
        routeName: routeNames.HOME,
        eventLabel: MENU_HOME,
      },
      {
        text: 'Denúncias',
        icon: 'feedback',
        routeName: routeNames.REPORTS_NOT_LOGGED_IN,
        eventLabel: MENU_REPORT,
      },
      {
        text: 'Dúvidas Frequentes',
        icon: 'help-outline',
        routeName: routeNames.HELP_NOT_LOGGED_IN,
        eventLabel: MENU_HELP,
      }
    ];

    return (
      <ScrollView
        scrollsToTop={false}
        contentContainerStyle={styles.content}
      >
        <Image
          source={voudLogo}
          style={styles.logo}
        />
        {this._renderMenuItems(items)}
        <View style={styles.hr} />
        <View accessible={true} accessibilityLabel={'Botão de cadastro ou login'} style={styles.loginInfo}>
          <Button
            
            outline
            onPress={() => this._navigate(routeNames.AUTH, MENU_LOGIN)}
          >
            Cadastre-se ou{'\n'}faça seu login
          </Button>
        </View>
      </ScrollView>
    );
  };

  _navigate = (routeName, eventLabel = '') => {
    const { dispatch } = this.props;
    const { categories: { BUTTON }, actions: { CLICK } } = GAEventParams;

    dispatch(closeMenu());

    GATrackEvent(BUTTON, CLICK, eventLabel);
    dispatch(navigateToRoute(routeName));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarSpaceHolder} />
        {!this.props.isLoggedIn && this.renderContent()}
        {__DEV__ && <Button onPress={() => { throw new Error() }}>Reload</Button>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: getPaddingForNotch(),
    flex: 1,
    width: window.width,
    backgroundColor: colors.BRAND_PRIMARY_DARKER,
    paddingRight: 56 // menu offset
  },
  statusBarSpaceHolder: {
    height: getStatusBarHeight(),
  },
  content: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 8
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 16
  },
  hr: {
    alignSelf: 'stretch',
    height: 1,
    marginVertical: 16,
    backgroundColor: colors.BRAND_PRIMARY_LIGHTER
  },
  loginInfo: {
    paddingHorizontal: 16
  },
});

// redux connect and export
const mapStateToProps = (state) => {
  return {
    cards: state.transportCard.list,
    userData: state.profile.data,
    profileAlertCount: getProfileAlertCount(state),
    isLoggedIn: getIsLoggedIn(state)
  };
};

export const Menu = connect(mapStateToProps)(MenuView);
