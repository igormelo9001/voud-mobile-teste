// NPM imports
import { Alert } from 'react-native';

// VouD imports
import { formatCurrency } from '../utils/parsers-formaters';
import { transportCardTypes, walletApplicationId } from '../redux/transport-card';

export const getBomEscolarQuoteValueAvailable = (card) => {
  // return 0 if not BOM_ESCOLAR type
  if (card.layoutType !== transportCardTypes.BOM_ESCOLAR) {
    return 0;
  }
  else {
    const cardWallets = card.wallets ? card.wallets : [];
    const application = cardWallets.find(wallet => wallet.applicationId === walletApplicationId.BOM_ESCOLAR);

    return application ? application.quoteValueAvailable : 0;
  }
}

export const cardHasSufficientQuota = (card, minBuyValue = 0) => {
  if (card.layoutType === transportCardTypes.BOM_ESCOLAR_GRATUIDADE) return false;

  // if not BOM_ESCOLAR type, return true
  if (card.layoutType !== transportCardTypes.BOM_ESCOLAR) {
    return true;
  }
  else {
    return getBomEscolarQuoteValueAvailable(card) < minBuyValue ? false : true;
  }
};

export const insufficientQuotaErrorHandler = (quotaValue = 0, minBuyValue = 0) => {
  Alert.alert(
    'Cota não disponível para compra',
    `Você ainda possui R$ ${formatCurrency(quotaValue)} para comprar esse mês, porém nosso valor mínimo de pedidos é de R$ ${formatCurrency(minBuyValue)}.`,
    [
      {
        text: 'OK'
      }
    ]
  );
};
