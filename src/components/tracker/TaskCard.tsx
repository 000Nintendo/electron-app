/* eslint-disable prettier/prettier */
import { Pause, PlayArrow } from '@mui/icons-material';
import {
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Theme,
  Typography,
  Zoom,
} from '@mui/material';
// import { Fade, IconButton, Theme, Typography, Zoom } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import { ITasksModel } from 'firebase/models/tasks';
import { useDispatch, useSelector } from 'react-redux';
import { startScreenCaptureService } from 'redux/actions/screenCapture';
import { taskActions } from 'redux/features/tasks/taskSlice';
import { trackerActions } from 'redux/features/tracker/trackerSlice';
import { currentTaskSelector } from 'redux/selectors/tasks';
import { TrackerStatus } from 'utils/enums';
import TaskTimer from './TaskTimer';

const useStyles = makeStyles((theme: Theme) => ({
  projectDetailsContainer: {
    width: '100%',
    display: 'grid',
    cursor: 'pointer',
    alignItems: 'center',
    alignContent: 'center',
    padding: '12px 20px',
    gridTemplateColumns: '35px auto auto !important',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#f1f1f1',
    },
    '& .active-start-button': {
      opacity: '1 !important',
    },
  },
  startIconContainer: {},
  projectName: {
    display: 'flex',
    alignItems: 'center',
  },
  projectTime: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  projectStartButtonContainer: {
    display: 'flex',
    width: '24px !important',
    height: '24px !important',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    background: `${theme.palette.primary.main} !important`,
    padding: '4px !important',
    borderRadius: '50% !important',
    opacity: 0.4,
    '&.full-opacity': {
      opacity: 1,
    },
  },
  projectStartArrow: {
    position: 'absolute',
    color: '#ffffff',
    fontSize: '1rem',
    width: '1rem !important',
    height: '1rem !important',
  },
  activeProject: {
    background: '#1976d21a !important',
  },
}));

interface ProjectCardProps {
  task: ITasksModel;
  // cardIndex?: number;
  // totalTasks?: number;
}

const TaskCard = ({ task }: ProjectCardProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentTaskDetails = useSelector(currentTaskSelector);
  // const taskStatus = currentTaskDetails.taskStatus;

  const handleProjectStatus = (): void => {
    if (currentTaskDetails.taskStatus === TrackerStatus.STOP) {
      dispatch(trackerActions.switchTracker(TrackerStatus.START));
      dispatch(taskActions.setCurrentTask(task));
      dispatch(taskActions.switchCurrentTaskStatus(TrackerStatus.START));
      return;
    }

    if (currentTaskDetails.details?.id === task.id) {
      dispatch(trackerActions.switchTracker(TrackerStatus.STOP));
      dispatch(taskActions.switchCurrentTaskStatus(TrackerStatus.STOP));
    }
  };

  const handleProjectCardClick = () => {
    handleProjectStatus();
    dispatch(startScreenCaptureService());
  };

  const isTackerOn = (): boolean => {
    if (
      currentTaskDetails.details?.id === task.id &&
      currentTaskDetails.taskStatus === TrackerStatus.START
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <ListItem
        className={`${classes.projectDetailsContainer} ${
          isTackerOn() ? classes.activeProject : ''
        }`}
        onClick={handleProjectCardClick}
      >
        <ListItemAvatar className={classes.startIconContainer}>
          <IconButton
            className={`${classes.projectStartButtonContainer} ${
              isTackerOn() ? 'full-opacity' : ''
            }`}
          >
            {currentTaskDetails.taskStatus === TrackerStatus.START &&
            task?.id === currentTaskDetails?.details?.id ? (
              <Zoom in={true}>
                <Pause className={classes.projectStartArrow} />
              </Zoom>
            ) : (
              <Zoom in={true}>
                <PlayArrow className={classes.projectStartArrow} />
              </Zoom>
            )}
          </IconButton>
        </ListItemAvatar>
        <ListItemText>
          <Box className={classes.projectName}>
            <Typography
              color={isTackerOn() ? 'textPrimary' : 'textSecondary'}
              sx={{
                paddingRight: '0px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {task.title}
            </Typography>
          </Box>
        </ListItemText>
        <ListItemText
          sx={{
            width: '90px',
          }}
        >
          <TaskTimer task={currentTaskDetails} taskId={task.id as string} />
        </ListItemText>
      </ListItem>
      {/* {showListDivider() ? <Divider variant="inset" component="li" /> : null} */}
      {true ? <Divider variant="inset" component="li" /> : null}
    </>
  );
};

export default TaskCard;
