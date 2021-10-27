import configureStore from './CreateStore';
import rootSaga from './RootSaga';
import rootReducer from './RootReducer';

/* ------------- Assemble The Reducers ------------- */

export default () => {
  let { store, sagasManager, sagaMiddleware } = configureStore(
    rootReducer,
    rootSaga
  );

  if (module.hot) {
    module.hot.accept(() => {
      store.replaceReducer(rootReducer);

      const newYieldedSagas = rootSaga;
      sagasManager.cancel();
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware(newYieldedSagas);
      });
    });
  }

  return store;
};
