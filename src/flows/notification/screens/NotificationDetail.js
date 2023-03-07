// NPM Imports
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Share,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';

// VouD Imports
import Header, { headerActionTypes } from '../../../components/Header';
import BrandText from '../../../components/BrandText';
import SystemText from '../../../components/SystemText';
import Button from '../../../components/Button';
import { colors } from '../../../styles';

import { notificationTypes } from '../../../redux/notifications';
import { openUrl } from '../../../utils/open-url';
import { navigateFromHome } from '../../../redux/nav';
import TouchableNative from '../../../components/TouchableNative';
import { formatDiscountCode } from '../../../utils/parsers-formaters';
import { GAEventParams, GATrackEvent } from '../../../shared/analytics';
import { routeNames } from '../../../shared/route-names';

// Images
const notificationPlaceholderImage = require('../../../images/notification-default-header.png');
const campaignNotificationImage = require('../../../images/notification-campaign-header.png');

// Screen component
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  activeNotification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    read: PropTypes.bool.isRequired,
    message: PropTypes.shape({
      subject: PropTypes.string,
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      data: PropTypes.shape({
        mediaUrl: PropTypes.string,
        referralUrl: PropTypes.string,
        referralCode: PropTypes.string,
        urlPartner: PropTypes.string,
      })
    })
  }).isRequired,
  username: PropTypes.string.isRequired
};

class NotificationDetailView extends Component {

  _close = () => {
    this.props.dispatch(NavigationActions.back());
  }

  _getMediaUrl = () => {
    const { activeNotification : { message } } = this.props;
    const data = message && message.data ? message.data : {};

    return data.mediaUrl ? data.mediaUrl.trim() : '';
  }

  _getHeaderImageSource = () => {
    const { activeNotification: { message } } = this.props;
    const type = message && message.type ? message.type : '';
    const mediaUrl = this._getMediaUrl();

    if (mediaUrl !== '') {
      return { uri: mediaUrl };
    }

    return type === notificationTypes.CAMPAIGN_MGM ? campaignNotificationImage : notificationPlaceholderImage;
  }

  _shareDeepLink = () => {
    const { username, activeNotification : { customer } } = this.props;
    const details = customer && customer.details ? customer.details : {};
    const referralCode = details.referralCode ? details.referralCode : '';
    const referralUrlFirebase = details.referralUrlFirebase ? details.referralUrlFirebase : '';

    const { categories: { BUTTON }, actions: { CLICK }, labels: { SHARE_MGM_DEEP_LINK } } = GAEventParams;
    GATrackEvent(BUTTON, CLICK, SHARE_MGM_DEEP_LINK);

    Share.share({
      message: `${username} te presenteou com a isenção da taxa de pagamento para uma compra de crédito no app VouD! Para usar, cadastre-se com o código ${referralCode} ou clique no link: ${referralUrlFirebase}`,
      title: 'Convite VouD'
    }, {
      // iOS only:
      subject: 'Convidar Amigos',
      // Android only:
      dialogTitle: 'Convidar Amigos',
    });
  }

  _getMediaDestinationUrl = () => {
    const { activeNotification : { message } } = this.props;
    const data = message && message.data ? message.data : {};

    return data.mediaDestinationUrl ? data.mediaDestinationUrl.trim() : '';
  }

  _getMediaDestinationRoute = () => {
    const { activeNotification : { message } } = this.props;
    const data = message && message.data ? message.data : {};

    return data.mediaDestinationRoute ? data.mediaDestinationRoute.trim() : '';
  }

  _openMediaDestinationUrl = () => {
    const mediaDestinationUrl = this._getMediaDestinationUrl();
    const mediaDestinationRoute = this._getMediaDestinationRoute();

    if (mediaDestinationUrl !== '') {
      openUrl(mediaDestinationUrl);
    }
    else if (mediaDestinationRoute !== '') {
      this.props.dispatch(navigateFromHome(routeNames[mediaDestinationRoute]))
    }
  }

  _renderPartnerNotification = () => {
    return (
      <TouchableNative 
        style={styles.partnerContainer}
        onPress={this._openMediaDestinationUrl}>
        <Image
          style={styles.partnerImg}
          source={{ uri: this._getMediaUrl() }}
          resizeMode="stretch"
        />
      </TouchableNative>
    );
  }

  _showPromoFinished = () => {
    Alert.alert('Promoção esgotada', 'Agora todos os usuários poderão recarregar cartões de transporte isentos de tarifa. Compre agora!');
  }

  _renderDefaultNotification = () => {
    const { activeNotification : {  customer, message } } = this.props;
    const type = message && message.type ? message.type : '';
    const title = message && message.title ? message.title : '';
    const data = message && message.data ? message.data : {};
    const fullText = data && data.fullText ? data.fullText : '';
    const details = customer && customer.details ? customer.details : {};
    const referralCode = details.referralCode ? details.referralCode : '';
    const subject = data.subject ? data.subject : '';
    const mediaDestinationUrl = this._getMediaDestinationUrl();
    const HeaderComponent = mediaDestinationUrl === '' ? View : TouchableNative;
    
    return (
      <Fragment>
        <ScrollView>
          <HeaderComponent 
            onPress={this._openMediaDestinationUrl}
            style={styles.header}
          >
            <Image
              source={this._getHeaderImageSource()}
              style={styles.headerImage}
              resizeMode="cover"
            />
            <View style={styles.headerTextContainer}>
              <LinearGradient 
                colors={[ 'transparent', 'rgba(0, 0, 0, .53)' ]} 
                style={styles.linearGradient}
              />
              <BrandText style={styles.headerText}>{title}</BrandText>
            </View>
          </HeaderComponent>
          <View style={styles.detailBody}>
            {
              subject !== '' && 
              <BrandText style={styles.detailTitle}>
                {subject}
              </BrandText>
            }
            {
              type === notificationTypes.CAMPAIGN_MGM &&
              <View style={styles.campaignVoucher}>
                <SystemText style={styles.campaignVoucherNumber}>{formatDiscountCode(referralCode)}</SystemText>
              </View>
            }
            <SystemText style={styles.detailDescription}>
              {fullText}
            </SystemText>
          </View>
        </ScrollView>
        {
          type === notificationTypes.CAMPAIGN_MGM &&
          <View style={styles.actionBtnContainer}>
            <Button
              onPress={this._showPromoFinished}>
              Convidar Amigos
            </Button>
          </View>
        }
      </Fragment>
    );
  }

  render() {
    const { activeNotification : { message } } = this.props;
    const type = message && message.type ? message.type : '';

    return (
      <View style={styles.container}>
        <Header
          title="Notificação"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: this._close
          }}
        />
        { type === notificationTypes.PARTNER ? this._renderPartnerNotification() : this._renderDefaultNotification() }
      </View>
    );
  }
}

NotificationDetailView.propTypes = propTypes;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  detailBody: {
    padding: 24,
  },
  // Custom image header
  header: {
    height: 160,
    backgroundColor: colors.BRAND_PRIMARY_LIGHT,
    justifyContent: 'flex-end'
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: null,
    height: 160,
  },
  headerTextContainer: {
    padding: 16
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    lineHeight: 32,
  },
  // Campaign voucher number
  campaignVoucher: {
    backgroundColor: colors.GRAY_LIGHT2,
    paddingVertical: 16,
    borderRadius: 4,
    marginBottom: 16,
  },
  campaignVoucherNumber: {
    fontSize: 16,
    color: colors.BRAND_PRIMARY,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  // Text styles
  detailTitle: {
    fontSize: 16,
    color: colors.GRAY_DARKER,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailDescription: {
    fontSize: 14,
    color: colors.GRAY,
    lineHeight: 24
  },
  actionBtnContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderColor: colors.GRAY_LIGHTER
  },
  // Partner
  partnerContainer: {
    flex: 1,
    backgroundColor: colors.BRAND_PRIMARY_LIGHT
  },
  partnerImg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: null,
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
})

function mapStateToProps(state, ownProps) {
  const { navigation: { state: { params: { notification } } } } = ownProps;
  return {
    activeNotification: notification,
    username: `${state.profile.data.name} ${state.profile.data.lastName}`
  }
}

export const NotificationDetail = connect(mapStateToProps)(NotificationDetailView);
