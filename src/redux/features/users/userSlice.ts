/* eslint-disable import/extensions */
// eslint-disable-next-line import/extensions
import { UserCredential } from '@firebase/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserModel } from 'firebase/models/users';
import { GetUserDetails, IUserData } from 'interfaces/store/users';

interface UserState {
  auth: UserCredential | null;
  details: IUserData;
}

interface SetFetchingUserDetails {
  loading: boolean;
}

const initialState: UserState = {
  auth: null,
  details: {
    loading: true,
    data: null,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const updatedState = { ...state };
      updatedState.auth = action.payload;
      return updatedState;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getUserDetails: (_state, _action: PayloadAction<GetUserDetails>) => {},
    setFetchingUserDetails: (
      state,
      action: PayloadAction<SetFetchingUserDetails>
    ) => {
      state.details.loading = action.payload.loading;
    },
    setUserDetails: (state, action: PayloadAction<IUserModel>) => {
      state.details.data = action.payload;
      state.details.loading = false;
    },
  },
});

export const userActions = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;
