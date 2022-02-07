/* eslint-disable prettier/prettier */
import { ITasksModel } from 'firebase/models/tasks';
import { RequestStatusType } from 'utils/enums';
import { TrackerStatusType } from './projects';

export interface ICurrentProjectTaskList {
  list: ITasksModel[];
  status: RequestStatusType;
}

export interface ITaskStateCurrentTask {
  taskStatus: TrackerStatusType;
  details: ITasksModel | null;
  requestStatus: RequestStatusType;
}

export interface ITaskState {
  currentProjectTasks: ICurrentProjectTaskList;
  currentTask: ITaskStateCurrentTask;
}

export interface IGetCurrentTaskDetails {
  taskId: string;
}
