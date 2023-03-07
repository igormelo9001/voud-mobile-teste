// NPM imports
import React, { Component } from 'react';
import { View } from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';

// IcoMoon config
import icoMoonConfig from './selection.json';

const InnerIcon = createIconSetFromIcoMoon(icoMoonConfig,'Voud','voud.ttf');

class Icon extends Component {

  render() {
    return (
      <InnerIcon {...this.props}/>
    );
  }
}

export default Icon;
