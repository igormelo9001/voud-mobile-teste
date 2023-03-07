// NPM imports
import { Alert } from 'react-native';

// VouD imports
import { SessionExpiredError, UnsupportedVersionError, ServiceUnavailableError } from './custom-errors';
import { logout, setSessionExpired } from '../redux/login';
import { routeNames } from './route-names';
import { waitAndNavigateToRoute } from '../redux/nav';
import { updateAPIStatus } from '../redux/api-status';

/**
 * @return {boolean} if error was handled
 */
export const requestErrorHandler = (dispatch, error, defaultAction) => {

  const _dismissSessionExpiredAlert = () => {
    dispatch(logout());
  }

  dispatch(defaultAction);

  if (error && error.name === SessionExpiredError.getName()) {
    dispatch(setSessionExpired()).then(
      hasSessionAlreadyExpired => {
        if (!hasSessionAlreadyExpired) {
          Alert.alert(
            'Sessão expirada',
            'Sua sessão expirou. Por favor, faça o login novamente.',
            [
              {
                text: 'OK',
                onPress: _dismissSessionExpiredAlert
              }
            ],
            {
              onDismiss: _dismissSessionExpiredAlert
            }
          );
        }
      }
    );
    return true;
  }

  if (error && error.name === UnsupportedVersionError.getName()) {
    dispatch(waitAndNavigateToRoute(routeNames.UNSUPPORTED_VERSION_DIALOG));
    return true;
  }

  if (error && error.name === ServiceUnavailableError.getName()) {
    dispatch(updateAPIStatus(false, error.messageTitle, error.message));
    dispatch(waitAndNavigateToRoute(routeNames.SERVICE_UNAVAILABLE));
    return true;
  }

  return false;
};
