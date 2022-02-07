import { IUserModel } from 'firebase/models/users';

/* eslint-disable prettier/prettier */
export interface GetUserDetails {
  userId: string;
}

export interface IUserData {
  loading: boolean;
  data: IUserModel | null;
}
