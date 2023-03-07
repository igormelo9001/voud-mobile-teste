// NPM imports
import React, { Component } from 'react';
import { 
    View,
    Text,
    Platform,
    StyleSheet
} from 'react-native';

// VouD imports
import { colors } from '../../styles/constants';

// component
class NotificationBadge extends Component {

  render () {
    return (
      <View style={StyleSheet.flatten([styles.badge, this.props.style])}>
      </View>
    )
  }
  
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 12,
    height: 12,
    backgroundColor: colors.BRAND_NOTIFICATION,
    borderRadius: 12,
    ...Platform.select({
      android: {
        elevation: 5
      }
    })
  }
});

export default NotificationBadge;
