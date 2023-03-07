// NPM imports
import { NavigationActions } from 'react-navigation';

import { voudRequest } from '../shared/services';
import { requestPaymentTransactionSuccess, paymentCardTypes, productTypes } from '../redux/financial';
import { navigateToRoute } from '../redux/nav';
import { routeNames } from '../shared/route-names';
import { trackPurchaseEvent } from './tracking-util';
import { VoudError, FetchError } from '../shared/custom-errors';

const RETRY_INTERVAL = 2000;
export const fetchPaymentStatus = {
  PROCESSING: 'PROCESSING',
  PROCCESSED: 'PROCCESSED',
  CANCELED: 'CANCELED'
};

export const fetchPaymentStatusDescription = {
  AUTHORIZED: 'AUTHORIZED'
};

export const initCheckDebitCardPaymentStatus = (dispatch, params) => {
  let isFetching = false;

  const checkTimer = setInterval(() => {
    if (!isFetching) {
      isFetching = true;
      
      checkDebitCardPaymentStatus(dispatch, params)
        .then(finish => {
          isFetching = false;
          if (finish) clearInterval(checkTimer);
        });
    }
  }, RETRY_INTERVAL);

  return checkTimer;
}

const checkDebitCardPaymentStatus = async (dispatch, params) => {
  try {
        
    if (__DEV__) console.tron.log('Checking debit card payment status...');

    const requestBody = {
      acquirerPaymentId: params.acquirerPaymentId
    };
    const statusEndpoint = params.productType === productTypes.PHONE_RECHARGE ? '/mobile/fetch' : '/financial/fetch';
    
    const response = await voudRequest(statusEndpoint, 'POST', requestBody, true);
    const { payload } = response;
    
    if (payload && (payload.status === fetchPaymentStatus.PROCCESSED ||
      (payload.status === fetchPaymentStatus.PROCESSING && payload.acquirerStatusDescription === fetchPaymentStatusDescription.AUTHORIZED))) {

      trackPurchaseEvent(params.acquirerTransactionId, Number(params.purchaseValue) / 100,
       0, params.productType);
      dispatch(requestPaymentTransactionSuccess(params.hasRecurrent));

      if (params.productType === productTypes.PHONE_RECHARGE) {
        dispatch(navigateToRoute(routeNames.PHONE_RECHARGE_SUCCESSFUL));
      } else {
        dispatch(navigateToRoute(routeNames.PAYMENT_SUCCESSFUL));
      }

      return true;
    }

    if (payload && payload.status === fetchPaymentStatus.CANCELED) {
      dispatch(navigateToRoute([NavigationActions.back(), routeNames.PAYMENT_ERROR],
        { paymentData: params, error: new VoudError('Pagamento cancelado', payload.status, { ...response }) }));
      return true;
    }

    return false;
  } catch (error) {
    if (__DEV__) console.tron.log(error.message, true);
    dispatch(navigateToRoute([NavigationActions.back(), routeNames.PAYMENT_ERROR],
      { paymentData: params, error: new FetchError(error.message) }));
    return true;
  }
};
