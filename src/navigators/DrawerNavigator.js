import React, { Component } from 'react';
import {
  addNavigationHelpers,
  createNavigator,
  TabRouter,
} from 'react-navigation';

// VouD imports
import { routeNames } from '../shared/route-names';
import { NotificationCenter } from '../flows/notification/screens';
import { LoggedMenu } from '../flows/menu';

// component
class DrawerView extends Component {
  render() {
    const { 
      router,
      navigation: { state, dispatch, addListener }
    } = this.props;
    const { routes, index } = state;
    const Component = router.getComponentForState(state);
    const childNavigation = { dispatch, addListener, state: routes[index] };
    return (
      <Component navigation={addNavigationHelpers(childNavigation)} />
    );
  }
}

const DrawerRouter = TabRouter(
  {
    [routeNames.LOGGED_MENU]: { screen: LoggedMenu },
    [routeNames.NOTIFICATION_CENTER]: { screen: NotificationCenter }
  },
  {
    navigationOptions: {
      gesturesEnabled: false,
      header: null
    }
  }
);

const DrawerNavigator = createNavigator(DrawerRouter)(DrawerView);

export default DrawerNavigator;
