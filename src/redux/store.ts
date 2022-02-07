import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './features/rootReducer';
import createSagaMiddleware from '@redux-saga/core';
import rootSaga from './sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof rootReducer>;

export default store;
