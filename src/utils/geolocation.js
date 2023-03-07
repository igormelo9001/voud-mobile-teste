import { Platform, PermissionsAndroid, Alert } from 'react-native';

// utils

export const getDefaultRequestPositionConfig = enableHighAccuracy => (
  { enableHighAccuracy, timeout: enableHighAccuracy ? 5000 : 20000, maximumAge: 10000 }
);

export const checkAndroidLocationPermission = async () => {
  if (Platform.Version > 22) {
    const grantedLocation = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return grantedLocation === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

/**
 * returns current position
 * @return {Object} object with latitude and longitude
 */
export const getCurrentPosition = (config, shouldRetry = false, retryConfig) => {
  return new Promise(async (resolve, reject) => {

    // Note - we check permission before calling getCurrentPosition because an issue on Android.
    // See - https://github.com/appswefit/autopass-voud/issues/37
    if (Platform.OS === 'android') {
      try {
        const hasPermission = await checkAndroidLocationPermission();
        if (!hasPermission) {
          reject();
          return;
        }
      } catch (error) {
        if (__DEV__) console.tron.log(error, true);
        reject(error);
        return;
      }
    }

    requestCurrentPosition(config, shouldRetry, retryConfig, { resolve, reject });
  });
}

const requestCurrentPosition = (config, shouldRetry = false, retryConfig, promise) => {
  navigator.geolocation.getCurrentPosition(
    position => {
      const { coords } = position;
      
      if (__DEV__) {
        console.tron.log("Position: " + JSON.stringify({
          ...coords,
          isHighAccuracy: config ? config.enableHighAccuracy : false
        }));
      }

      promise.resolve(coords);
    },
    error => {
      if (__DEV__) {
        console.tron.log(error, true);
        console.tron.log(JSON.stringify(config), true);
      }

      if (shouldRetry) {
        requestCurrentPosition(retryConfig, false, null, promise);
      } else {
        promise.reject(error);
      }
    },
    config
  );
}

export const showLocationWithoutPermissionAlert = () => {
  Alert.alert(
    'Não conseguimos identificar a sua localização',
    'Para utilizar este recurso, verifique se o serviço de geolocalização está ativado e se o VouD tem permissão para acessá-lo.',
    [
      {
        text: 'OK',
        onPress: () => {},
      }
    ],
    {
      onDismiss: () => {},
    }
  );
};
