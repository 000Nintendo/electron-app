import {
  collection,
  doc,
  FirestoreError,
  getDoc,
  getDocs,
  query,
  where,
} from '@firebase/firestore';
import { firebaseFirestore } from '../firebaseConfig';
import { ITasksModel} from '../models/tasks';
import { FireStoreCollections } from '../utils/enums';
import notificationServices from '../../services/notification';
import {
  IGetTaskDetailsResponse,
  ITaskListByUserAndProject,
  ITaskListByUserAndProjectResponse,
} from 'firebase/interfaces/tasks';
// import TaskCols from 'db/TaskCols';

interface IGetAllTasks {
  tasks?: ITasksModel[];
  success: boolean;
  error?: FirestoreError;
}

class TaskServices {
  getAllTasks = async (): Promise<IGetAllTasks> => {
    try {
      const taskquery = query(
        collection(firebaseFirestore, FireStoreCollections.TASKS),
      );
      console.log(taskquery)
      const tasksResponse = await getDocs(taskquery);
      console.log(tasksResponse)

      const tasks: ITasksModel[] = [];
      console.log(tasks);
      tasksResponse.forEach((task) => tasks.push(task.data() as ITasksModel));

      return {
        tasks: tasks,
        success: true,
      };
    } catch (err) {
      console.log("Something goes wrong while fetching tasks list", err);
      return {
        success: false,
        error: err as FirestoreError,
      };
    }
  };

  getTaskDetailsById = async (id: string): Promise<IGetTaskDetailsResponse> => {
    try {
      const taskRef = doc(firebaseFirestore, FireStoreCollections.TASKS, id);
      const task = await getDoc(taskRef);

      return {
        success: true,
        task: task.data() as ITasksModel,
      };

    } catch (err) {
      console.log('Something went wrong while getting task details', err);
      notificationServices.error(
        'Somthing goes wrong while getting task details'
      );
      return {
        success: false,
        error: err as FirestoreError,
      };
    }
  };

  getTaskListByUserAndProject = async ({
    userId,
    projectId,
  }: ITaskListByUserAndProject): Promise<ITaskListByUserAndProjectResponse> => {
    try {
      const taskRef = collection(firebaseFirestore, FireStoreCollections.TASKS);
      const taskQuery = query(
        taskRef,
        where('project.id', '==', projectId),
        where('userIds', 'array-contains', userId)
      );

      const taskSnapshot = await getDocs(taskQuery);
      const tasks: ITasksModel[] = [];
      taskSnapshot.forEach((task) => tasks.push(task.data() as ITasksModel));
      return {
        success: true,
        tasks: tasks,
      };
    } catch (err) {
      console.log('Something goes wrong while getting tasks list', err);
      notificationServices.error(
        'Something goes wrong while getting tasks list!'
      );
      return {
        success: false,
        error: err as FirestoreError,
      };
    }
  };

  updateTaskTrackingDetails = async () => {
    // const taskTotal = '0';
    // const lastStartTime = '';
    // const lastStopTime = '';
    // const startTime = '';
    // const status = TrackerStatus.STOP;
    // const weeklyTotal = '0';
  };

  updateTask = () => {};

}

const taskServices = new TaskServices();

export default taskServices;
