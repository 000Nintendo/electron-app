import { all, call, put, select, takeLatest } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { IProjectDto } from 'firebase/interfaces/projects';
import { ITaskListByUserAndProjectResponse } from 'firebase/interfaces/tasks';
import taskServices from 'firebase/services/taskServices';
import { IUserData } from 'interfaces/store/users';
import { taskActions } from 'redux/features/tasks/taskSlice';
import { userDetailsSelector } from 'redux/selectors/users/users';
import { RequestStatus } from 'utils/enums';

function* getTaskList(action: PayloadAction<IProjectDto>) {
  yield put(taskActions.updateTaskListStatus(RequestStatus.LOADING));
  const userDetails: IUserData = yield select(userDetailsSelector);
  const userId = userDetails.data?.uid;
  const projectId = action.payload.id;

  const response: ITaskListByUserAndProjectResponse = yield call(
    taskServices.getTaskListByUserAndProject as any,
    { userId, projectId }
  );

  if (response.success && response.tasks) {
    yield put(taskActions.setTaskList(response.tasks));
  }
}

export default function* taskSaga() {
  yield all([takeLatest(taskActions.getTaskList, getTaskList)]);
}
