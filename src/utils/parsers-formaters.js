// NPM imports
import { pipe } from 'ramda';
import { identifyCardBrand, CARD_DINERS, CARD_AMEX, DEFAULT_PAYMENT_CARD_MAX_LENGTH } from './payment-card';

export const formatCpf = (val) => {
	if (!val) return '';

	val = val.replace(/\D/g, '');

	if (val.length <= 3) return val;
	if (val.length <= 6) return val.replace(/^(\d{3})(\d+)/, '$1.$2');
	if (val.length <= 9) return val.replace(/^(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
	return val.slice(0, 11).replace(/^(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
};

export const parseCpf = (val) => {
	if (!val) return '';

	return val.replace(/\D/g, '').slice(0, 11);
};

export const formatMobile = (val) => {
	if (!val) return '';

	val = val.replace(/\D/g, '');

	if (val.length === 0) return val;
	if (val.length <= 2) return val.replace(/^(\d+)/, '($1');
	if (val.length <= 3) return val.replace(/^(\d{2})(\d+)/, '($1) $2');
	if (val.length <= 8) return val.replace(/^(\d{2})(\d{1})(\d+)/, '($1) $2 $3');
	return val.slice(0, 11).replace(/^(\d{2})(\d{1})(\d{4})(\d+)/, '($1) $2 $3 $4');
};

export const formatMobileNoIntl = (val) => {
	if (!val) return '';

	val = val.replace(/\D/g, '');

	return formatMobile(val.slice(2));
};

export const parseMobile = (val) => {
	if (!val) return '';

	return val.replace(/\D/g, '').slice(0, 11);
};

export const formatCep = (val) => {
	if (!val) return '';

	val = val.replace(/\D/g, '');

	if (val.length === 0) return val;
	if (val.length <= 5) return val.replace(/^(\d+)/, '$1');
	return val.slice(0, 8).replace(/^(\d{5})(\d+)/, '$1-$2');
};

export const formatRg = (val) => {
	if (!val) return '';

	val = val.replace(/\D/g, '');
	val = val.slice(0, 9).replace(/(\d{2})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4');
	return val;
};

export const parseCep = (val) => {
	if (!val) return '';

	return val.replace(/\D/g, '').slice(0, 8);
};

export const formatBomCardNumber = (val) => {
	if (!val) return '';

	val = val.replace(/\D/g, '');

	if (val.length <= 2) return val;
	if (val.length <= 4) return val.replace(/^(\d{2})(\d+)/, '$1.$2');
	if (val.length <= 12) return val.replace(/^(\d{2})(\d{2})(\d+)/, '$1.$2.$3');
	return val.slice(0, 13).replace(/^(\d{2})(\d{2})(\d{8})(\d+)/, '$1.$2.$3-$4');
};

export const parseBomCardNumber = (val) => {
	if (!val) return '';

	return val.replace(/\D/g, '').slice(0, 13);
};

export const formatCurrency = pipe(
	Number,
	(n) => (Number.isNaN(n) ? 0 : n),
	Intl.NumberFormat('pt-br', { minimumFractionDigits: 2 }).format
);

export const unformatFromCents = (val) => {
	var newVal = Number(val.replace(/\D/g, ''));
	return (newVal /= 100);
};

export const formatCurrencyFromCents = (val) => {
	if (!val) val = 0;

	if (typeof val === 'string') val = Number(val.replace(/\D/g, ''));

	val /= 100; // value in cents

	return formatCurrency(val);
};

export const parseCurrency = (val) => {
	if (!val) return '';

	return Number(val.replace(/\D/g, '')).toString();
};

export const createCreditCardNumberFormater = (paymentCardBrandPattern, isDebit) => {
	return (val) => {
		if (!val) return '';

		val = val.replace(/\D/g, '');

		if (val.length <= 4) return val;

		// American Express IIN ranges: 34, 37
		// Diners Club International IIN ranges: 300‑305, 309, 36, 38‑39
		// isFourSixPattern = 4-6-4 (Diners) or 4-6-5 (Amex). else is 4-4-4-4
		const cardBrand = identifyCardBrand(paymentCardBrandPattern, val, isDebit);
		const cardRegex = paymentCardBrandPattern[cardBrand];
		const maxLength = cardRegex ? cardRegex.maxLength : DEFAULT_PAYMENT_CARD_MAX_LENGTH;
		const isFourSixPattern = cardBrand == CARD_DINERS || cardBrand === CARD_AMEX;

		if (isFourSixPattern) {
			if (val.length <= 10) return val.replace(/^(\d{4})(\d+)/, '$1 $2');
			return val.slice(0, maxLength).replace(/^(\d{4})(\d{6})(\d+)/, '$1 $2 $3');
		}

		if (val.length <= 8) return val.replace(/^(\d{4})(\d+)/, '$1 $2');

		if (val.length <= 12) return val.replace(/^(\d{4})(\d{4})(\d+)/, '$1 $2 $3');
		return val.slice(0, maxLength).replace(/^(\d{4})(\d{4})(\d{4})(\d+)/, '$1 $2 $3 $4');
	};
};

export const createCreditCardNumberParser = (paymentCardBrandPattern, isDebit) => {
	return (val) => {
		if (!val) return '';

		const cardBrand = identifyCardBrand(paymentCardBrandPattern, val, isDebit);
		const cardRegex = paymentCardBrandPattern[cardBrand];
		const maxLength = cardRegex ? cardRegex.maxLength : DEFAULT_PAYMENT_CARD_MAX_LENGTH;

		return val.replace(/\D/g, '').slice(0, maxLength);
	};
};

export const formatExpirationDate = (val) => {
	if (!val) return '';

	val = val.replace(/\D/g, '');

	if (val.length <= 2) return val;
	return val.slice(0, 6).replace(/^(\d{2})(\d+)/, '$1 / $2');
};

export const parseExpirationDate = (val) => {
	if (!val) return '';

	return val.replace(/\D/g, '');
};

export const formatCieloExpirationDate = (expirationDate) => {
	return `${expirationDate.slice(0, 2)}/20${expirationDate.slice(2)}`;
};

export const extractLastFourDigits = (val) => {
	return val ? val.slice(-4) : '';
};

export const addCardNumberMask = (val) => {
	if (!val) return '';

	if (val.length <= 4) return val;

	const finalDigits = extractLastFourDigits(val);
	const firstDigits = val.slice(0, val.length - 4).replace(/\d/g, '*');

	return `${firstDigits}${finalDigits}`;
};

export const formatCnpj = (val) => {
	if (!val) return '';

	val = val.replace(/\D/g, '');

	if (val.length <= 2) return val.replace(/^(\d+)/, '$1');
	if (val.length <= 5) return val.replace(/^(\d{2})(\d+)/, '$1.$2');
	if (val.length <= 8) return val.replace(/^(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
	if (val.length <= 12) return val.replace(/^(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
	return val.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, '$1.$2.$3/$4-$5');
};

export const formatAlphanumeric = (val) => {
	if (!val) return '';

	return val.replace(/[^\w\sÀ-ÿ]/g, '');
};

export const parseAlphanumeric = (val) => {
	return formatAlphanumeric(val);
};

export const formatNumeric = (val) => {
	if (!val) return '';

	return val.replace(/\D/g, '');
};

export const parseNumeric = (val) => {
	return formatNumeric(val);
};

export const formatAlphabetic = (val) => {
	if (!val) return '';

	return val.replace(/[^a-zA-Z\s]/g, '');
};

export const parseAlphabetic = (val) => {
	return formatAlphabetic(val);
};

export const formatExcludeNumbers = (val) => {
	if (!val) return '';

	return val.replace(/\d/g, '');
};

export const parseExcludeNumbers = (val) => {
	return formatExcludeNumbers(val);
};

export const parseDate = (val) => {
	if (!val) return '';

	return val.replace(/\D/g, '');
};

export const formatDate = (val) => {
	if (!val) return '';

	val = val.replace(/\D/g, '');

	if (val.length <= 2) return val;
	if (val.length <= 4) return val.replace(/^(\d{2})(\d+)/, '$1/$2');
	return val.slice(0, 8).replace(/^(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
};

export const parseTime = (val) => {
	if (!val) return '';

	return val.replace(/\D/g, '');
};

export const formatTime = (val) => {
	if (!val) return '';

	val = val.replace(/\D/g, '');

	if (val.length <= 2) return val;
	return val.slice(0, 6).replace(/^(\d{2})(\d+)/, '$1:$2');
};

export const parseScheduledDay = (val) => {
	if (!val) return '';

	return val.replace(/\D/g, '').slice(0, 2);
};

export const formatScheduledDay = (val) => {
	if (!val) return '';

	return val.toString();
};

export const formatDiscountCode = (val) => {
	if (!val) return '';

	val = val.replace(/[^a-zA-Z\d]/g, '').toUpperCase();

	if (val.length <= 3) return val;
	return val.slice(0, 8).replace(/^(.{4})(.+)/, '$1 $2');
};

export const parseDiscountCode = (val) => {
	if (!val) return '';

	return val.replace(/\s/g, '').toUpperCase();
};

export const formatNumber = (number, fraction) => {
	return pipe(
		() => Number(number),
		(n) => (Number.isNaN(n) ? 0 : n),
		Intl.NumberFormat('pt-br', { maximumFractionDigits: fraction }).format
	)();
};

export const removeAccent = (text) => {
	let newText = text;
	const mapaAcentosHex = {
		a: /[\xE0-\xE6]/g,
		A: /[\xC0-\xC6]/g,
		e: /[\xE8-\xEB]/g,
		E: /[\xC8-\xCB]/g,
		i: /[\xEC-\xEF]/g,
		I: /[\xCC-\xCF]/g,
		o: /[\xF2-\xF6]/g,
		O: /[\xD2-\xD6]/g,
		u: /[\xF9-\xFC]/g,
		U: /[\xD9-\xDC]/g,
		c: /\xE7/g,
		C: /\xC7/g,
		n: /\xF1/g,
		N: /\xD1/g
	};

	for (const letra in mapaAcentosHex) {
		const expressaoRegular = mapaAcentosHex[letra];
		newText = newText.replace(expressaoRegular, letra);
	}

	return newText;
};
