/* eslint-disable prettier/prettier */
import { RootState } from 'redux/store';

export const userDetailsSelector = (state: RootState) => state.user.details;

export const userTrackerDetailsSelector = (state: RootState) =>
  state.user.details.data?.tracker;

export const userSelector = () => {};
