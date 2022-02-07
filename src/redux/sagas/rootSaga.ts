import { all } from 'redux-saga/effects';
import projectsSaga from './projects';
import screenCaptureSaga from './screenCapture';
import taskSaga from './tasks';
import userSaga from './users';

function* rootSaga() {
  yield all([userSaga(), projectsSaga(), taskSaga(), screenCaptureSaga()]);
}

export default rootSaga;
