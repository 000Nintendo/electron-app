/* eslint-disable prettier/prettier */
import { ref, uploadString } from '@firebase/storage';
import { firebaseStorage } from 'firebase/firebaseConfig';
import fileSystemService from 'services/fileSystem';
import { PathHandlerServices } from 'services/pathHandlers';
import projectLogServices from './projectLogs';

const { readFileSync, readFile } = window.require('fs');

type Opaque<T, K extends string> = T & { __typename: K };

type Base64 = Opaque<string, 'base64'>;

interface FileUploadObject {
  projectId: string;
  userId: string;
  refUrl: string;
  file?: Base64 | string;
  fileName: string;
  metadatata: any;
  filePath: string;
}

interface IUploadFile {
  file?: Base64 | string;
  cache?: boolean;
  uploadObject: FileUploadObject;
}

class FirebaseUploadService extends PathHandlerServices {
  generateFileName = (projectName: string) => {
    const date = new Date();
    const localTime = date
      ?.toLocaleTimeString()
      ?.split(' ')?.[0]
      ?.replaceAll(':', '');
    const localDate = date?.toLocaleDateString()?.replaceAll('/', '');
    const fileName = `${projectName}_d_${localDate}_t_${localTime}.jpg`;
    return fileName;
  };

  uploadFile = async ({
    file = '',
    cache = true,
    uploadObject,
  }: IUploadFile) => {
    const projectName = 'sample_project';
    const fileName =
      uploadObject?.fileName ?? this.generateFileName(projectName);
    const refUrl = uploadObject?.refUrl ?? `screenshots/${fileName}`;
    const storageRef = ref(firebaseStorage, refUrl);
    const userId = uploadObject?.userId ?? `user_id_3`;
    const projectId = uploadObject?.projectId ?? 'project_id';
    let fileData = file;
    if (uploadObject?.filePath) {
      fileData = readFileSync(uploadObject.filePath, 'base64url');
    }
    const filePath =
      uploadObject?.filePath ?? `${this.screenshotsDirectory}/${fileName}`;

    if (cache) {
      const fileUploadObject: FileUploadObject = {
        projectId,
        userId,
        refUrl,
        filePath,
        fileName,
        metadatata: '',
      };
      fileSystemService.cacheUploads({ fileUploadObject, file: fileData });
    }

    try {
      const uploadResponse = await uploadString(
        storageRef,
        fileData,
        'data_url'
      );
      if (uploadResponse) {
        await Promise.all([
          projectLogServices.addLog({
            bucket: uploadResponse.metadata.bucket,
            fullPath: uploadResponse.metadata.fullPath,
          }),
          fileSystemService.deleleUploadCache({
            userId,
            projectId,
            filePath,
          }),
        ]);
      }
    } catch (err) {
      console.error(
        'There is an error occured while uploading screenshots: ',
        err
      );
    }
  };

  resumeUploads = async () => {
    // const userId = 'user_id';
    // const projectId = 'project_id';
    const uploads = await readFile(this.uploadsCachesDirectory, 'utf8');
    const uploadFilesObject = uploads.length ? JSON.parse(uploads) : null;
    if (uploadFilesObject && Object.keys(uploadFilesObject)?.length) {
      Object.values(uploadFilesObject).forEach((user: any) => {
        if (Object.keys(user).length) {
          Object.values(user).forEach((uploadObject: any) => {
            this.uploadFile({
              uploadObject,
              cache: false,
            });
          });
        }
      });
    }
  };
}

const firebaseUploadService = new FirebaseUploadService();

export default firebaseUploadService;
