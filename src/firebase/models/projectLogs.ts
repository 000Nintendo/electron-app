/* eslint-disable prettier/prettier */
import { TrackerStatusType } from 'interfaces/store/projects';

export interface ProjectLogsModel {
  bucket: string;
  project_id: string;
  user_id: string;
  log_id: string;
  task_id: string;
  image_path: string;
  start_time: string;
  end_time: string;
  tracker_status: TrackerStatusType;
  created_at: string;
  updated_at?: string;
}
