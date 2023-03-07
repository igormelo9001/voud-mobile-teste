import { Alert } from 'react-native';
import { showToast, toastStyles } from '../redux/toast';

export const showSmartPurchaseUnavailableForEscolar = () => {
  return Alert.alert('Função indisponível',
    'A compra programada não está disponível para cartões de recarga escolar.', [{ text: 'OK' }]);
}


export const checkIfSmartPurchaseHasPaymentMethod = (dispatch, paymentMethodId, paymentMethods) => {
  if (!paymentMethods.some(el => el.id === paymentMethodId)) {
    dispatch(showToast('Forma de pagamento não configurada', toastStyles.ERROR));
    return false;
  }
  return true;
}