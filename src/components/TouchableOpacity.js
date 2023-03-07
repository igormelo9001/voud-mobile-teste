// NPM imports
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { withPreventDoubleTap } from './WithPreventDoubleTap';

// Component
const PreventDoubleTapHOC = withPreventDoubleTap(TouchableOpacity);

class VoudTouchableOpacity extends Component {
  render() {
    const TouchableComponent = this.props.disablePreventDoubleTap ? TouchableOpacity : PreventDoubleTapHOC;
    return (
      <TouchableComponent {...this.props} />
    );
  }
}

export default VoudTouchableOpacity;