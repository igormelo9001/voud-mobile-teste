import Moment from 'moment';

import { 
  required,
  minPasswordLength,
  maxPasswordLength,
  exactLength3,
  confirmPassword,
  confirmNewPassword,
  cpfValidator,
  emailValidator,
  mobileValidator,
  cepValidator,
  createRangeCreditValueValidator,
  creditCardExpirationDateValidator,
  createDateValidator,
  createLast30DaysValidator,
  bomCardNumberValidator,
  creditCardNumberValidator,
  scheduledDayValidator
} from "../validators";

import { formatCurrencyFromCents } from "../parsers-formaters";

describe('Validators util', () => {
  testEmptyValue = (fn, result) => {
    expect(fn()).toBe(result);
    expect(fn(null)).toBe(result);
    expect(fn(undefined)).toBe(result);
    expect(fn('')).toBe(result);
  }

  // required
  describe('required function', () => {
    it('when value is empty', () => {
      const validationMessage = 'Campo obrigatório';
      testEmptyValue(required, validationMessage);
    });
    it('when value isn\'t empty', () => {
      expect(required('foo')).toBe(undefined);
      expect(required('1')).toBe(undefined);
      expect(required(1)).toBe(undefined);
    });
  });

  // minPasswordLength
  describe('minPasswordLength function', () => {
    it('when value is empty', () => {
      testEmptyValue(minPasswordLength, undefined);
    });
    it('when password length is below minimum', () => {
      const validationMessage = 'A senha deve ter no mínimo 6 caracteres';
      expect(minPasswordLength('1')).toBe(validationMessage);
      expect(minPasswordLength('12345')).toBe(validationMessage);
    });
    it('when password length is above minimum', () => {
      expect(minPasswordLength('123456')).toBe(undefined);
      expect(minPasswordLength('1234567')).toBe(undefined);
    });
  });

  // maxPasswordLength
  describe('maxPasswordLength function', () => {
    it('when value is empty', () => {
      testEmptyValue(maxPasswordLength, undefined);
    });
    it('when password length is below maximum', () => {
      expect(maxPasswordLength('1')).toBe(undefined);
      expect(maxPasswordLength('12345678901234567890123456789012345678901234567890')).toBe(undefined);
    });
    it('when password length is above maximum', () => {
      const validationMessage = 'A senha deve ter no máximo 50 caracteres';
      expect(maxPasswordLength('123456789012345678901234567890123456789012345678901')).toBe(validationMessage);
      expect(maxPasswordLength('1234567890123456789012345678901234567890123456789012')).toBe(validationMessage);
    });
  });

  // exactLength3
  describe('exactLength3 function', () => {
    it('when value is empty', () => {
      testEmptyValue(exactLength3, undefined);
    });
    it('when value length not equal to 3', () => {
      const validationMessage = 'O campo deve ter exatamente 3 caracteres';
      expect(exactLength3('1')).toBe(validationMessage);
      expect(exactLength3('12')).toBe(validationMessage);
      expect(exactLength3('1234')).toBe(validationMessage);
      expect(exactLength3('12345')).toBe(validationMessage);
    });
    it('when value length is above 3', () => {
      expect(exactLength3('123')).toBe(undefined);
    });
  });

  // confirmPassword
  describe('confirmPassword function', () => {
    const validationMessage = 'As senhas digitadas não são as mesmas';

    it('when value is empty', () => {
      testEmptyValue(confirmPassword, validationMessage);
    });
    it('when passwords are not equal', () => {
      expect(confirmPassword('foo1', { password: 'foo2'})).toBe(validationMessage);
    });
    it('when passwords are equal', () => {
      expect(confirmPassword('foo1', { password: 'foo1'})).toBe(undefined);
    });
  });

  // confirmNewPassword
  describe('confirmNewPassword function', () => {
    const validationMessage = 'As senhas digitadas não são as mesmas';

    it('when value is empty', () => {
      testEmptyValue(confirmNewPassword, validationMessage);
    });
    it('when passwords are not equal', () => {
      const validationMessage = 'As senhas digitadas não são as mesmas';
      expect(confirmNewPassword('foo1', { newPassword: 'foo2' })).toBe(validationMessage);
    });
    it('when passwords are equal', () => {
      expect(confirmNewPassword('foo1', { newPassword: 'foo1' })).toBe(undefined);
    });
  });

  // cpfValidator
  describe('cpfValidator function', () => {
    const validationMessage = 'CPF inválido';

    it('when value is empty', () => {
      testEmptyValue(cpfValidator, undefined);
    });
    it('when cpf is invalid', () => {
      expect(cpfValidator('foo')).toBe(validationMessage);
      expect(cpfValidator('12345')).toBe(validationMessage);
      expect(cpfValidator('12345678901')).toBe(validationMessage);
    });
    it('when cpf is valid', () => {
      expect(cpfValidator('46120896503')).toBe(undefined);
      expect(cpfValidator('56452827790')).toBe(undefined);
    });
  });

  // emailValidator
  describe('emailValidator function', () => {
    const validationMessage = 'E-mail inválido';

    it('when value is empty', () => {
      testEmptyValue(emailValidator, undefined);
    });
    it('when e-mail is invalid', () => {
      expect(emailValidator('foo')).toBe(validationMessage);
      expect(emailValidator('123')).toBe(validationMessage);
      expect(emailValidator('foo@')).toBe(validationMessage);
      expect(emailValidator('foo@com')).toBe(validationMessage);
      expect(emailValidator('foo@123')).toBe(validationMessage);
      expect(emailValidator('123@foo')).toBe(validationMessage);
      expect(emailValidator('123@foo')).toBe(validationMessage);
      expect(emailValidator('123@foo.123')).toBe(validationMessage);
      expect(emailValidator('()@foo.com')).toBe(validationMessage);
    });
    it('when e-mail is valid', () => {
      expect(emailValidator('afurtado@wefit.com.br')).toBe(undefined);
      expect(emailValidator('123@wefit.com.br')).toBe(undefined);
    });
  });

  // mobileValidator
  describe('mobileValidator function', () => {
    const validationMessage = 'Celular inválido';

    it('when value is empty', () => {
      testEmptyValue(mobileValidator, undefined);
    });
    it('when mobile is invalid', () => {
      expect(mobileValidator('1')).toBe(validationMessage);
      expect(mobileValidator('11 9123 456')).toBe(validationMessage);
      expect(mobileValidator('11 9123 456789')).toBe(validationMessage);
    });
    it('when mobile is valid', () => {
      expect(mobileValidator('11 9123 4567')).toBe(undefined);
      expect(mobileValidator('11 9123 45678')).toBe(undefined);
    });
  });

  // cepValidator
  describe('cepValidator function', () => {
    const validationMessage = 'CEP inválido';

    it('when value is empty', () => {
      testEmptyValue(cepValidator, undefined);
    });
    it('when cep is invalid', () => {
      expect(cepValidator('1')).toBe(validationMessage);
      expect(cepValidator('12345-67')).toBe(validationMessage);
      expect(cepValidator('12345-6789')).toBe(validationMessage);
    });
    it('when cep is valid', () => {
      expect(cepValidator('12345-678')).toBe(undefined);
    });
  });

  // createRangeCreditValueValidator
  describe('createRangeCreditValueValidator function', () => {
    const minValue = 380;
    const maxValue = 20000;
    const rangeCreditValueValidator = createRangeCreditValueValidator(minValue, maxValue);
    const validationMessage = `Insira um valor de crédito de no mínimo R$ ${formatCurrencyFromCents(minValue)}`;

    it('when value is empty', () => {
      testEmptyValue(rangeCreditValueValidator, undefined);
    });
    it('when creditValue is invalid', () => {
      expect(rangeCreditValueValidator('0')).toBe(validationMessage);
      expect(rangeCreditValueValidator('379')).toBe(validationMessage);
      expect(rangeCreditValueValidator('20001')).toBe(validationMessage);
    });
    it('when creditValue is valid', () => {
      expect(rangeCreditValueValidator('380')).toBe(undefined);
      expect(rangeCreditValueValidator('10000')).toBe(undefined);
      expect(rangeCreditValueValidator('20000')).toBe(undefined);
    });
  });

  // creditCardExpirationDateValidator
  describe('creditCardExpirationDateValidator function', () => {
    const validationMessage = 'Data inválida';
    const pastDateMessage = `Informe uma data acima de ${Moment().format('MM/YY')}`;

    it('when value is empty', () => {
      testEmptyValue(creditCardExpirationDateValidator, validationMessage);
    });
    it('when card expiration date is invalid', () => {
      expect(creditCardExpirationDateValidator('0')).toBe(validationMessage);
      expect(creditCardExpirationDateValidator('0000')).toBe(validationMessage);
      expect(creditCardExpirationDateValidator('1300')).toBe(validationMessage);
      expect(creditCardExpirationDateValidator('1200')).toBe(pastDateMessage);
    });
    it('when card expiration date is valid', () => {
      expect(creditCardExpirationDateValidator('1268')).toBe(undefined);
    });
  });

  // createDateValidator
  describe('createDateValidator function', () => {
    const validationMessage = 'Formato inválido';
    const dateValidator = createDateValidator('HHmm');

    it('when value is empty', () => {
      testEmptyValue(dateValidator, undefined);
    });
    it('when date is invalid', () => {
      expect(dateValidator('0')).toBe(validationMessage);
      expect(dateValidator('2500')).toBe(validationMessage);
      expect(dateValidator('0060')).toBe(validationMessage);
      expect(dateValidator('2560')).toBe(validationMessage);
    });
    it('when date is valid', () => {
      expect(dateValidator('0000')).toBe(undefined);
      expect(dateValidator('1200')).toBe(undefined);
      expect(dateValidator('1259')).toBe(undefined);
    });
  });

  // createLast30DaysValidator
  describe('createLast30DaysValidator function', () => {
    const validationMessage = 'Formato inválido';
    const futureDateMessage = 'A data não pode ser futura';
    const last30DaysMessage = 'Informe uma data dos últimos 30 dias';
    const last30DaysValidator = createLast30DaysValidator('DDMMYYYY');

    it('when value is empty', () => {
      testEmptyValue(last30DaysValidator, undefined);
    });
    it('when date is invalid', () => {
      expect(last30DaysValidator('0')).toBe(validationMessage);
      expect(last30DaysValidator('32000000')).toBe(validationMessage);
      expect(last30DaysValidator('01130000')).toBe(validationMessage);
      expect(last30DaysValidator('01012018')).toBe(last30DaysMessage);
      expect(last30DaysValidator('01122059')).toBe(futureDateMessage);
    });
    it('when date is valid', () => {
      expect(last30DaysValidator(Moment().subtract(1, 'days').format('DDMMYYYY'))).toBe(undefined);
      expect(last30DaysValidator(Moment().subtract(29, 'days').format('DDMMYYYY'))).toBe(undefined);
    });
  });

  // bomCardNumberValidator
  describe('bomCardNumberValidator function', () => {
    const validationMessage = 'Número de cartão inválido';
    const notSupportedMessage = 'Cartão não suportado';

    it('when value is empty', () => {
      testEmptyValue(bomCardNumberValidator, undefined);
    });
    it('when BOM card number is invalid', () => {
      expect(bomCardNumberValidator('1')).toBe(validationMessage);
      expect(bomCardNumberValidator('12345678901234')).toBe(validationMessage);
      expect(bomCardNumberValidator('0000000000000')).toBe(notSupportedMessage);
      expect(bomCardNumberValidator('0001000000000')).toBe(notSupportedMessage);
    });
    it('when BOM card number is valid', () => {
      expect(bomCardNumberValidator('0004000000000')).toBe(undefined);
      expect(bomCardNumberValidator('0017000000000')).toBe(undefined);
      expect(bomCardNumberValidator('0003000000000')).toBe(undefined);
      expect(bomCardNumberValidator('0006000000000')).toBe(undefined);
      expect(bomCardNumberValidator('0007000000000')).toBe(undefined);
      expect(bomCardNumberValidator('0019000000000')).toBe(undefined);
      expect(bomCardNumberValidator('0008000000000')).toBe(undefined);
      expect(bomCardNumberValidator('0020000000000')).toBe(undefined);
    });
  });

  // creditCardNumberValidator
  describe('creditCardNumberValidator function', () => {
    const validationMessage = 'Número de cartão inválido';

    it('when value is empty', () => {
      testEmptyValue(creditCardNumberValidator, validationMessage);
    });
    it('when credit card number is invalid', () => {
      expect(creditCardNumberValidator('1')).toBe(validationMessage);
      expect(creditCardNumberValidator('12345678901234567')).toBe(validationMessage);
      expect(creditCardNumberValidator('4024007184280980')).toBe(validationMessage);
    });
    it('when credit card number is valid', () => {
      expect(creditCardNumberValidator('4024007184280989')).toBe(undefined);
      expect(creditCardNumberValidator('5378295079679949')).toBe(undefined);
      expect(creditCardNumberValidator('4514162387424913')).toBe(undefined);
      expect(creditCardNumberValidator('30281114359680')).toBe(undefined);
      expect(creditCardNumberValidator('5067232501908303')).toBe(undefined);
    });
  });

  // scheduledDayValidator
  describe('scheduledDayValidator function', () => {
    const validationMessage = 'Informe um dia entre 1 e 31';

    it('when value is empty', () => {
      testEmptyValue(scheduledDayValidator, undefined);
    });
    it('when scheduled day is invalid', () => {
      expect(scheduledDayValidator('0')).toBe(validationMessage);
      expect(scheduledDayValidator('32')).toBe(validationMessage);
    });
    it('when scheduled day is valid', () => {
      expect(scheduledDayValidator('1')).toBe(undefined);
      expect(scheduledDayValidator('31')).toBe(undefined);
    });
  });

});