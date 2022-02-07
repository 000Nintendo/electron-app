/* eslint-disable prettier/prettier */
import { IProjectDto } from 'firebase/interfaces/projects';
import { TrackerStatusType } from 'interfaces/store/projects';

export interface IUserTrackerDto {
  dailyTotal: string;
  userTotal: string;
  startTime: string;
  lastStartTime: string;
  lastStopTime: string;
  status: TrackerStatusType;
  updatedAt: string;
}

export interface IUserModel {
  email: string;
  fullname: string;
  uid: string;
  password?: string;
  projects?: IProjectDto[];
  joining_date: string;
  created_at: Record<any, any>;
  updated_at?: any;
  tracker: IUserTrackerDto;
}
