import { all, call, put, takeLatest } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { GetUserDetailsByIdResponse } from 'firebase/interfaces/users';
import userServices from 'firebase/services/userServices';
import { GetUserDetails } from 'interfaces/store/users';
import { userActions } from 'redux/features/users/userSlice';

function* getUserDetails(action: PayloadAction<GetUserDetails>) {
  yield put(userActions.setFetchingUserDetails({ loading: true }));
  const response: GetUserDetailsByIdResponse = yield call(
    userServices.getUserDetailsById,
    action.payload.userId
  );
  if (response.user) {
    yield put(userActions.setUserDetails(response.user));
  }
}

export default function* userSaga() {
  yield all([takeLatest(userActions.getUserDetails.type, getUserDetails)]);
}
