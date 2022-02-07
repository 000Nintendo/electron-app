/* eslint-disable prettier/prettier */

import { RootState } from 'redux/store';

export const currentProjectSelector = (state: RootState) => 
  state.projects.currentProject;                               

export const projectDetailsSelector = (state: RootState) => 
  state.projects.currentProjectDetails;            

export const projectTrackerSelector = (state: RootState) =>  
  state.projects.currentProjectDetails.data?.tracker;

export const trackerStatusSelector = (state: RootState) => 
  state.projects.trackerStatus;
