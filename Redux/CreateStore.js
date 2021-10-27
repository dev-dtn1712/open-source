import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import Config from '../Config/DebugConfig';
import ScreenTracking from './ScreenTrackingMiddleware';
import {
  storeMetadataMiddleware,
  storeResponsesMiddleware,
  storeUserMiddleware,
  storeContentMiddleware
} from './StorageMiddleware';
import { appNavigatorMiddleware } from '../Navigation/ReduxNavigation';
import Reactotron from '../Config/ReactotronConfig';

// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */

  const middleware = [];
  const enhancers = [];

  /* ------------- Navigation Middleware ------------ */
  middleware.push(appNavigatorMiddleware);

  /* ------------- Analytics Middleware ------------- */
  middleware.push(ScreenTracking);

  /* ------------- Storage Middleware ------------- */
  middleware.push(storeMetadataMiddleware);
  middleware.push(storeResponsesMiddleware);
  middleware.push(storeUserMiddleware);
  middleware.push(storeContentMiddleware);

  /* ------------- Saga Middleware ------------- */

  const sagaMonitor = Config.useReactotron
    ? console.tron.createSagaMonitor()
    : null;
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
  middleware.push(sagaMiddleware);

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware));

  // if Reactotron is enabled (default for __DEV__), we'll create the store through Reactotron
  const createAppropriateStore = createStore;
  if (Config.useReactotron) {
    enhancers.push(Reactotron.createEnhancer());
  }
  const store = createAppropriateStore(rootReducer, compose(...enhancers));

  // kick off root saga
  const sagasManager = sagaMiddleware.run(rootSaga);

  return {
    store,
    sagasManager,
    sagaMiddleware
  };
};
