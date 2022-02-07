import { RootState } from 'redux/store';

export const trackerErrorsSelector = (state: RootState) => state.tracker.errors;

export const trackerSelector = (state: RootState) => state.tracker;

export const trackerStatusSelector = (state: RootState) => state.tracker.status;
