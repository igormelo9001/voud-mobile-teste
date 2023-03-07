// NPM imports
import Moment from "moment";

// VouD imports
import { formatCurrencyFromCents } from "./parsers-formaters";
import { isSupportedTransportCard } from "../redux/transport-card";
import { identifyCardBrand } from "./payment-card";

// Validators
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 50;

export const required = value => (value ? undefined : "Campo obrigatório");

export const minPasswordLength = value =>
  value && value.length < MIN_PASSWORD_LENGTH
    ? `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres`
    : undefined;

export const maxPasswordLength = value =>
  value && value.length > MAX_PASSWORD_LENGTH
    ? `A senha deve ter no máximo ${MAX_PASSWORD_LENGTH} caracteres`
    : undefined;

const exactLength = len => value =>
  value && value.length !== len
    ? `O campo deve ter exatamente ${len} caracteres`
    : undefined;
export const exactLength3 = exactLength(3);

export const confirmPassword = (value, allValues) =>
  allValues && value === allValues.password
    ? undefined
    : "As senhas digitadas não são as mesmas";
export const confirmNewPassword = (value, allValues) =>
  allValues && value === allValues.newPassword
    ? undefined
    : "As senhas digitadas não são as mesmas";

export const cpfValidator = value => {
  const errorMessage = "CPF inválido";

  // return valid if empty
  if (!value) return undefined;

  // remove non-digits from CPF
  const cpf = value.replace(/\D/g, "");

  if (
    cpf.length != 11 ||
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999"
  )
    return errorMessage;

  let add = 0,
    rev;

  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);

  rev = 11 - (add % 11);

  if (rev == 10 || rev == 11) rev = 0;

  if (rev != parseInt(cpf.charAt(9))) return errorMessage;

  add = 0;
  for (let j = 0; j < 10; j++) add += parseInt(cpf.charAt(j)) * (11 - j);

  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) rev = 0;

  if (rev != parseInt(cpf.charAt(10))) return errorMessage;

  return undefined;
};

export const emailValidator = value => {
  // return valid if empty
  if (!value) return undefined;

  // test e-mail with regex
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value) ? undefined : "E-mail inválido";
};

export const mobileValidator = value => {
  // return valid if empty
  if (!value) return undefined;

  // remove non-digits from mobile
  const mobile = value.replace(/\D/g, "");

  // TODO: consider country code (eg. +55), consider international patterns
  if (mobile.length == 10 || mobile.length == 11) return undefined;

  return "Celular inválido";
};

export const cepValidator = value => {
  // return valid if empty
  if (!value) return undefined;

  // remove non-digits from cep
  const cep = value.replace(/\D/g, "");

  if (cep.length == 8) return undefined;

  return "CEP inválido";
};

export const createRangeCreditValueValidator = (minValue, maxValue) => {
  return value => {
    if (!value) return undefined;

    const valueAsInt = Number(value);
    let messageValue;

    if (valueAsInt < minValue) {
      messageValue = `Insira um valor de crédito de no mínimo R$ ${formatCurrencyFromCents(
        minValue
      )}`;
    }

    if (valueAsInt > maxValue) {
      messageValue = `Insira um valor de crédito de no máximo R$ ${formatCurrencyFromCents(
        maxValue
      )}`;
    }

    // return valueAsInt >= minValue && valueAsInt <= maxValue ?
    //     undefined :
    //     `Insira um valor de crédito de no mínimo R$ ${formatCurrencyFromCents(minValue)}`;

    return messageValue;
  };
};

const isValidDateFormat = format => value =>
  format.length !== value.length ? false : Moment(value, format).isValid();

export const creditCardExpirationDateValidator = value => {
  const errorMessage = "Data inválida";
  if (!value) return errorMessage;

  const isValidFormat = isValidDateFormat("MMYY")(value);

  if (!isValidFormat) return errorMessage;

  return Moment(value, "MMYY").isAfter()
    ? undefined
    : `Informe uma data acima de ${Moment().format("MM/YY")}`;
};

export const createDateValidator = format => {
  return value => {
    if (!value) return undefined;
    return isValidDateFormat(format)(value) ? undefined : "Formato inválido";
  };
};

export const createLast30DaysValidator = format => {
  return value => {
    if (!value) return undefined;

    if (!isValidDateFormat(format)(value)) return "Formato inválido";

    const valueMoment = Moment(value, format);
    const today = Moment();
    const startDate = Moment().subtract(30, "days");

    if (valueMoment.isAfter(today)) return "A data não pode ser futura";

    if (valueMoment.isBefore(startDate))
      return "Informe uma data dos últimos 30 dias";

    return undefined;
  };
};

export const createNoFutureHourValidator = () => {
  return (value, allValues) => {
    if (!value) return undefined;

    if (!allValues.occurrenceDate) return undefined;

    const valueMoment = Moment(value, "HHmm");
    const todayMoment = Moment();

    if (
      Moment(allValues.occurrenceDate, "DDMMYYYY").isSame(todayMoment, "day") &&
      valueMoment.isAfter(todayMoment)
    ) {
      return "O horário não pode ser futuro";
    }

    return undefined;
  };
};

export const createBirthDateValidator = format => {
  return value => {
    if (!value) return undefined;

    if (!isValidDateFormat(format)(value)) return "Formato inválido";

    const valueMoment = Moment(value, format);
    const today = Moment();
    const startDate = Moment().subtract(120, "year");

    if (valueMoment.isAfter(today)) return "A data não pode ser futura";

    if (valueMoment.isBefore(startDate))
      return "Informe uma data dos últimos 120 anos";

    return undefined;
  };
};

export const bomCardNumberValidator = value => {
  // return valid if empty
  if (!value) return undefined;

  // remove non-digits from card number
  const number = value.replace(/\D/g, "");

  if (number.length == 13) {
    const cardType = number.slice(2, 4);

    if (!isSupportedTransportCard(cardType)) return "Cartão não suportado";

    return undefined;
  }

  return "Número de cartão inválido";
};

export const legalCardNumberValidator = value => {
  // return valid if empty
  if (!value) return undefined;

  // remove non-digits from card number
  const number = value.replace(/\D/g, "");

  if (number.length == 13) {
    const cardType = number.slice(0, 2);

    if (!isSupportedTransportCard(cardType)) return "Cartão não suportado";

    return undefined;
  }

  return "Número de cartão inválido";
};

export const creditCardNumberValidator = value => {
  const errorMessage = "Número de cartão inválido";

  if (!value) return errorMessage;

  // Luhn Algorithm implementation
  const number = value.replace(/\D/g, "");

  if (number.length < 14 || number.length > 16) return errorMessage;

  const sum = number
    .split("")
    .reverse()
    .map((numStr, i) => {
      const num = i % 2 === 0 ? parseInt(numStr, 10) : 2 * parseInt(numStr, 10);
      return num > 9 ? num - 9 : num;
    })
    .reduce((acc, n) => acc + n, 0);

  return sum % 10 === 0 ? undefined : errorMessage;
};

export const scheduledDayValidator = value => {
  // return valid if empty
  if (!value) return undefined;

  const valueAsInt = Number(value);
  return valueAsInt > 0 && valueAsInt <= 31
    ? undefined
    : "Informe um dia entre 1 e 31";
};

export const createCardBrandValidator = (paymentCardBrandPattern, isDebit) => {
  return value => {
    // return valid if empty
    if (!value) return undefined;

    const cardBrand = identifyCardBrand(
      paymentCardBrandPattern,
      value,
      isDebit
    );
    return cardBrand === "" ? "Bandeira não suportada" : undefined;
  };
};
