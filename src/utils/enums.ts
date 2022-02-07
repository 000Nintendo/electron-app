export enum TrackerStatus {
  START = 'start',
  STOP = 'stop',
}

export enum FilePaths {
  UPLOADS_CACHES = 'uploads/uploads.json',
  SCREENSHOTS = 'uploads/screenshots',
  PRODUCTION_UPLOAD_CACHES = './resources/uploads/uploads.json',
  PRODUCTION_SCREENSHOTS = './resources/uploads/screenshots',
}

export enum LocalStorageKeys {
  TOKENS = 'tokens',
  USER_DETAILS = 'userDetails',
  PROJECT_DETAILS = 'projectDetails',
  TRACKER_STATUS = 'trackerStatus',
}

export enum RequestStatus {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
  FAILED = 'failed',
  IDLE = 'idle',
}

export type RequestStatusType =
  | RequestStatus.ERROR
  | RequestStatus.FAILED
  | RequestStatus.LOADING
  | RequestStatus.SUCCESS
  | RequestStatus.IDLE;
