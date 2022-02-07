import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBxgpONDeeavSolPeRmQWYrrsRHyHU6zUI',
  authDomain: 'writ-tracker.firebaseapp.com',
  projectId: 'writ-tracker',
  storageBucket: 'writ-tracker.appspot.com',
  messagingSenderId: '730662841280',
  appId: '1:730662841280:web:914ad01e8a8568c5f43625',
  measurementId: 'G-JTMWZX74PN',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = initializeAuth(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
export const firebaseFirestore = getFirestore(firebaseApp);
