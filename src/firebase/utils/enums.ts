export enum AuthMessages {
  INVALID_EMAIL = 'auth/invalid-email',
  INTERNAL_ERROR = 'auth/internal-error',
  USER_NOT_FOUND = 'auth/user-not-found',
  WRONG_PASSWORD = 'auth/wrong-password',
  FIREBASE_ERROR = 'FirebaseError',
}

export enum FireStoreCollections {
  USERS = 'users',
  PROJECTS = 'projects',
  PROJECT_LOGS = 'logs',
  TASKS = 'tasks',
}
