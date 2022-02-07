import { FirestoreError } from '@firebase/firestore';
import {
  ITaskCreator,
  ITaskProject,
  ITasksModel,
  ITaskTracker,
  ITaskUser,
  TaskStatusType,
} from '../models/tasks';

export interface ICreateTaskValues {
  title: string;
  description: string;
  status: TaskStatusType;
  start_date: string;
  end_date: string;
  tracker: ITaskTracker;
  project: ITaskProject;
  users: ITaskUser[];
  creator: ITaskCreator;
  id?: string;
  createdAt?: string;
}

export interface ICreateTaskResponse {
  success: boolean;
  error?: FirestoreError | NodeJS.ErrnoException;
}

export interface IGetTaskDetailsResponse {
  success: boolean;
  task?: ITasksModel;
  error?: FirestoreError | NodeJS.ErrnoException;
}

export interface IRemoveTaskResponse extends ICreateTaskResponse {}

export interface ITaskListByUserAndProject {
  userId: string;
  projectId: string;
}

export interface ITaskListByUserAndProjectResponse {
  success: boolean;
  tasks?: ITasksModel[];
  error?: FirestoreError | NodeJS.ErrnoException;
}
