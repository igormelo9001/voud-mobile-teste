import { extractLastFourDigits } from './parsers-formaters';

// Supported Payment Card Brands
export const CARD_VISA = 'visa';
export const CARD_MASTER = 'master';
export const CARD_ELO = 'elo';
export const CARD_AMEX = 'amex';
export const CARD_DINERS = 'diners';

const supportedPaymentCardBrands = [CARD_VISA, CARD_MASTER, CARD_DINERS, CARD_ELO, CARD_AMEX];
export const DEFAULT_PAYMENT_CARD_MAX_LENGTH = 16;

// images

const amexLogo = require('../images/card-brands/amex.png');
const dinersLogo = require('../images/card-brands/diners.png');
const eloLogo = require('../images/card-brands/elo.png');
const masterLogo = require('../images/card-brands/master.png');
const visaLogo = require('../images/card-brands/visa.png');

// utils

export const getSupportedPaymentCardBrands = isDebit => isDebit ? [CARD_VISA, CARD_MASTER] : supportedPaymentCardBrands;
export const getSupportedPaymentCardBrandsScoo = () => [CARD_VISA, CARD_MASTER];

export const getLogoForBrand = (brand) => {
  if (typeof brand !== 'string') return null;

  switch (brand.toLowerCase()) {
    case CARD_AMEX:
      return amexLogo;

    case CARD_DINERS:
      return dinersLogo;

    case CARD_ELO:
      return eloLogo;

    case CARD_MASTER:
      return masterLogo;

    case CARD_VISA:
      return visaLogo;
  }
};

export const getPaymentMethodName = (cardFlag) => {
  const cardFlagLowerCase = cardFlag ? cardFlag.toLowerCase() : '';
  switch (cardFlagLowerCase) {
    case CARD_AMEX:
      return 'American Express';
    case CARD_DINERS:
      return 'Diners Club';
    case CARD_MASTER:
      return 'MasterCard';
    case CARD_VISA:
      return 'Visa';
    case CARD_ELO:
      return 'Elo';
    default:
      return '';
  }
}

export const formatPaymentMethodName = (brand, cardNumber) => {
  return `${getPaymentMethodName(brand)} final ${extractLastFourDigits(cardNumber)}`;
};

export const generateDisplayMask = (brand, cardNumber = '0000') => {
  const lastFourDigits = extractLastFourDigits(cardNumber);
  brand = brand.toLowerCase();

  if (brand === CARD_AMEX) // 4-6-5
    return `•••• •••••• •${lastFourDigits}`;

  if (brand === CARD_DINERS) // 4-6-4
    return `•••• •••••• ${lastFourDigits}`;

  // default 4-4-4-4
  return `•••• •••• •••• ${lastFourDigits}`;
};

export const identifyCardBrand = (paymentCardBrandPatterns, cardNumber, isDebit) => {
  if (!cardNumber) return '';

  // Remove non-digit characters
  const clearedCardNumber = cardNumber.replace(/\D/g, '');
  const cardBrand = supportedPaymentCardBrands.find(el => {
    const cardBrandPattern = paymentCardBrandPatterns[el];
    return cardBrandPattern && cardBrandPattern.regex && cardBrandPattern.regex.test(clearedCardNumber);
  });
  const supportedBrands = getSupportedPaymentCardBrands(isDebit);

  return supportedBrands.find(el => el === cardBrand) ? cardBrand : '';
}

// Note - max length considering format mask
export const getPaymentCardFieldMaxLength = (paymentCardBrandPatterns, cardBrand) => {
  const cardRegex = paymentCardBrandPatterns[cardBrand];
  // default format 4-4-4-4 with three spaces
  if (!cardRegex) return DEFAULT_PAYMENT_CARD_MAX_LENGTH + 3;

  // format 4-5-6 or 4-5-4 with two spaces
  const isFourSixPattern = cardBrand == CARD_DINERS || cardBrand === CARD_AMEX;
  const numberSpaces = isFourSixPattern ? 2 : 3;
  return cardRegex.maxLength + numberSpaces;
}
