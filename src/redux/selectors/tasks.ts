/* eslint-disable prettier/prettier */
import { RootState } from 'redux/store';

export const currentProjectTasksSelector = (state: RootState) =>
  state.tasks.currentProjectTasks;

export const currentTaskSelector = (state: RootState) =>
  state.tasks.currentTask;

export const taskListSelector = () => {};
