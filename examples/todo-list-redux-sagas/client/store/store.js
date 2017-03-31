import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose } from 'redux';
import Reducers from '../reducers';
import Saga from '../sagas';

const sagaMiddleware = createSagaMiddleware();

const composeEnhanced = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    Reducers, composeEnhanced( applyMiddleware(sagaMiddleware) )
  );

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  sagaMiddleware.run(Saga);
  return store;
};
