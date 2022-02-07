import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackerStatusType } from 'interfaces/store/projects';
import { TrackerStatus } from 'utils/enums';

/* eslint-disable prettier/prettier */
interface ITrackerError {
  type: string;
  message: string;
}

interface ITrackerState {
  status: TrackerStatusType;
  errors: ITrackerError[];
}

interface ISetErrorPayload {
  type: string;
  message: string;
}

const initialState: ITrackerState = {
  status: TrackerStatus.STOP,
  errors: [],
};

const trackerSlice = createSlice({
  name: 'tracker',
  initialState,
  reducers: {
    setErrors: (state, action: PayloadAction<ISetErrorPayload>) => {
      const errros = [...state.errors];
      errros.push(action.payload);
      state.errors = errros;
    },
    removeErrors: (state, __) => {
      state.errors = [];
    },
    switchTracker: (state, action: PayloadAction<TrackerStatusType>) => {
      state.status = action.payload;
    },
  },
});

export const trackerActions = trackerSlice.actions;
const trackerReducer = trackerSlice.reducer;
export default trackerReducer;
