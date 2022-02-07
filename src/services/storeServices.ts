/* eslint-disable prettier/prettier */
import { IProjectDto } from 'firebase/interfaces/projects';
import { ITasksModel } from 'firebase/models/tasks';
import { projectActions } from 'redux/features/projects/projectSlice';
import { userActions } from 'redux/features/users/userSlice';
import store, { RootState } from 'redux/store';

class StoreServices {
  getStoreState = (): RootState | null => {
    const reduxStore: any = store;
    const storeState: RootState = reduxStore.getState();
    return storeState;
  };

  getProjectDetails = (): IProjectDto | null => {
    const state = this.getStoreState();
    const projectDetails = state?.projects?.currentProject as IProjectDto;
    return projectDetails;
  };

  getTrackerStatus = () => {
    const state = this.getStoreState();
    return state?.tracker.status;
  };

  getUserDetails = () => {
    const state = this.getStoreState();
    const userDetails = state?.user?.auth;
    return userDetails;
  };

  fetchUserDetails = async () => {
    const userId = this.getStoreState()?.user?.auth?.user?.uid as string;
    if (userId) store.dispatch(userActions.getUserDetails({ userId }));
  };

  fetchProjectDetails = async () => {
    const projectId = this.getStoreState()?.projects?.currentProject
      ?.id as string;
    if (projectId)
      store.dispatch(projectActions.getCurrentProjectDetails({ projectId }));
  };

  getCurrentTaskDetails = (): ITasksModel | null => {
    const state = this.getStoreState();
    const taskDetails = state?.tasks.currentTask.details;
    return taskDetails as ITasksModel | null;
  };
}

const storeServices = new StoreServices();

export default storeServices;
