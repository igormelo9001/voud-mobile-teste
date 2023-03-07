// NPM imports
import { Alert } from 'react-native';

const showIssuerDisabledAlert = message => {
  Alert.alert(
    'Aviso',
    message,
    [
      {
        text: 'OK',
      },
    ],
  );
}

export const checkIssuerEnabled = (issuerType, issuerConfig) => {
  const cardIssuerConfig = issuerConfig && issuerConfig[issuerType] ? issuerConfig[issuerType] : null;

  if (cardIssuerConfig && cardIssuerConfig.isEnabled === "false") {
    showIssuerDisabledAlert(cardIssuerConfig.message);
    return false;
  }
  return true;
}