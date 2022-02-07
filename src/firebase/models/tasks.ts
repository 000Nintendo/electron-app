/* eslint-disable prettier/prettier */

import { TrackerStatusType } from 'interfaces/store/projects';

export enum TaskStatuses {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  QA = 'qa',
  DONE = 'done',
}

/**
 *
 * Task statuses
 * todo/in-progress/qa/done
 */
export declare type TaskStatusType =
  | TaskStatuses.DONE
  | TaskStatuses.IN_PROGRESS
  | TaskStatuses.QA
  | TaskStatuses.TODO;

export interface ITaskUser {
  email: string;
  fullname: string;
  uid: string;
  joining_date: Record<any, any>;
}

export interface ITaskTracker {
  startTime: string;
  lastStartTime: string;
  lastStopTime: string;
  weeklyTotal: string;
  taskTotal: string;
  status: TrackerStatusType;
}

export interface ITaskCreator {
  email: string;
  fullname: string;
  uid: string;
}

export interface ITaskProject {
  project_name: string;
  id?: string;
}

export interface ITasksModel {
  id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  users: ITaskUser[];
  userIds?: string[];
  status: TaskStatusType;
  tracker?: ITaskTracker;
  creator: ITaskCreator;
  project: ITaskProject;
  createdAt: string;
  updatedAt: string;
}
