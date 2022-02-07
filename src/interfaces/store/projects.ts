import { TrackerStatus } from 'utils/enums';

/* eslint-disable prettier/prettier */
export interface CurrentProjectDetailsPaylod {
  projectId: string;
}

export type TrackerStatusType = TrackerStatus.START | TrackerStatus.STOP;
