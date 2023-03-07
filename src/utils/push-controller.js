// NPM imports
import { Platform } from 'react-native';
import firebase from 'react-native-firebase';

import { setFCMToken } from '../redux/profile';
import { navigateToRoute } from '../redux/nav';
import { routeNames } from '../shared/route-names';
import { viewPurchaseDetails } from '../redux/financial';
import { addNotification, openNotification } from '../redux/notifications';
import { colors } from '../styles';

const ANDROID_CHANNEL_ID = 'voud-channel';
const ANDROID_CHANNEL_NAME = 'VouD channel';
const NOTIFICATION_IC = 'ic_stat_ic_notification';

export const makePushController = dispatch => {
  let notificationListener;
  let refreshTokenListener;
  let notificationOpenedListener;

  if (__DEV__) {
    console.tron.log('Notification opened from tray');
  }

  const _handleNotificationOpened = notif => {
    if (__DEV__) {
      console.tron.log('Notification opened from tray');
      console.tron.log(notif);
    }

    const { notification } = notif;
    if (!notification || !notification.data) return;

    const {
      data: { routeName, routeParams },
    } = notification;
    const parsedRouteParams = routeParams ? JSON.parse(routeParams) : null;

    switch (routeName) {
      case routeNames.PURCHASE_HISTORY_DETAIL: {
        const message =
          parsedRouteParams && parsedRouteParams.message ? parsedRouteParams.message : null;
        const messageData = message && message.data ? message.data : null;

        if (messageData) {
          dispatch(viewPurchaseDetails(Number(messageData.purchaseId)));
          dispatch(
            navigateToRoute(routeNames.PURCHASE_HISTORY_DETAIL, { refreshPurchaseList: true })
          );
        }
        return;
      }
      case routeNames.NOTIFICATION_DETAIL: {
        if (parsedRouteParams) {
          dispatch(addNotification(parsedRouteParams));
          dispatch(openNotification(parsedRouteParams));
        }
        return;
      }
      case routeNames.FINISH_REPORT_REQUEST: {
        const message =
          parsedRouteParams && parsedRouteParams.message ? parsedRouteParams.message : null;
        const messageData = message.data ? message.data : null;

        if (messageData) {
          dispatch(
            navigateToRoute(routeNames.FINISH_REPORT_REQUEST, { finishReportData: messageData })
          );
        }
        return;
      }
      default:
        if (routeName) dispatch(navigateToRoute(routeName));
    }
  };

  const _scheduleLocalNotification = notification => {
    const { data, android, ios } = notification;

    const localNotification = new firebase.notifications.Notification()
      .setNotificationId(notification.notificationId)
      .setTitle(notification.title)
      .setSubtitle(notification.subtitle)
      .setBody(notification.body);

    if (data) {
      localNotification.setData({ ...data });
      data.sound && localNotification.setSound(data.sound);
    }

    if (Platform.OS === 'android') {
      const { _smallIcon } = android;
      const icon = data && data.icon ? data.icon : _smallIcon.icon;
      const color = data && data.color ? data.color : colors.BRAND_PRIMARY;

      localNotification.android
        .setBigText(notification.body)
        .android.setChannelId(ANDROID_CHANNEL_ID)
        .android.setSmallIcon(NOTIFICATION_IC)
        .android.setColor(color)
        .android.setAutoCancel(true)
        .android.setPriority(firebase.notifications.Android.Priority.High);
    }

    if (Platform.OS === 'ios') {
      localNotification.ios.setBadge(notification.ios.badge);
    }

    firebase.notifications().displayNotification(localNotification);
  };

  const _handleNotificationReceived = notification => {
    if (__DEV__) {
      console.tron.log('Notification received');
      console.tron.log(notification);
    }

    if (notification && notification.data) {
      const {
        data: { routeName, routeParams },
      } = notification;

      if (routeParams && routeName === routeNames.NOTIFICATION_DETAIL) {
        const parsedRouteParams = JSON.parse(routeParams);
        dispatch(addNotification(parsedRouteParams));
      }
    }

    _scheduleLocalNotification(notification);
  };

  return {
    async init() {
      try {
        await firebase.messaging().requestPermission();
        const token = await firebase.messaging().getToken();
        dispatch(setFCMToken(token));

        // Android Setup
        if (Platform.OS === 'android') {
          const channel = new firebase.notifications.Android.Channel(
            ANDROID_CHANNEL_ID,
            ANDROID_CHANNEL_NAME,
            firebase.notifications.Android.Importance.Max
          ).setDescription(ANDROID_CHANNEL_NAME);
          firebase.notifications().android.createChannel(channel);
        }

        // Process initial notification
        const initialNotification = await firebase.notifications().getInitialNotification();
        if (initialNotification) {
          _handleNotificationOpened(initialNotification);
        }

        // Set Listeners
        notificationListener = firebase.notifications().onNotification(_handleNotificationReceived);

        notificationOpenedListener = firebase
          .notifications()
          .onNotificationOpened(notificationOpen => {
            _handleNotificationOpened(notificationOpen);
          });

        refreshTokenListener = firebase.messaging().onTokenRefresh(token => {
          dispatch(setFCMToken(token));
        });

        return this;
      } catch (error) {
        if (__DEV__) console.tron.log(error.message, true);
      }
    },
    removeListeners() {
      if (notificationListener) notificationListener();
      if (refreshTokenListener) refreshTokenListener();
      if (notificationOpenedListener) notificationOpenedListener();
      return this;
    },
  };
};
