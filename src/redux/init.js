/* eslint-disable func-names */
/* eslint-disable prettier/prettier */
// VouD imports
import { GASetUser } from '../shared/analytics';
import { saveItem, multiGet, removeItem, multiRemove } from '../utils/async-storage';
import { isEmulator } from '../utils/device-info';

// Actions

const HYDRATE = 'voud/init/HYDRATE';

export const initActions = {
  HYDRATE,
};

// Consts

export const asyncStorageKeys = {
  profileData: 'profileData',
  onboardingViewed: 'onboardingViewed',
  transportCardList: 'transportCardList',
  currentTransportCardId: 'currentTransportCardId',
  servicePointView: 'servicePointView',
  isServiceMenuCollapsed: 'isServiceMenuCollapsed',
  currentPosition: 'currentPosition',
  serviceMenuType: 'serviceMenuType',
  scooterData: 'scooterData',
  scooterToken: 'scooterToken',
  requestCardFirstMeans: 'requestCardFirstMeans',
  scooterAcceptUsageTerms: 'scooterAcceptUsageTerms',
};

// Reducer

const initialState = false;

function reducer(state = initialState, action) {
  return action.type === HYDRATE ? true : state;
}

export default reducer;

// Actions creators

function hydrate(data, shouldShowOnboarding) {
  return {
    type: HYDRATE,
    data,
    shouldShowOnboarding,
  };
}

// Thunk actions creators

export function hydrateFromAsyncStorage() {
  return async function(dispatch) {
    const keys = [
      asyncStorageKeys.profileData,
      asyncStorageKeys.onboardingViewed,
      asyncStorageKeys.transportCardList,
      asyncStorageKeys.currentTransportCardId,
      asyncStorageKeys.servicePointView,
      asyncStorageKeys.isServiceMenuCollapsed,
      asyncStorageKeys.currentPosition,
      asyncStorageKeys.serviceMenuType,
      asyncStorageKeys.scooterData,
    ];

    try {
      const isEmulatorDetected = isEmulator();

      const asyncStore = await multiGet(keys);
      const profileData = asyncStore.profileData ? JSON.parse(asyncStore.profileData) : null;
      const transportCardList = asyncStore.transportCardList
        ? JSON.parse(asyncStore.transportCardList)
        : [];
      const currentTransportCardId = asyncStore.currentTransportCardId
        ? +asyncStore.currentTransportCardId
        : 0;
      const isServiceMenuCollapsed = !!(
        asyncStore.isServiceMenuCollapsed && asyncStore.isServiceMenuCollapsed === 'true'
      );
      const serviceMenuType = asyncStore.serviceMenuType ? asyncStore.serviceMenuType : 'card';
      const shouldShowOnboarding = isEmulatorDetected
        ? false
        : asyncStore.onboardingViewed
        ? false
        : !asyncStore.onboardingViewed;
      const currentPosition = asyncStore.currentPosition
        ? JSON.parse(asyncStore.currentPosition)
        : null;
      const scooterData = asyncStore.scooterData ? JSON.parse(asyncStore.scooterData) : null;

      const hydrateData = {
        ...asyncStore,
        profileData,
        transportCardList,
        currentTransportCardId,
        isServiceMenuCollapsed,
        serviceMenuType,
        currentPosition,
        scooterData,
      };

      dispatch(hydrate(hydrateData, shouldShowOnboarding));

      // Set GA User-ID
      const userId = profileData && profileData.id ? profileData.id.toString() : null;
      if (__DEV__) console.tron.log(`GA - setUser - id: ${userId}`);
      if (userId) GASetUser(userId);

      return hydrateData;
    } catch (error) {
      if (__DEV__) {
        console.tron.log('asyncHydrateInit error', true);
        console.tron.log(error.message);
      }

      dispatch(hydrate({}));

      throw new Error(error.message);
    }
  };
}

// Utility functions

export function persistData(key, data) {
  (async () => {
    try {
      saveItem(key, data);
    } catch (error) {
      if (__DEV__) {
        console.tron.log('persistData error', true);
        console.tron.log(error.message);
      }
    }
  })();
}

export function clearData(key) {
  (async () => {
    try {
      if (Array.isArray(key)) multiRemove(key);
      else removeItem(key);
    } catch (error) {
      if (__DEV__) {
        console.tron.log('clearProfileStorage error', true);
        console.tron.log(error.message);
      }
    }
  })();
}

// DEV util

export function clearAsyncStorage() {
  const keys = Array.from(asyncStorageKeys, (v, k) => k);

  if (__DEV__) multiRemove(keys);
}
