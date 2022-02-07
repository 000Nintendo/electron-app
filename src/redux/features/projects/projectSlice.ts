import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProjectDto } from 'firebase/interfaces/projects';
import { IProjectModel } from 'firebase/models/project';
import {
  CurrentProjectDetailsPaylod,
  TrackerStatusType,
} from 'interfaces/store/projects';
import { RequestStatus, RequestStatusType, TrackerStatus } from 'utils/enums';

interface ProjectState {
  currentProject: IProjectDto | null;
  currentProjectDetails: {
    status: RequestStatusType;
    data: IProjectModel | null;
  };
  trackerStatus: TrackerStatusType;
}
/* eslint-disable prettier/prettier */
const initialState: ProjectState = {
  currentProject: null,
  currentProjectDetails: {
    status: RequestStatus.IDLE,
    data: null,
  },
  trackerStatus: TrackerStatus.STOP,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<IProjectDto>) => {
      state.currentProject = action.payload;
    },
    setCurrentProjectDetailsStatus: (
      state,
      action: PayloadAction<RequestStatusType>
    ) => {
      state.currentProjectDetails.status = action.payload;
    },
    getCurrentProjectDetails: (
      _,
      _action: PayloadAction<CurrentProjectDetailsPaylod>
    ) => {},
    setCurrentProjectDetails: (state, action: PayloadAction<IProjectModel>) => {
      state.currentProjectDetails.data = action.payload;
      state.currentProjectDetails.status = RequestStatus.SUCCESS;
    },
    setTrackerStatus: (state, action: PayloadAction<TrackerStatusType>) => {
      state.trackerStatus = action.payload;
    },
  },
});

export const projectActions = projectSlice.actions;
const projectReducer = projectSlice.reducer;
export default projectReducer;
