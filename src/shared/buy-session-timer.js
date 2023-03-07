// NPM imports
import { Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';

// VouD imports
import { backToHome } from '../redux/nav';

const BUY_SESSION_TIMEOUT = 30 * 60 * 1000; // 30 min
let buySessionTimer = null;

const _backToHome = dispatch => {
  dispatch(backToHome());
}

const showBuySessionTimeoutAlert = (dispatch, isSmartPurchaseFlow, timeoutHandler) => {
  Alert.alert(
    'Sessão expirada',
    `Sua sessão de ${isSmartPurchaseFlow ? 'compra programada' : 'compra'} expirou. Por favor, inicie a compra novamente.`,
    [
      {
        text: 'OK',
        onPress: () => timeoutHandler ? timeoutHandler() : _backToHome(dispatch)
      },
    ],
    {
      onDismiss: () => timeoutHandler ? timeoutHandler() : _backToHome(dispatch)
    }
  );
}

export const startBuySessionTimer = (dispatch, isSmartPurchaseFlow, timeoutHandler) => {
  stopBuySessionTimer();
  buySessionTimer = setTimeout(() => showBuySessionTimeoutAlert(dispatch, isSmartPurchaseFlow, timeoutHandler), BUY_SESSION_TIMEOUT);
}

export const stopBuySessionTimer = () => {
  clearInterval(buySessionTimer);
}

export const showBuySessionExitAlert = (dispatch, isSmartPurchaseFlow, exitAction) => {
  Alert.alert(
    'Cancelar compra',
    `Tem certeza que deseja sair do processo de compra${isSmartPurchaseFlow ? ' programada' : ''}?`,
    [
      {
        text: 'Continuar comprando',
        onPress: () => {}
      },
      {
        text: 'Sair',
        onPress: () => { 
          if (exitAction) {
            exitAction();
          } else {
            dispatch(NavigationActions.back()); 
          }
        }
      }
    ]
  );
}