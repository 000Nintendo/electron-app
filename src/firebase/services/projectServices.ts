import {
  collection,
  doc,
  FirestoreError,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from '@firebase/firestore';
import { GetProjectByIdResponse } from 'firebase/interfaces/projects';
import { IProjectModel, IProjectTrackerDetails } from 'firebase/models/project';
import { TrackerStatusType } from 'interfaces/store/projects';
import storeServices from 'services/storeServices';
import { TrackerStatus } from 'utils/enums';
import { firebaseFirestore } from '../firebaseConfig';
import { IUpdatedUser } from '../interfaces/users';
import { FireStoreCollections } from '../utils/enums';
import userServices from './userServices';

export interface IAddProject {
  project_name: string;
  start_date: string;
  end_date: string;
  users?: IUpdatedUser[];
  id?: string;
  updated_at?: any;
}

export interface IAddProjectReponse {
  success: boolean;
  error?: FirestoreError;
}

interface IProjectUpateResonse extends IAddProjectReponse {}

interface GetProjectsResponse {
  success: boolean;
  projects?: IAddProject[];
  error?: FirestoreError;
}

export interface IProject extends IAddProject {}

class ProjectServices {
  addProject = async (values: IAddProject): Promise<IAddProjectReponse> => {
    try {
      const projectReference = await doc(
        collection(firebaseFirestore, 'projects')
      );
      const projectDetails = {
        project_name: values.project_name,
        start_date: values.start_date,
        end_date: values.end_date,
        users: values.users,
        id: projectReference.id,
      };

      await setDoc(projectReference, projectDetails);

      const updateUsersReponse =
        await userServices.updateUsersWithprojectDetails({
          users: values.users as IUpdatedUser[],
          projectDetails: projectDetails,
        });

      console.log(updateUsersReponse);

      return {
        success: true,
      };
    } catch (err) {
      console.log(
        'Something went wrong while adding project details in the database',
        err
      );
      return {
        success: false,
        error: err as FirestoreError,
      };
    }
  };

  getProjectById = async (id: string): Promise<GetProjectByIdResponse> => {
    try {
      const projectReference = doc(
        firebaseFirestore,
        FireStoreCollections.PROJECTS,
        id
      );

      const project = await getDoc(projectReference);

      return {
        success: true,
        project: project.data() as IProjectModel,
      };
    } catch (err) {
      console.log('An error occured while fetching project', err);
      return {
        success: false,
        error: err as FirestoreError,
      };
    }
  };

  updateProjectDetails = async (
    values: IAddProject
  ): Promise<IProjectUpateResonse> => {
    try {
      const projectReference = doc(
        firebaseFirestore,
        FireStoreCollections.PROJECTS,
        values.id as string
      );

      await updateDoc(projectReference, { ...values });

      const updateUsersReponse =
        await userServices.updateUsersWithprojectDetails({
          users: values.users as IUpdatedUser[],
          projectDetails: values,
        });

      console.log(updateUsersReponse);

      return {
        success: true,
      };
    } catch (err) {
      console.log('An error occured while updating project details', err);
      return {
        success: false,
        error: err as FirestoreError,
      };
    }
  };

  getProjects = async (): Promise<GetProjectsResponse> => {
    try {
      const projectReference = query(
        collection(firebaseFirestore, FireStoreCollections.PROJECTS)
      );
      const projectsResponse = await getDocs(projectReference);

      let projects: IProject[] = [];
      projectsResponse.forEach((project) =>
        projects.push(project.data() as IProject)
      );

      return {
        success: true,
        projects,
      };
    } catch (err) {
      console.log('An error occured while fetching projects', err);
      return {
        success: false,
        error: err as FirestoreError,
      };
    }
  };

  udpateProjectTrackingDetails = async () => {
    let startTime = '';
    let lastStartTime = '';
    let lastStopTime = '';
    let weeklyTotal = '0';
    let tracker_status = '' as TrackerStatusType;
    let projectTotal = '0';
    let updateRecord = false;
    let currentTime = new Date().getTime().toString();
    const trackerStatus = storeServices.getTrackerStatus();
    if (trackerStatus === TrackerStatus.STOP) {
      tracker_status = TrackerStatus.STOP;
    }
    const projectDetailsFromStore = storeServices.getProjectDetails();
    const projectId = projectDetailsFromStore?.id;
    if (projectId) {
      const projectRef = doc(
        firebaseFirestore,
        FireStoreCollections.PROJECTS,
        projectId
      );

      const response = await getDoc(projectRef);
      const projectDetails = response.data() as IProjectModel;
      const tracker = projectDetails?.tracker;
      const remoteTrackerStatus = tracker?.status;

      // Line is use full for updating tracker details in perticular time iterval
      // Here we are checking current tracker status and reponse tracker status
      // if both tracker status are same then we udpdating tracker timer details
      if (
        trackerStatus === TrackerStatus.START &&
        remoteTrackerStatus === TrackerStatus.START
      ) {
        updateRecord = true;
      }

      startTime = tracker?.startTime;
      projectTotal = tracker?.projectTotal;

      if (trackerStatus === TrackerStatus.STOP || updateRecord) {
        lastStartTime = tracker?.lastStartTime;
      }

      if (lastStartTime === '') lastStartTime = new Date().getTime().toString();
      if (lastStopTime === '') lastStopTime = new Date().getTime().toString();

      if (!startTime && trackerStatus === TrackerStatus.START) {
        startTime = new Date().getTime().toString();
      }

      if (trackerStatus === TrackerStatus.STOP || updateRecord) {
        lastStopTime = currentTime;
        const total =
          Number(projectTotal) + (Number(lastStopTime) - Number(lastStartTime));
        projectTotal = total.toString();
        lastStartTime = currentTime;
      }

      if (trackerStatus === TrackerStatus.START) {
        lastStartTime = currentTime;
        lastStopTime = currentTime;
        tracker_status = TrackerStatus.START;
      }

      if (updateRecord) {
        lastStartTime = currentTime;
      }

      const trackerDetails: IProjectTrackerDetails = {
        tracker: {
          startTime,
          lastStartTime,
          lastStopTime,
          weeklyTotal,
          projectTotal,
          status: tracker_status,
        },
      };

      await updateDoc(projectRef, { ...trackerDetails });

      storeServices.fetchProjectDetails();
    }
  };
}

const projectServices = new ProjectServices();

export default projectServices;
