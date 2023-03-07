import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

import Icon from '../../../../components/Icon';
import LinearGradient from 'react-native-linear-gradient';

class UserMarker extends Component {
  constructor(props) {
    super(props);
    this._tracksViewChanges = true;
  }

  componentDidUpdate() {
    this._tracksViewChanges = false;
  }

  render() {
    const {
      mapRef,
      coordinate,
      mapPosition,
    } = this.props;
    return (
      <Marker
        coordinate={coordinate}
        tracksViewChanges={this._tracksViewChanges}
       >
        <View style={styles.userMarkerContainer}>
          <View style={styles.userMarkerGradientContainer}>
            <LinearGradient
              colors={['#F39200', '#FDC300']}
              style={styles.userMarker}
              start={{ x: 0, y: 1 }}
              end={{ x: 1.2, y: 0 }}
            >
              <Icon style={styles.userMarkerIcon} name="user" size={16} />
            </LinearGradient>
          </View>
        </View>
      </Marker>
    );
  }
}

const styles = StyleSheet.create({
  userMarkerContainer: {
    // borderWidth: 5,
    borderColor: '#F8E71C',
    backgroundColor: '#F8E71C',
    borderRadius: 30 / 2,
    height: 30,
    width: 30,
    alignItems:"center",
    justifyContent: 'center',
  },
  userMarkerGradientContainer: {
    // borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
  },
  userMarker: {
    // padding: 2,
    height: 20,
    width: 20,
    alignItems: 'center',

  },
  userMarkerIcon: {
    color: 'white'
  },
})

UserMarker.propTypes = {};
UserMarker.defaultProps = {};

export default UserMarker;

