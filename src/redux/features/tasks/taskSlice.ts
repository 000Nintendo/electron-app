/* eslint-disable prettier/prettier */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProjectDto } from 'firebase/interfaces/projects';
import { ITasksModel } from 'firebase/models/tasks';
import { TrackerStatusType } from 'interfaces/store/projects';
import { IGetCurrentTaskDetails, ITaskState } from 'interfaces/store/tasks';
import { RequestStatus, RequestStatusType, TrackerStatus } from 'utils/enums';

const initialState: ITaskState = {
  currentProjectTasks: {
    list: [],
    status: RequestStatus.IDLE,
  },
  currentTask: {
    taskStatus: TrackerStatus.STOP,
    details: null,
    requestStatus: RequestStatus.IDLE,
  },
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    getTaskList: (_, _action: PayloadAction<IProjectDto>) => {},

    updateTaskListStatus: (state, action: PayloadAction<RequestStatusType>) => {
      state.currentProjectTasks.status = action.payload;
    },

    setTaskList: (state, action: PayloadAction<any>) => {
      state.currentProjectTasks.list = action.payload;
      state.currentProjectTasks.status = RequestStatus.IDLE;
    },

    setCurrentTask: (state, action: PayloadAction<ITasksModel>) => {
      state.currentTask.details = action.payload;
      state.currentTask.requestStatus = RequestStatus.IDLE;
    },

    switchCurrentTaskStatus: (
      state,
      action: PayloadAction<TrackerStatusType>
    ) => {
      state.currentTask.taskStatus = action.payload;
    },

    getCurrentTaskDetails: (
      _,
      _action: PayloadAction<IGetCurrentTaskDetails>
    ) => {},
  },
});

export const taskActions = taskSlice.actions;
const taskReducer = taskSlice.reducer;
export default taskReducer;
