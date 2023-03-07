/* eslint-disable no-undef */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import notificationsReducer, { REMOVE_NOTIFICATION, removeNotification, REMOVE_NOTIFICATION_SUCCESS, REMOVE_NOTIFICATION_FAILURE, removeNotificationSuccess, removeNotificationFailure, fetchRemoveNotification, initialState } from '../../src/redux/notifications';
import { mockFetch } from '../../src/test-utils/fetch-helper';

// Initialize Redux Store
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({ 
  notifications: initialState
});

describe('Notifications Actions', () => {

  afterEach(() => {
    store.clearActions();
  });

  it('creates remove notification action correctly', () => {
    const expectedRemoveAction =  { type: REMOVE_NOTIFICATION };
    expect(expectedRemoveAction).toEqual(removeNotification());
  });

  it('creates remove notification success action correctly', () => {
    const notificationId = 123;
    const expectedSuccessAction =  { type: REMOVE_NOTIFICATION_SUCCESS, id: notificationId };
    expect(expectedSuccessAction).toEqual(removeNotificationSuccess(notificationId));
  });

  it('creates remove notification failure action correctly', () => {
    const mockErrorMessage = 'Test error';
    const expectedFailureAction =  { type: REMOVE_NOTIFICATION_FAILURE, error: mockErrorMessage };
    expect(expectedFailureAction).toEqual(removeNotificationFailure(mockErrorMessage));
  });

  // it('dispatches the correct actions if fetchRemoveNotification action thunk succeeded', async () => {
  //   const notificationId = 123;
  //   global.fetch = mockFetch(true, {});
  //   const expectedActions = [
  //     REMOVE_NOTIFICATION,
  //     REMOVE_NOTIFICATION_SUCCESS
  //   ];

  //   await store.dispatch(fetchRemoveNotification(notificationId));

  //   const actualActions = store.getActions().map(action => action.type);
  //   expect(expectedActions).toEqual(actualActions);

  //   const successAction = store.getActions().find(action => action.type === REMOVE_NOTIFICATION_SUCCESS);
  //   expect(successAction.id).toEqual(notificationId);
  // });

  // it('dispatches the correct actions if fetchRemoveNotification action thunk failed', async done => {
  //   const notificationId = 123;
  //   const mockErrorMessage = 'Test error';
  //   global.fetch = mockFetch(false, { returnMessage: mockErrorMessage });
  //   const expectedActions = [
  //     REMOVE_NOTIFICATION,
  //     REMOVE_NOTIFICATION_FAILURE
  //   ];

  //   try {
  //     await store.dispatch(fetchRemoveNotification(notificationId));
  //     done.fail();
  //   } catch (error) {
  //     const actualActions = store.getActions().map(action => action.type);
  //     expect(expectedActions).toEqual(actualActions);

  //     const failureAction = store.getActions().find(action => action.type === REMOVE_NOTIFICATION_FAILURE);
  //     expect(failureAction.error).toEqual(mockErrorMessage);
  //   }

  //   done();
  // });

});

describe('Notifications Reducer', () => {

  it('returns the correct state on remove notification action', () => {
    const expectedState = {
      ...initialState,
      remove: {
        ...initialState.remove,
        isFetching: true,
        error: '',
      }
    };
    const newState = notificationsReducer(initialState, removeNotification());
    expect(expectedState).toEqual(newState);
  });

  it('returns the correct state on remove notification failure action', () => {
    const mockErrorMessage = 'Test error';
    const expectedState = {
      ...initialState,
      remove: {
        ...initialState.remove,
        isFetching: false,
        error: mockErrorMessage,
      }
    };
    const newState = notificationsReducer(initialState, removeNotificationFailure(mockErrorMessage));
    expect(expectedState).toEqual(newState);
  });

  it('returns the correct state on remove notification success action', () => {
    const notificationId = 123;
    const mockNotification = { id: notificationId };
    const mockInitialState = {
      ...initialState,
      remove: {
        ...initialState.remove,
        isFetching: true,
        error: '',
      },
      notificationList: {
        ...initialState.notificationList,
        data: [mockNotification]
      }
    };
    const expectedState = {
      ...initialState,
      remove: {
        ...initialState.remove,
        isFetching: false,
        error: '',
      },
      notificationList: {
        ...initialState.notificationList,
        data: []
      }
    };
    const newState = notificationsReducer(mockInitialState, removeNotificationSuccess(notificationId));
    expect(expectedState).toEqual(newState);
  });

});