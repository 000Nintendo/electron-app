/* eslint-disable prettier/prettier */
import { Base64, FileUploadObject } from 'interfaces/interfaces';
import { ErrorMessages } from 'utils/messages';
import { PathHandlerServices } from './pathHandlers';

const { readFile, writeFile, readdir } = window.require('fs/promises');
const { unlink } = window.require('fs');

interface CacheUploads {
  fileUploadObject: FileUploadObject;
  file: Base64 | string;
}

interface DeleteUploadCache {
  userId: string;
  projectId: string;
  filePath: string;
}

interface SaveBase64File {
  base64String: Base64 | string;
  fileName: string;
}

class FileSystemService extends PathHandlerServices {
  saveBase64File = async ({ base64String, fileName }: SaveBase64File) => {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    writeFile(fileName, base64Data, 'base64');
  };

  cacheUploads = async ({ fileUploadObject, file }: CacheUploads) => {
    try {
      const { projectId, userId } = fileUploadObject;
      writeFile(
        `${this.screenshotsDirectory}/${fileUploadObject.fileName}`,
        file,
        'base64url'
      );
      const uploadsData = await readFile(
        this.uploadsCachesDirectory,
        'utf8',
        'w+'
      );

      let fileData: any = {};
      if (!uploadsData) {
        fileData[fileUploadObject.userId] = {
          [projectId]: fileUploadObject,
        };
      } else {
        fileData = { ...JSON.parse(uploadsData) };
        if (fileData?.[userId]) {
          fileData[userId] = {
            ...fileData[userId],
            [projectId]: fileUploadObject,
          };
        } else {
          fileData[userId] = {
            [projectId]: fileUploadObject,
          };
        }
      }

      if (Object.keys(fileData).length) {
        await writeFile(
          this.uploadsCachesDirectory,
          JSON.stringify(fileData),
          'utf8',
          'w+'
        );
      }
    } catch (err) {
      console.error(ErrorMessages.UPLOADS_CACHING_FAILED);
    }
  };

  removeFile = async (filePath: string) => {
    try {
      unlink(filePath, (err: NodeJS.ErrnoException) => {
        if (err) console.log(ErrorMessages.FILE_NOT_FOUND, err);
      });
    } catch (err) {
      console.log(ErrorMessages.FILE_NOT_FOUND, err);
    }
  };

  removeAllFilesFromDirectory = async ({
    directoryPath,
  }: {
    directoryPath: string;
  }) => {
    const files = await readdir(directoryPath);
    files.forEach((file: string) => {
      const filePath = `${directoryPath}/${file}`;
      this.removeFile(filePath);
    });
  };

  deleleUploadCache = async ({
    userId,
    projectId,
    filePath,
  }: DeleteUploadCache) => {
    try {
      const uploadsData = await readFile(this.uploadsCachesDirectory, 'utf8');

      if (uploadsData) {
        const uploadsObject = JSON.parse(uploadsData);
        if (Object.keys(uploadsObject).length) {
          if (uploadsObject?.[userId]?.[projectId]) {
            delete uploadsObject[userId][projectId];
            if (!Object.keys(uploadsObject[userId]).length) {
              delete uploadsObject[userId];
            }
          }
        }

        const fileData = Object.keys(uploadsObject).length
          ? JSON.stringify(uploadsObject)
          : '';

        this.removeFile(filePath);

        if (fileData === '')
          this.removeAllFilesFromDirectory({
            directoryPath: this.screenshotsDirectory,
          });

        try {
          await writeFile(this.uploadsCachesDirectory, fileData, 'utf8');
        } catch (err) {
          console.log(ErrorMessages.UPLOADS_CACHING_FAILED, err);
        }
      }
    } catch (err) {
      console.log(ErrorMessages.REMOVE_CACHE_FAILED, err);
    }
  };
}

const fileSystemService = new FileSystemService();

export default fileSystemService;
