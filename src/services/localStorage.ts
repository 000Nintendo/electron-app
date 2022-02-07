/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
import { UserCredential } from '@firebase/auth';
import { IProjectDetails } from 'firebase/interfaces/projects';
import { LocalStorageKeys, TrackerStatus } from 'utils/enums';

/* eslint-disable prettier/prettier */
class LocalStorageServices {
  storeAuthTokens = async (details: any) => {
    const tokens = details._tokenResponse;
    localStorage.setItem(LocalStorageKeys.TOKENS, JSON.stringify(tokens));
  };

  storeUserDetails = async (details: UserCredential) => {
    localStorage.setItem(
      LocalStorageKeys.USER_DETAILS,
      JSON.stringify(details)
    );
    this.storeAuthTokens(details);
  };

  getUserDetails = async (): Promise<UserCredential | null> => {
    if (localStorage.getItem(LocalStorageKeys.USER_DETAILS)) {
      return JSON.parse(
        localStorage.getItem(LocalStorageKeys.USER_DETAILS) as string
      );
    }
    return null;
  };

  storeProjectDetails = async (details: any): Promise<boolean> => {
    localStorage.setItem(
      LocalStorageKeys.PROJECT_DETAILS,
      JSON.stringify(details)
    );
    return true;
  };

  getProjectDetails = async (): Promise<IProjectDetails | null> => {
    if (localStorage.getItem(LocalStorageKeys.PROJECT_DETAILS)) {
      return JSON.parse(
        localStorage.getItem(LocalStorageKeys.PROJECT_DETAILS) as string
      );
    }
    return null;
  };

  setTrackerStatus = async (status: string) => {
    localStorage.setItem(
      LocalStorageKeys.TRACKER_STATUS,
      JSON.stringify(status)
    );
  };

  getProjectStatus = async (): Promise<
    TrackerStatus.START | TrackerStatus.STOP | null
  > => {
    if (localStorage.getItem(LocalStorageKeys.TRACKER_STATUS)) {
      return JSON.parse(LocalStorageKeys.TRACKER_STATUS);
    }
    return null;
  };
}

const localStorageServices = new LocalStorageServices();

export default localStorageServices;
