/* eslint-disable prettier/prettier */
import { Typography } from '@mui/material';
import { ITaskStateCurrentTask } from 'interfaces/store/tasks';
import { useEffect, useState } from 'react';
import timerServices from 'services/timer';
import { TrackerStatus } from 'utils/enums';

interface ITaskTimerProps {
  taskId: string;
  task: ITaskStateCurrentTask;
}

let taskTimerInterval: NodeJS.Timer | null = null;

const TaskTimer = ({ taskId, task }: ITaskTimerProps) => {
  const [taskTimer, setTaskTimer] = useState('00:00');

  const isTackerOn = (): boolean => {
    if (
      taskId === task.details?.id &&
      task.taskStatus === TrackerStatus.START
    ) {
      return true;
    }
    return false;
  };

  const getTaskTime = (milliSeconds: number) => {
    taskTimerInterval = setInterval(() => {
      const time = timerServices.startTaskTimer({
        hours: 0,
        minutes: 0,
        milliSeconds,
      });
      setTaskTimer(time);
    }, 1000);
  };

  useEffect(() => {
    if (
      taskId === task.details?.id &&
      task.taskStatus === TrackerStatus.START
    ) {
      const ms = task.details?.tracker?.taskTotal as string;
      getTaskTime(Number(ms));
    }

    return () => clearInterval(taskTimerInterval as unknown as number);
  }, [task, taskId]);

  return (
    <Typography
      color={isTackerOn() ? 'textPrimary' : 'textSecondary'}
      sx={{
        textAlign: 'right',
        width: '100%',
        // paddingRight: '10px',
      }}
    >
      {taskTimer}
    </Typography>
  );
};

export default TaskTimer;
