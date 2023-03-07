import { AppEventsLogger } from 'react-native-fbsdk';

export const FBEventsConstants = {
  COMPLETED_REGISTRATION: 'Completed Registration',
  INITIATED_CHECKOUT: 'Initiated Checkout',
  ADDED_PAYMENT_INFO: 'Added Payment Info',
  PURCHASED: 'Purchased',
};

export const FBLogEvent = eventName => {
  AppEventsLogger.logEvent(eventName);
};

export const FBLogPurchase = (amount, currencyCode = 'BRL') => {
  AppEventsLogger.logPurchase(amount, currencyCode);
};
