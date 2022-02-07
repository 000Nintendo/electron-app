/* eslint-disable prettier/prettier */

import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  trackerStatusSelector,
  projectTrackerSelector,
} from 'redux/selectors/projects';
import { userTrackerDetailsSelector } from 'redux/selectors/users/users';
import timerServices from 'services/timer';
import { TrackerStatus } from 'utils/enums';

const useStyles = makeStyles({ 
  timersContainer: {
    display: 'grid',
    padding: '0px 10px !important',
    gridTemplateColumns: 'auto auto',
  },
  timerOuterContainer: {
    padding: '0px 10px !important',
  },
  timerContainer: {
    width: '100% !important',
    padding: 5,
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#151515',
    borderRadius: 10,
    color: '#ffffff',
  },
});

let projectTimerInterval: NodeJS.Timer;
let userTimerInterval: NodeJS.Timer;

const ProjectTimer = () => {
  const classes = useStyles();
  const trackerStatus = useSelector(trackerStatusSelector);
  const [projectTime, setProjectTime] = useState('00:00:00');
  const [dailyTotal, setDailyTotal] = useState('00:00:00');
  const userTracker = useSelector(userTrackerDetailsSelector);
  const projectTracker = useSelector(projectTrackerSelector);

  const getProjectTime = (milliSeconds: number) => {
    projectTimerInterval = setInterval(() => {
      const time = timerServices.startProjectTimer({
        hours: 0,
        minutes: 0,
        milliSeconds,
      });
      setProjectTime(time);
    }, 1000);
  };

  const getUserTime = (milliSeconds: number) => {
    userTimerInterval = setInterval(() => {
      const time = timerServices.startUserTimer({
        hours: 0,
        minutes: 0,
        milliSeconds,
      });
      setDailyTotal(time);
    }, 1000);
  };

  useEffect(() => {
    if (trackerStatus === TrackerStatus.START) {
      const milliSeconds = projectTracker?.projectTotal;
      getProjectTime(Number(milliSeconds) ?? 0);
    }

    if (trackerStatus === TrackerStatus.STOP) {
      timerServices.resetSeconds();
    }
    return () => clearInterval(projectTimerInterval);
  }, [trackerStatus, projectTracker]);

  useEffect(() => {
    if (trackerStatus === TrackerStatus.START) {
      const milliSeconds = userTracker?.dailyTotal;
      getUserTime(Number(milliSeconds) ?? 0);
    }

    if (trackerStatus === TrackerStatus.STOP) {
      timerServices.resetSeconds();
    }
    return () => clearInterval(userTimerInterval);
  }, [trackerStatus, userTracker]);

  return (
    <Box className={classes.timersContainer}>
      <Box className={classes.timerOuterContainer}>
        <Typography textAlign="center" marginBottom={0.5} color="textPrimary">
          Project total
        </Typography>
        <Box className={classes.timerContainer}>
          <Typography color="inherit" fontSize="1.5rem" fontWeight={600}>
            {projectTime}
          </Typography>
        </Box>
      </Box>
      <Box className={classes.timerOuterContainer}>
        <Typography textAlign="center" marginBottom={0.5} color="textPrimary">
          Today total
        </Typography>

        <Box className={classes.timerContainer}>
          <Typography color="inherit" fontSize="1.5rem" fontWeight={600}>
            {dailyTotal}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectTimer;
