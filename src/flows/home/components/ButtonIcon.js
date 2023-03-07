// NPM imports
import React from 'react';
import { pipe } from 'ramda';

import {
  Platform,
  StyleSheet,
  View
} from 'react-native';

// VouD imports
import Icon from '../../../components/Icon';
import { colors } from '../../../styles';
import { appendIf } from '../../../utils/fp-util';
import TouchableNative from '../../../components/TouchableNative';
import NotificationBadge from '../../../components/NotificationBadge/index';

// component
const ButtonIcon = ({ onPress, icon, align, style, buttonStyle, wrapperButton, badge }) => {

    const getButtonStyle = pipe(
      baseStyle => [baseStyle],
      appendIf(buttonStyle, buttonStyle), // append buttonStyle prop at the end, to override other styles
      StyleSheet.flatten
    );

    const getWrapperStyle = pipe(
      baseStyle => [baseStyle],
      appendIf(wrapperButton, wrapperButton), // append buttonStyle prop at the end, to override other styles
      StyleSheet.flatten
    );

    const renderIcon = () => {
      if (icon) {
        const getIconStyle = pipe(
          baseStyle => [baseStyle],
          StyleSheet.flatten
        );

        const iconName = Array.isArray(icon) ? (Platform.OS === 'ios' ? icon[0] : icon[1]) : icon;

        return (
          <Icon
            name={iconName}
            style={getIconStyle(styles.icon)}
          />
        );
      }
    };

    return (
      <View style={StyleSheet.flatten([styles.wrapperBadge, style])}>
        <View style={getWrapperStyle(styles.wrapperButton)}>
          <View style={styles.wrapperRipple}>
            <TouchableNative
              onPress={onPress}
              style={getButtonStyle(styles.button)}                
            >
              {renderIcon()}
            </TouchableNative>
          </View>
        </View>
        { badge &&
          <NotificationBadge/>
        }
      </View>
    )
}

// styles
const styles = StyleSheet.create({
  wrapperBadge: {
    padding: 2
  },
  wrapperButton: {
    borderRadius: 18,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOpacity: 1,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    },
    ...Platform.select({
      android: {
        elevation: 4
      }
    })
  },
  wrapperRipple: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  icon: {
    fontSize: 22,
    color: colors.BRAND_PRIMARY
  }
});

export default ButtonIcon;
