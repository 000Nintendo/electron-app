import { combineReducers } from 'redux';
import projectReducer from './projects/projectSlice';
import taskReducer from './tasks/taskSlice';
import trackerReducer from './tracker/trackerSlice';
import userReducer from './users/userSlice';

const rootReducer = combineReducers({
  user: userReducer,
  projects: projectReducer,
  tracker: trackerReducer,
  tasks: taskReducer,
});

export default rootReducer;
