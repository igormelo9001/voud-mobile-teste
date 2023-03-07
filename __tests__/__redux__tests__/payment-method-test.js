/* eslint-disable no-undef */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import paymentMethodReducer, { fetchSavePaymentMethod, SAVE, SAVE_SUCCESS, SAVE_FAILURE, initialState, save, saveFailure, saveSuccess } from '../../src/redux/payment-method';
import { mockFetch } from '../../src/test-utils/fetch-helper';

// Initialize Redux Store
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  config: {
    content: [{
      id: 123,
      type: 'ENCRYPTION_CONFIG',
      name: 'Encryption configuration',
      items: {
        ADYEN_PK: '10001|CA3EB59ADEA32A26D5B8F8B0C10BC1D1A1965BFFF13EF427C3E86823D3842F289135914A67F3D3C59CE6D469B0F6C90FB0DDF7795803E48E1038F486F214EFE1E242E9CC000BD3412292D164A95ACB4B54F8F1A00CB4B9D9CEEBB5093DE65121D478A36385077DCE0238A43D120A13E5131DDE93E7A2DE09114235BC5133FABA38ACA378B249A37D0D0AF443ABA25CF31EF6B03C0B00D7C3E401BAA02265B09B5E4624945488CB6E3CA00348F18604CB26691882B98C07687A0749741533521AFA0C96BA07DC5E4B4B66A375D282F5E4D7E3B66C4F25860C2C02176446581D392A4495863A09DF2D96C3EE6805A9CF697006CD47B38B9AE526D3EAFBEFC4D907',
        CIELO_PK: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8iZK1yQQk5dIlQrzBxK1QpuE8fRpP7v4cruJk8OyQ9ezsgtj5LT0Rwpt7U4jHPjwpjbxCK2HhJrnKQrcUL3u0cbeKXVzRspyUk5HNfZ/G8NFX+cfLsE5jPX3dJl6OqWKTinuW15MsVQiUweo0RTixwYcBZNlcMDeYcaNsEFfZpZqXLF2Ve+zU23xjhJqGPh6xhhaErJumaqyRiQMG9qTraAwSi3o59GhbC+HgIczYoxNuTYjMmBit1g3MbeFFBhsltA6t0Pglk/isu7NefiWsP6K5/HdPxIR7NQgG6up/qo0uHZ0cF0XLxjRSVyFjQvXI0WnaM16pZKeIqtlo5PrFwIDAQAB'
      }
    }]
  }
});

describe('Payment Method Actions', () => {

  const mockPaymentData = {
    name: 'Visa final 1111',
    creditCardNumber: '4111111111111111',
    creditCardBrand: 'visa',
    creditCardExpirationDate: '1220',
    creditCardSecurityCode: '123',
    cardHolder: 'teste',
    saveCreditCard: true
  };

  afterEach(() => {
    store.clearActions();
  });

  it('creates save action correctly', () => {
    const expectedSaveAction =  { type: SAVE };
    expect(expectedSaveAction).toEqual(save());
  });

  it('creates save success action correctly', () => {
    const mockResponse = {};
    const expectedSuccessAction =  { type: SAVE_SUCCESS, response: mockResponse };
    expect(expectedSuccessAction).toEqual(saveSuccess({}));
  });

  it('creates save failure action correctly', () => {
    const mockErrorMessage = 'Test error';
    const expectedFailureAction =  { type: SAVE_FAILURE, error: mockErrorMessage };
    expect(expectedFailureAction).toEqual(saveFailure(mockErrorMessage));
  });

  // it('dispatches the correct actions on savePaymentMethod action thunk success', async () => {
  //   const mockResponse = {};
  //   global.fetch = mockFetch(true, mockResponse);
  //   const expectedActions = [
  //     SAVE,
  //     SAVE_SUCCESS
  //   ];

  //   await store.dispatch(fetchSavePaymentMethod(mockPaymentData));

  //   const actualActions = store.getActions().map(action => action.type);
  //   expect(expectedActions).toEqual(actualActions);

  //   const successAction = store.getActions().find(action => action.type === SAVE_SUCCESS);
  //   expect(successAction.response).toEqual(mockResponse);
  // });

  it('dispatches the correct actions on savePaymentMethod action thunk failure', async done => {
    global.fetch = mockFetch(false, {});
    const expectedActions = [
      SAVE,
      SAVE_FAILURE
    ];

    try {
      await store.dispatch(fetchSavePaymentMethod(mockPaymentData));
      done.fail();
    } catch (error) {
      const actualActions = store.getActions().map(action => action.type);
      expect(expectedActions).toEqual(actualActions);
    }

    done();
  });

});

describe('Payment Method Reducer', () => {

  it('returns the correct state on save action', () => {
    const expectedState = {
      ...initialState,
      save: {
        ...initialState.save,
        isFetching: true,
        error: '',
      }
    };
    const newState = paymentMethodReducer(initialState, save());
    expect(expectedState).toEqual(newState);
  });

  it('returns the correct state on save failure action', () => {
    const mockErrorMessage = 'Test error';
    const expectedState = {
      ...initialState,
      save: {
        ...initialState.save,
        isFetching: false,
        error: mockErrorMessage,
      }
    };
    const newState = paymentMethodReducer(initialState, saveFailure(mockErrorMessage));
    expect(expectedState).toEqual(newState);
  });

  it('returns the correct state on save success action', () => {
    const paymentMethodId = 123;
    const mockSaveResponse = {
      returnCode: 0,
      returnMessage: 'Successful Response',
      payload: {
        id: paymentMethodId,
        customerId: 321,
        type: 'CardToken',
        name: 'Visa final 1111',
        items: [
          {
            id: 1,
            key: 'cardHolder',
            value: 'teste'
          },
          {
            id: 2,
            key: 'finalDigits',
            value: 1111
          },
          {
            id: 3,
            key: 'cardFlag',
            value: 'visa'
          },
          {
            id: 4,
            key: 'cardToken',
            value: '7e50c26b-3e57-417c-a9bf-4e48abcc5247'
          },
          {
            id: 5,
            key: 'expirationDate',
            value: '12/2020'
          }
        ]
      }
    };
    const expectedState = {
      ...initialState,
      saved: {
        ...initialState.saved,
        selected: paymentMethodId,
        data: [
          {
            id: paymentMethodId,
            customerId: 321,
            type: 'CardToken',
            name: 'Visa final 1111',
            items: {
              cardHolder: 'teste',
              finalDigits: 1111,
              cardFlag: 'visa',
              cardToken: '7e50c26b-3e57-417c-a9bf-4e48abcc5247',
              expirationDate: '12/2020'
            }
          }
        ]
      }
    };
    const newState = paymentMethodReducer(initialState, saveSuccess(mockSaveResponse));
    expect(expectedState).toEqual(newState);
  });

});