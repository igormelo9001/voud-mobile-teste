import React, { PureComponent } from 'react';
// component
export class DrawerView extends PureComponent {
  render() {
    const { router, navigation: { state, dispatch, addListener } } = this.props;
    const { routes, index } = state;
    const Component = router.getComponentForState(state);
    const childNavigation = { dispatch, addListener, state: routes[index] };
    <Component navigation={addNavigationHelpers(childNavigation)} />  }
}
