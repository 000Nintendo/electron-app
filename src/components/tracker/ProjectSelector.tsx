import { Autocomplete, FormControl, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { IProjectDto } from 'firebase/interfaces/projects';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { projectActions } from 'redux/features/projects/projectSlice';
import { taskActions } from 'redux/features/tasks/taskSlice';
import { currentProjectSelector } from 'redux/selectors/projects';
import { userDetailsSelector } from 'redux/selectors/users/users';

const ProjectSelector = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector(userDetailsSelector);
  const currentProject = useSelector(currentProjectSelector);
  const [selectedProject, setSelectedProject] = useState<IProjectDto | null>(
    null
  );

  const handleProjectSelection = (_e: any, project: IProjectDto | null) => {
    setSelectedProject(project);
    dispatch(projectActions.setCurrentProject(project as IProjectDto));
    dispatch(
      projectActions.getCurrentProjectDetails({
        projectId: project?.id as string,
      })
    );
    dispatch(taskActions.getTaskList(project as IProjectDto));
  };

  useEffect(() => {
    if (currentProject) {
      setSelectedProject(currentProject);
    }
  }, [currentProject]);

  return (
    <Box color="textPrimary">
      <FormControl
        sx={{
          width: '100%',
          marginBottom: 4,
          '& .MuiSelect-icon': {
            marginRight: 1,
          },
        }}
      >
        <Autocomplete
          fullWidth
          value={selectedProject}
          options={userDetails.data?.projects ?? []}
          onChange={handleProjectSelection}
          getOptionLabel={(option) => option.project_name}
          sx={{
            '& .MuiInputBase-root': {
              borderRadius: 30,
              paddingLeft: 2,
            },
            '& .MuiAutocomplete-endAdornment': {
              right: '15px !important',
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Select project"
              fullWidth
            />
          )}
        />
      </FormControl>
    </Box>
  );
};

export default ProjectSelector;
