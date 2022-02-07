/* eslint-disable prettier/prettier */
import { all, call, takeLatest } from '@redux-saga/core/effects';
import { START_SCREEN_CAPTURE_SERVICE } from 'redux/actions/screenCapture';
import screenCaptureService from 'services/screenCapture';

function* startScreenCapture() {
  yield call(screenCaptureService.captureScreenShot);
}

export default function* screenCaptureSaga() {
  yield all([takeLatest(START_SCREEN_CAPTURE_SERVICE, startScreenCapture)]);
}
