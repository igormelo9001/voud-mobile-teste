import { NavigationActions } from 'react-navigation';

// VouD imports
import { initActions, asyncStorageKeys, persistData } from './init';
import { waitAndNavigateToRoute } from './nav';
import { routeNames } from '../shared/route-names';
import { isLoggedIn } from '../utils/auth';

// Actions

const DISMISS = 'voud/onboarding/DISMISS';

export const onboardingActions = {
  DISMISS,
};

// Reducer

const initialState = {
  data: [
    {
      id: 1,
      // content: 'Seja bem-vindo ao VouD, o aplicativo para facilitar o dia a dia no transporte coletivo.',
      content:
        'Seja bem-vindo ao VouD, o mais completo aplicativo de mobilidade urbana para facilitar o seu dia a dia.',
      image: 'voud', // TODO: convert to imageURL
    },
    {
      id: 2,
      content:
        'Aqui você compra créditos para o seu Cartão BOM e Bilhete Único, e consulta o extrato e saldo de seu Cartão BOM.',
      image: 'transport',
    },
    {
      id: 3,
      content: 'Alugue um patinete, uma bike e até mesmo um carro :)',
      image: 'patinete',
    },
    {
      id: 4,
      content:
        'Compara os preços dos principais serviços de transporte com motorista: Uber, 99Taxi, Cabify e Wappa e muito mais.',
      image: 'mobilityServices',
    },
  ],
  viewed: false,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case initActions.HYDRATE:
      return {
        ...state,
        viewed: action.data.onboardingViewed,
      };
    case DISMISS:
      return {
        ...state,
        viewed: true,
      };
    default:
      return state;
  }
}

export default reducer;

// Actions creators

function _dismissOnboarding() {
  return {
    type: DISMISS,
  };
}

export function dismissOnboarding() {
  return async (dispatch, getState) => {
    persistData(asyncStorageKeys.onboardingViewed, true);
    dispatch(_dismissOnboarding());
    dispatch(NavigationActions.back());

    const { data } = getState().profile;
    const { activeDiscountCode } = getState().config;
    const userIsLoggedIn = isLoggedIn(data);

    if (!userIsLoggedIn && activeDiscountCode) {
      dispatch(waitAndNavigateToRoute(routeNames.AUTH));
    }
  };
}
