/* eslint-disable prettier/prettier */

import { FirestoreError } from '@firebase/firestore';
import { IProjectModel } from 'firebase/models/project';
import { IUpdatedUser } from './users';

export interface IProjectDetails {
  project_name: string;
  start_date: string;
  end_date: string;
  users?: IUpdatedUser[];
  id?: string;
}

export interface IProjectDto {
  project_name: string;
  start_date: string;
  end_date: string;
  id?: string;
}

export interface IAddProject {
  project_name: string;
  start_date: string;
  end_date: string;
  users?: IUpdatedUser[];
  id?: string;
  updated_at?: any;
}

export interface GetProjectByIdResponse {
  success: boolean;
  project?: IProjectModel;
  error?: FirestoreError;
}
