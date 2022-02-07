/* eslint-disable prettier/prettier */
import { FirestoreError } from '@firebase/firestore';
import { IUserModel } from 'firebase/models/users';
import { IProjectDto } from './projects';

export interface IUser {
  email: string;
  fullname: string;
  uid: string;
  password?: string;
  projects?: IProjectDto[];
  joining_date: string;
  created_at: Record<any, any>;
  updated_at?: any;
}

export interface IUpdatedUser {
  email: string;
  fullname: string;
  uid: string;
  joining_date: Record<any, any>;
  projects?: any;
  created_at?: Record<any, any>;
}

export interface GetUserDetailsByIdResponse {
  success: boolean;
  user?: IUserModel;
  error?: FirestoreError;
}
