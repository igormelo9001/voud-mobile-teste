import { encrypt } from "react-native-adyen-cse";
import { JSEncrypt } from "jsencrypt";

export const adyenEncrypt = async (
  { holder, cardNumber, securityCode, expirationDate },
  adyenPK
) => {
  const cardData = {
    holderName: holder,
    number: cardNumber,
    cvc: securityCode,
    expiryMonth: expirationDate.slice(0, 2),
    expiryYear: expirationDate.slice(3)
  };
  return await encrypt(cardData, adyenPK);
};

export const cieloEncrypt = (financialCardObj, cieloPK) => {
  const rsaEncrypt = new JSEncrypt();
  rsaEncrypt.setPublicKey(cieloPK);
  return rsaEncrypt.encrypt(JSON.stringify(financialCardObj));
};

export const buildEncryptedCardData = async (
  financialCardObj,
  cieloPK,
  adyenPK
) => {
  if (__DEV__) {
    console.tron.log(financialCardObj);
    console.tron.log("cieloPK");
    console.tron.log(cieloPK);

    console.tron.log("adyenPK");
    console.tron.log(adyenPK);
  }

  if (cieloPK && adyenPK) {
    return {
      encrypted: {
        CIELO: cieloEncrypt(financialCardObj, cieloPK),
        ADYEN: await adyenEncrypt(financialCardObj, adyenPK)
      }
    };
  } else {
    throw new Error("Ocorreu um erro, tente novamente em instantes.");
  }
};
