/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import { Pause, PlayArrow } from '@mui/icons-material';
import { IconButton, Zoom } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { startScreenCaptureService } from 'redux/actions/screenCapture';
import { projectActions } from 'redux/features/projects/projectSlice';
import { trackerActions } from 'redux/features/tracker/trackerSlice';
import { currentProjectSelector } from 'redux/selectors/projects';
import { trackerStatusSelector } from 'redux/selectors/tracker';
import timerServices from 'services/timer';
import { TrackerStatus } from 'utils/enums';

const useStyles = makeStyles({
  startTimerContainer: {
    width: '100%',
    display: 'flex',
    position: 'relative',
    marginTop: 80,
    justifyContent: 'center',
    marginBottom: 20,
    '@media (max-height: 750px)': {
      marginTop: 50,
    },
  },
  bottomBorder: {
    width: '100%',
    position: 'absolute',
    bottom: 13,
    borderBottom: '1px solid #d4d4d4',
  },
  playButtonContainer: {
    position: 'relative',
    width: '64px !important',
    height: '64px !important',
    background: '#ff414b !important',
    padding: 10,
    borderRadius: '50% !important',
    boxShadow: `0px 0px 4px 1px rgba(0, 0, 0, 0.2)`,
  },
  playArrow: {
    position: 'absolute',
    color: '#ffffff',
    fontSize: '1.5rem',
    width: '3rem !important',
    height: '3rem !important',
  },
});

const StartButton = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentProject = useSelector(currentProjectSelector);
  const trackerStatus = useSelector(trackerStatusSelector);

  const handleTrackerStatus = (): void => {
    if (trackerStatus === TrackerStatus.START) {
      dispatch(trackerActions.switchTracker(TrackerStatus.STOP));
      dispatch(projectActions.setTrackerStatus(TrackerStatus.STOP));
      timerServices.stopScreenShotTimer();
      return;
    }
    dispatch(trackerActions.switchTracker(TrackerStatus.START));
    dispatch(projectActions.setTrackerStatus(TrackerStatus.START));
    timerServices.startScreenShotTimer();
  };

  const handleStartButton = () => {
    if (!currentProject) {
      dispatch(
        trackerActions.setErrors({
          type: 'error',
          message: 'Please select project first!',
        })
      );
      return;
    }
    handleTrackerStatus();
    dispatch(startScreenCaptureService());
  };

  return (
    <Box sx={{ padding: '0px 20px' }}>
      <Box className={classes.startTimerContainer}>
        <Box className={classes.bottomBorder}></Box>
        <IconButton
          className={classes.playButtonContainer}
          onClick={handleStartButton}
        >
          <Zoom in={trackerStatus === TrackerStatus.STOP}>
            <PlayArrow className={classes.playArrow} />
          </Zoom>
          <Zoom in={trackerStatus === TrackerStatus.START}>
            <Pause className={classes.playArrow} />
          </Zoom>
        </IconButton>
      </Box>
    </Box>
  );
};

export default StartButton;
