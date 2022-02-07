import { firebaseAuth } from 'firebase/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  AuthError,
} from 'firebase/auth';

export interface IUserValues {
  email: string;
  password: string;
}

interface UserSignInResponse {
  success: boolean;
  user?: UserCredential;
  error?: AuthError;
}

class FirebaseAuthService {
  private auth = firebaseAuth;

  createUser = async () => {
    try {
      const createResponse = await createUserWithEmailAndPassword(
        this.auth,
        'smapleuser@gmail.com',
        '12345678'
      );
      return createResponse;
    } catch (err) {
      console.log('Something went wrong while creating new user', err);
      return err;
    }
  };

  signInUser = async (
    loginValues: IUserValues
  ): Promise<UserSignInResponse> => {
    try {
      const userResponse = await signInWithEmailAndPassword(
        this.auth,
        loginValues.email,
        loginValues.password
      );
      return {
        success: true,
        user: userResponse,
      };
    } catch (err) {
      console.log('Somthing goes wrong while signing in user', err);
      return {
        success: false,
        error: err as AuthError,
      };
    }
  };
}

export const fireBaseAuthService = new FirebaseAuthService();
