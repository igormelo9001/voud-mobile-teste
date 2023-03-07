import { Alert } from 'react-native';

// utils

const getSmartPurchaseAlertText = paymentMethod => {
    const activeSmartPurchases = paymentMethod.smartPurchaseList.filter(el => el.isActive);

    if (activeSmartPurchases.length === 0) return '';

    const result = activeSmartPurchases.reduce((acc, cur, index) => {
      let separator = '';
      if (index === activeSmartPurchases.length - 2) {
        separator = ' e ';
      } else if (index <= activeSmartPurchases.length - 3) {
        separator = ', ';
      }
      return `${acc}${cur.cardData.nick}${separator}`;
    }, '');

    return ` Ele é usado na compra programada ${activeSmartPurchases.length === 1 ? 'do cartão' : 'dos cartões'}: ${result}.`;
  }

export const showRemovePaymentMethodAlert = (paymentMethod, onConfirmation) => {
    Alert.alert(
        'Remover forma de pagamento',
        `Você tem certeza que deseja remover a forma de pagamento ${paymentMethod.name}?${getSmartPurchaseAlertText(paymentMethod)}`,
        [
        {
            text: 'Cancelar',
            onPress: () => {}
        },
        {
            text: 'Sim',
            onPress: onConfirmation
        }
        ]
    );
}
