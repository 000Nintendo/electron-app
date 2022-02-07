/* eslint-disable react/no-array-index-key */
/* eslint-disable no-await-in-loop */
/* eslint-disable promise/always-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable promise/catch-or-return */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
// import React from 'react';
import { ArrowBackIosNew, Replay } from '@mui/icons-material';
import { IconButton, Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/material';
import ProjectSelector from 'components/tracker/ProjectSelector';
import TasksList from 'components/tracker/TaskstList';
import { useHistory } from 'react-router';
import store from 'redux/store';
import ProjectTimer from './Timer';
import ToastMessage from 'components/toast/ToastMessage';
import StartButton from 'components/tracker/StartButton';

const reduxStore = store;

console.log(reduxStore);

const useStyles = makeStyles({
  trackerContainer: {
    minWidth: 400,
    maxWidth: 400,
    minHeight: 500,
    height: 700,
    position: 'relative',
    borderRadius: '10px !important',
    overflow: 'hidden',
    '@media (max-height: 750px)': {
      height: '500px !important',
    },
  },
  projectList: {
    width: '100%',
    marginTop: '30px !important',
  },
  updateContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    background: '#f1f1f1',
    position: 'absolute',
    bottom: 0,
    borderTop: '1px solid #dadada',
  },
  refreshButtonContainer: {},
  refreshButton: {
    width: '0.8em !important',
    height: '0.8em !important',
  },
  trackerScreen: {
    // width: '100%',
    // height: '100vh',
    // display: 'flex',
    // alignItems: 'center',
  },
});

const Tracker = () => {
  const classes = useStyles();
  const history = useHistory();

  const navigateBack = () => {
    history.push('/');
  };

  return (
    <Box className={classes.trackerScreen}>
      <Box position="absolute" top={20} left={20}>
        <IconButton onClick={navigateBack}>
          <ArrowBackIosNew />
        </IconButton>
      </Box>
      <Box className={classes.trackerContainer} component={Paper}>
        <ToastMessage />
        <StartButton />
        <Box padding={2} paddingBottom={0}>
          <ProjectSelector />
        </Box>
        {/* Project timer */}
        <ProjectTimer />
        {/* Tasks List */}
        <TasksList />
        <Box className={classes.updateContainer}>
          <IconButton className={classes.refreshButtonContainer}>
            <Replay className={classes.refreshButton} />
          </IconButton>
          <Typography fontSize="0.9rem">
            Last updated at: 16/11/21 12:55 PM
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Tracker;
