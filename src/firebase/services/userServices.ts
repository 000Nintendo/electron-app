/* eslint-disable prettier/prettier */
import {
  collection,
  doc,
  FirestoreError,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from '@firebase/firestore';
import { firebaseFirestore } from 'firebase/firebaseConfig';
import { IAddProject, IProjectDetails } from 'firebase/interfaces/projects';
import {
  GetUserDetailsByIdResponse,
  IUpdatedUser,
  IUser,
} from 'firebase/interfaces/users';
import { IUserModel, IUserTrackerDto } from 'firebase/models/users';
import { FireStoreCollections } from 'firebase/utils/enums';
import { TrackerStatusType } from 'interfaces/store/projects';
import storeServices from 'services/storeServices';
import { TrackerStatus } from 'utils/enums';

interface IGetAllUsers {
  users?: IUser[];
  success: boolean;
  error?: FirestoreError;
}

interface IUserUpdateData {
  email?: string;
  fullname?: string;
  uid?: string;
  joining_date?: string;
  projects?: IProjectDetails[];
  created_at?: Record<any, any>;
  updated_at?: Record<any, any>;
}

interface IUpdateUserDetails {
  userId: string;
  data: IUserUpdateData;
}

interface UpdateUsersWithprojectDetails {
  users: IUpdatedUser[];
  projectDetails: IAddProject;
}

interface UpdateUserResponse {
  success: boolean;
  error?: FirestoreError;
}

class UserServices {
  getAllUsers = async (): Promise<IGetAllUsers> => {
    try {
      const usersQuery = query(
        collection(firebaseFirestore, FireStoreCollections.USERS)
      );
      const usersResponse = await getDocs(usersQuery);

      const users: IUser[] = [];
      usersResponse.forEach((user) => users.push(user.data() as IUser));

      return {
        users,
        success: true,
      };
    } catch (err) {
      console.log('Something goes wrong while fetching users list', err);
      return {
        success: false,
        error: err as FirestoreError,
      };
    }
  };

  updateUserDetails = async ({ userId, data }: IUpdateUserDetails) => {
    const userRefrence = doc(
      firebaseFirestore,
      FireStoreCollections.USERS,
      userId
    );

    const userTransaction = await runTransaction(
      firebaseFirestore,
      async (transaction) => {
        const userDetails = await transaction.get(userRefrence);
        const updatedUserDetails = { ...userDetails.data() } as IUser;

        if (!userDetails.exists()) {
          throw new Error('User not found!');
        }

        const updatedProjects: IProjectDetails[] =
          userDetails?.data()?.projects;

        if (data?.projects?.length === 1) {
          let isProjectExist = false;
          updatedProjects.forEach((project, index: number) => {
            if (project.id === data?.projects?.[0]?.id && data?.projects) {
              // eslint-disable-next-line prefer-destructuring
              updatedProjects[index] = data.projects[0];
              isProjectExist = true;
            }
          });

          if (!isProjectExist) {
            updatedProjects.push(data?.projects?.[0]);
          }

          updatedUserDetails.projects = updatedProjects;
          updatedUserDetails.updated_at = serverTimestamp();

          await transaction.update(userRefrence, updatedUserDetails as any);
          return updatedUserDetails;
        }

        return {} as IUser;
      }
    );

    return userTransaction;
  };

  updateUser = async (values: IUser): Promise<UpdateUserResponse> => {
    try {
      const userReference = doc(
        firebaseFirestore,
        FireStoreCollections.USERS,
        values.uid as string
      );

      const updateValues = { ...values };
      updateValues.updated_at = serverTimestamp();
      delete updateValues.password;

      await updateDoc(userReference, { ...updateValues });

      return {
        success: true,
      };
    } catch (err) {
      console.log('Somhing goes wrong while updating user details', err);

      return {
        success: false,
        error: err as FirestoreError,
      };
    }
  };

  updateUsersWithprojectDetails = async ({
    users,
    projectDetails,
  }: UpdateUsersWithprojectDetails) => {
    const updateUserPromises: Promise<IUser | undefined>[] = [];

    users?.forEach((user) => {
      if (user) {
        updateUserPromises.push(
          this.updateUserDetails({
            userId: user.uid,
            data: {
              projects: [projectDetails],
            },
          })
        );
      }
    });

    const response = await Promise.all(updateUserPromises);
    return response;
  };

  getUserDetailsById = async (
    id: string
  ): Promise<GetUserDetailsByIdResponse> => {
    try {
      const projectReference = doc(
        firebaseFirestore,
        FireStoreCollections.USERS,
        id
      );

      const user = await getDoc(projectReference);

      return {
        success: true,
        user: user.data() as IUserModel,
      };
    } catch (err) {
      console.log('An error occured while fetching user', err);
      return {
        success: false,
        error: err as FirestoreError,
      };
    }
  };

  udpateUserTrackingDetails = async () => {
    const currentTime = new Date().getTime().toString();
    const user = storeServices.getUserDetails();
    if (user?.user?.uid) {
      const userRef = doc(
        firebaseFirestore,
        FireStoreCollections.USERS,
        user.user.uid
      );

      const userResponse = await getDoc(userRef);
      const userDetails = userResponse.data() as IUserModel;
      const trackerStatus = storeServices.getTrackerStatus();
      const trackingDetails = userDetails?.tracker;

      let dailyTotal = '0';
      let userTotal = '0';
      let startTime = '';
      let lastStartTime = '';
      let lastStopTime = '';
      let status = '' as TrackerStatusType;
      let updateRecord = false;
      const remoteTrackerStatus = trackingDetails.status;

      if (
        trackerStatus === TrackerStatus.START &&
        remoteTrackerStatus === TrackerStatus.START
      ) {
        updateRecord = true;
      }

      startTime = trackingDetails?.startTime;
      lastStopTime = trackingDetails?.lastStopTime;
      userTotal = trackingDetails?.userTotal;

      if (trackerStatus === TrackerStatus.STOP || updateRecord) {
        lastStartTime = trackingDetails?.lastStartTime;
      }

      if (!lastStartTime) lastStartTime = currentTime;
      if (!lastStopTime) lastStopTime = currentTime;

      if (!startTime && trackerStatus === TrackerStatus.START) {
        startTime = currentTime;
      }

      if (trackerStatus === TrackerStatus.STOP) {
        status = TrackerStatus.STOP;
      }

      if (trackerStatus === TrackerStatus.STOP || updateRecord) {
        lastStopTime = currentTime;
        const totalUserTime =
          Number(userTotal) + (Number(lastStopTime) - Number(lastStartTime));
        userTotal = totalUserTime.toString();
      }

      const currentDate = new Date().getDate();
      const lastStopDate = new Date(Number(lastStopTime)).getDate();

      dailyTotal = userDetails?.tracker?.dailyTotal;

      if (currentDate !== lastStopDate) {
        dailyTotal = '0';
        lastStopTime = new Date().getTime().toString();
      }

      if (trackerStatus === TrackerStatus.STOP || updateRecord) {
        const totalDaily =
          Number(dailyTotal) + Number(lastStopTime) - Number(lastStartTime);
        dailyTotal = totalDaily.toString();
        lastStartTime = currentTime;
      }

      if (trackerStatus === TrackerStatus.START) {
        lastStartTime = currentTime;
        lastStopTime = currentTime;
        status = TrackerStatus.START;
      }

      if (updateRecord) {
        lastStartTime = currentTime;
      }

      const userTrackingDetails: IUserTrackerDto = {
        dailyTotal,
        userTotal,
        startTime,
        lastStartTime,
        lastStopTime,
        status,
        updatedAt: new Date().toUTCString(),
      };

      await updateDoc(userRef, { tracker: userTrackingDetails });

      storeServices.fetchUserDetails();
    }
  };
}

const userServices = new UserServices();

export default userServices;
