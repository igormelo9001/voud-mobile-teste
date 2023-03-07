// NPM imports
import { Linking } from 'react-native';

/**
 * Opens URL after checking for device support
 */
export function openUrl(url) {
  return new Promise((resolve, reject) => {
    Linking.openURL(url)
      .then(() => {
        resolve();
      })
      .catch(err => {
        if (__DEV__) console.tron.log('An error occurred: ' + err.message, true);
        reject(err);
      });
    });
}