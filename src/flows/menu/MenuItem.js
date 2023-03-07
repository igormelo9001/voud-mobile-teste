// NPM imports
import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

// VouD imports
import VoudText from '../../components/VoudText';
import Icon from '../../components/Icon';
import TouchableNative from '../../components/TouchableNative';
import { colors } from '../../styles';
import getIconName from '../../utils/get-icon-name';
import NotificationBadge from '../../components/NotificationBadge/index';
import BrandText from '../../components/BrandText';

// component
const MenuItem = ({ text, icon, onPress, badge, noIconRight }) => {
    return onPress ?
    (
      <TouchableNative
          onPress={onPress}
          style={styles.container}
      > 
        <View style={styles.wrapperBadge}>
          <Icon
            style={StyleSheet.flatten([styles.icon, styles.iconCenter])}
            name={getIconName(icon)}
          />
          { badge && 
            <NotificationBadge
              style={styles.badge}/>
          }
        </View>
        <VoudText style={styles.text}>
          {text}
        </VoudText>
        {
          noIconRight ? null : (
            <BrandText
            style={styles.iconRight}>
            <Icon
              style={styles.icon}
              name='arrow-forward'         
            />
          </BrandText>
          )
        }
      </TouchableNative>
    ) :
    (
      <View style={styles.container}>
        <Icon
          style={StyleSheet.flatten([styles.icon, styles.iconCenter, styles.iconNoTouch])}
          name={getIconName(icon)}
        />
        <VoudText style={StyleSheet.flatten([styles.text, styles.textNoTouch])}>
          {text}
        </VoudText>
        {
          noIconRight ? null : (
            <Icon
              style={StyleSheet.flatten([styles.icon, styles.iconRight])}
              name='arrow-forward'         
            />
          )
        }
      </View>
    );
};

// styles
const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    height: 72,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_LIGHTER
  },
  wrapperBadge: {
    padding: 2
  },
  badge: {
    width: 8,
    height: 8,
    right: 2,
    top: 2
  },
  icon: {
    fontSize: 24,
    color: colors.BRAND_PRIMARY
  },
  iconCenter: {
    width: 24,
    textAlign: 'center'
  },
  iconRight: {
    width: 300,
    flex: 1,
    textAlign: 'right',
    color: colors.BRAND_PRIMARY
  },
  iconNoTouch: {
    color: colors.BRAND_PRIMARY
  },
  text: {
    fontSize: 14,
    color: colors.GRAY,
    marginLeft: 16
  },
  textNoTouch: {
    opacity: 0.75
  }
});

export default MenuItem;
