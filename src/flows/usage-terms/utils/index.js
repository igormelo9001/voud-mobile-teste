import {
  Platform
} from 'react-native';

import { openUrl } from '../../../utils/open-url';
import { navigateToRoute } from '../../../redux/nav';
import { routeNames } from '../../../shared/route-names';
import { fetchCheckLastTermsAccepted } from '../actions';

const showDocument = (dispatch, source) => {
  if (Platform.OS === 'ios') {
    dispatch(navigateToRoute(routeNames.BROWSER, { source }));
  } else {
    openUrl(source);
  }
};

export const viewTerms = dispatch => {
  const source = 'http://www.autopass.com.br/wp-content/uploads/2017/11/Termo-de-uso-app-VouD.pdf';
  showDocument(dispatch, source);
};

export const viewPrivacyPolicy = dispatch => {
  const source = 'http://www.autopass.com.br/wp-content/uploads/2017/11/Politica-de-privacidade-app-VouD.pdf';
  showDocument(dispatch, source);
};

export const dispatchCheckLastTermsAccepted = dispatch => {
  dispatch(fetchCheckLastTermsAccepted())
  .then(response => {
    if (response && !response.payload) dispatch(navigateToRoute(routeNames.ACCEPT_USAGE_TERMS));
  });
};
