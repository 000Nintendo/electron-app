/* eslint-disable react/no-array-index-key */
/* eslint-disable prettier/prettier */
import { Typography, List } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
// import { IProjectDto } from 'firebase/interfaces/projects';
import { useSelector } from 'react-redux';
// import { taskActions } from 'redux/features/tasks/taskSlice';
// import { currentProjectSelector } from 'redux/selectors/projects';
import { currentProjectTasksSelector } from 'redux/selectors/tasks';
import TaskCard from './TaskCard';

const useStyles = makeStyles({
  projectList: {
    width: '100%',
    overflowY: 'auto',
    height: 250,
    marginBottom: 20,
    '@media (max-height: 750px)': {
      height: 240,
      marginTop: '5px !important',
    },
    '&::-webkit-scrollbar': {
      width: 5,
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#d7d7d7',
      borderRadius: '5px !important',
      backgroundClip: 'padding-box !important',
      transition: 'background-color 0.2s ease',
      border: '1px solid rgba(0, 0, 0, 0)',
      '&:hover': {
        background: '#c1c1c1',
      },
    },
  },
});

const TasksList = () => {
  // const dispatch = useDispatch();
  const classes = useStyles();
  const currenProjectTasks = useSelector(currentProjectTasksSelector);
  // const currentProject = useSelector(currentProjectSelector);
  console.log(currenProjectTasks);

  return (
    <>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            sx={{ padding: '5px 20px', marginTop: 2.5 }}
            color="textPrimary"
          >
            Tasks
          </Typography>
        </Box>
        <Box className={classes.projectList}>
          <List>
            {currenProjectTasks.list.map((task) => (
              <TaskCard key={task.id} task={task as any} />
            ))}
          </List>
        </Box>
      </Box>
    </>
  );
};

export default TasksList;
