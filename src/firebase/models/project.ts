import { IUpdatedUser } from 'firebase/interfaces/users';
import { TrackerStatusType } from 'interfaces/store/projects';

export interface ITrackerDetails {
  startTime: string;
  lastStartTime: string;
  lastStopTime: string;
  weeklyTotal: string;
  projectTotal: string;
  status: TrackerStatusType;
}

export interface IProjectTrackerDetails {
  tracker: ITrackerDetails;
}

export interface IProjectModel {
  project_name: string;
  start_date: string;
  end_date: string;
  userIds?: string[];
  users?: IUpdatedUser[];
  id?: string;
  tracker: ITrackerDetails;
}
