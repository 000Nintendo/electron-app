/* eslint-disable prettier/prettier */
import { FilePaths } from 'utils/enums';

export class PathHandlerServices {
  development = process.env.NODE_ENV === 'development';

  uploadsCachesDirectory = this.development
    ? FilePaths.UPLOADS_CACHES
    : FilePaths.PRODUCTION_UPLOAD_CACHES;
  // : `${process.cwd()}/resources/${FilePaths.UPLOADS_CACHES}`;

  screenshotsDirectory = this.development
    ? FilePaths.SCREENSHOTS
    : FilePaths.PRODUCTION_SCREENSHOTS;
  // : `${process.cwd()}/resources/${FilePaths.SCREENSHOTS}`;
}

const pathHandlerServices = new PathHandlerServices();

export default pathHandlerServices;
