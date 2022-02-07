/* eslint-disable prettier/prettier */
import { collection, doc, setDoc } from '@firebase/firestore';
import { firebaseFirestore } from 'firebase/firebaseConfig';
import { ProjectLogsModel } from 'firebase/models/projectLogs';
import { FireStoreCollections } from 'firebase/utils/enums';
import { TrackerStatusType } from 'interfaces/store/projects';
import notificationServices from 'services/notification';
import storeServices from 'services/storeServices';
import { TrackerStatus } from 'utils/enums';

interface AddLogs {
  bucket: string;
  fullPath: string;
}

class ProjectLogServices {
  addLog = async (data: AddLogs) => {
    try {
      const logReference = doc(
        collection(firebaseFirestore, FireStoreCollections.PROJECT_LOGS)
      );
      const projectDetails = storeServices.getProjectDetails();
      const userDetails = storeServices.getUserDetails();
      const taskDetails = storeServices.getCurrentTaskDetails();
      const trackerStatus =
        storeServices.getTrackerStatus() as TrackerStatusType;

      const projectId = projectDetails?.id as string;
      const userId = userDetails?.user.uid as string;
      const taskId = taskDetails?.id ?? '';

      let startTime = '';
      let endTime = '';

      if (trackerStatus === TrackerStatus.STOP)
        endTime = new Date().toUTCString();

      if (trackerStatus === TrackerStatus.START)
        startTime = new Date().toUTCString();

      const log: ProjectLogsModel = {
        user_id: userId,
        project_id: projectId,
        task_id: taskId,
        bucket: data.bucket,
        log_id: logReference.id,
        image_path: data.fullPath,
        tracker_status: trackerStatus,
        start_time: startTime,
        end_time: endTime,
        created_at: new Date().toUTCString(),
        updated_at: new Date().toUTCString(),
      };

      await setDoc(logReference, log);
    } catch (err) {
      console.log('Something went wrong while generating project logs', err);
      notificationServices.error(
        'Something went wrong while generating project logs!'
      );
    }
  };
}

const projectLogServices = new ProjectLogServices();
export default projectLogServices;
