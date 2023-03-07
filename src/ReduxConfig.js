import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import Reactotron from './ReactotronConfig';

import AppReducer from './redux';
import { googleAnalyticsScreenTracker } from './redux/middleware';
import { reactNavigationMiddleware } from './navigators/AppNavigator';

const middleware = applyMiddleware(reactNavigationMiddleware, googleAnalyticsScreenTracker, thunkMiddleware);

const store = createStore(AppReducer, compose(middleware, Reactotron.createEnhancer()))

export default store;