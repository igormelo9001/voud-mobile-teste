// NPM Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
} from 'react-native';

// VouD Imports
import TouchableNative from '../../../components/TouchableNative';
import BrandText from '../../../components/BrandText';
import Icon from '../../../components/Icon';
import { colors } from '../../../styles';
import { notificationTypes } from '../../../redux/notifications';

// PropTypes
const propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    read: PropTypes.bool,
    message: PropTypes.shape({
      subject: PropTypes.string,
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      data: PropTypes.shape({
        urlMedia: PropTypes.string,
        referralUrl: PropTypes.string,
        referralCode: PropTypes.string,
        urlPartner: PropTypes.string,
      })
    })
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onOpenActions: PropTypes.func.isRequired,
};

// ColorTypes
const colorTypes = {
  firstColor: colors.BRAND_PRIMARY_LIGHT,
  secondColor: colors.BRAND_PRIMARY_DARKER
}

// Component
class NotificationItem extends Component {

  _renderNotificationStyleObject = () => {
    const { data: { read } } = this.props;

    return StyleSheet.flatten([
      styles.notificationItem,
      read ? styles.notificationItemRead : {}
    ]);
  }

  _getIconName = () => {
    const { data: { message } } = this.props;
    const type = message ? message.type : '';

    switch (type) {
      case notificationTypes.ALERT:
        return 'message';
      case notificationTypes.CAMPAIGN_MGM:
      case notificationTypes.PARTNER:
        return 'warning';
      default: 
        return 'message';
    }
  }

  _getIconClassObject = () => {
    const { data: { message } } = this.props;
    const type = message ? message.type : '';

    switch (type) {
      case notificationTypes.ALERT:
        return styles.notificationIconAlert;
      case notificationTypes.CAMPAIGN_MGM:
        return styles.notificationIconCampaign;
      case notificationTypes.PARTNER:
        return styles.notificationIconPartner;
      default: 
        return styles.notificationIconAlert;
    }
  }

  render() {
    const { data, onPress, onOpenActions} = this.props;
    const message = data && data.message;
    const title = message && message.title ? message.title : '';
    const text = message && message.text ? message.text : '';

    return (
      <TouchableNative
        onPress={onPress}
        key={data.id}
        style={this._renderNotificationStyleObject()}
      >
        <View style={styles.notificationIconContainer}>
          <Icon
            name={this._getIconName()}
            style={this._getIconClassObject()}
          />
        </View>
        <View style={styles.notificationText}>
          <BrandText style={styles.notificationTitle}>
            {title}
          </BrandText>
          {
            text !== '' &&
              <BrandText style={styles.notificationDescription} ellipsizeMode={'tail'} numberOfLines={1}>
                {text}
              </BrandText>
          }
        </View>
        <TouchableNative
          borderless
          style={styles.moreIconContainer}
          onPress={onOpenActions}
        >
          <Icon 
            name="md-more-horiz"
            style={styles.moreIcon}
          />
      </TouchableNative>
    </TouchableNative>
    )
  }
}

NotificationItem.propTypes = propTypes;
NotificationItem.colorTypes = colorTypes;

// Styles
const styles = StyleSheet.create({
  notificationItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_LIGHT2,
    flexDirection: 'row',
    minHeight: 72
  },
  notificationItemRead: {
    backgroundColor: colors.GRAY_LIGHTEST
  },
  notificationIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 16,
  },
  notificationIconAlert: {
    fontSize: 24,
    color: colors.BRAND_PRIMARY
  },
  notificationIconCampaign: {
    fontSize: 24,
    color: colors.BRAND_SECONDARY
  },
  notificationIconPartner: {
    fontSize: 24,
    color: colors.BRAND_PRIMARY_LIGHT
  },
  notificationText: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 16
  },
  notificationTitle: {
    fontSize: 14,
    color: colors.GRAY_DARKER
  },
  notificationDescription: {
    fontSize: 12,
    color: colors.GRAY,
    marginTop: 4
  },
  moreIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16
  },
  moreIcon: {
    fontSize: 24,
    color: colors.BRAND_PRIMARY
  }
});

export default NotificationItem;