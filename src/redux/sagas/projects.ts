import { all, call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { GetProjectByIdResponse } from 'firebase/interfaces/projects';
import projectServices from 'firebase/services/projectServices';
import { CurrentProjectDetailsPaylod } from 'interfaces/store/projects';
import { projectActions } from 'redux/features/projects/projectSlice';
import localStorageServices from 'services/localStorage';
import { RequestStatus } from 'utils/enums';

function* getProjectDetails(
  action: PayloadAction<CurrentProjectDetailsPaylod>
) {
  yield put(
    projectActions.setCurrentProjectDetailsStatus(RequestStatus.LOADING)
  );

  const projectDetails: GetProjectByIdResponse = yield call(
    projectServices.getProjectById,
    action.payload.projectId
  );

  if (projectDetails.success && projectDetails.project) {
    yield put(projectActions.setCurrentProjectDetails(projectDetails.project));
    yield call(
      localStorageServices.storeProjectDetails,
      projectDetails.project
    );
  }

  if (projectDetails.error) {
    yield put(
      projectActions.setCurrentProjectDetailsStatus(RequestStatus.ERROR)
    );
    console.log(
      'Something went wrong while fetching user details',
      projectDetails.error
    );
  }
}

export default function* projectsSaga() {
  yield all([
    takeLatest(projectActions.getCurrentProjectDetails, getProjectDetails),
  ]);
}
