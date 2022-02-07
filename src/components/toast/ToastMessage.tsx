/* eslint-disable prettier/prettier */
import { Box } from '@mui/system';
import { Close, ErrorOutline } from '@mui/icons-material';
import { IconButton, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { trackerErrorsSelector } from 'redux/selectors/tracker';
import { trackerActions } from 'redux/features/tracker/trackerSlice';

const ToastMessage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const errros = useSelector(trackerErrorsSelector);

  const removeErrors = () => {
    dispatch(trackerActions.removeErrors({}));
  };

  return (
    <Box>
      {errros.length
        ? errros.map((error) => (
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                top: 0,
                alignItems: 'cneter',
                padding: '12px  20px !important',
                background: theme.palette.primary.main,
                color: 'white',
              }}
            >
              <Box
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="centere">
                  <ErrorOutline />
                  <Typography marginLeft={2}>{error.message}</Typography>
                </Box>
                <IconButton onClick={removeErrors}>
                  <Close
                    sx={{
                      color: theme.palette.background.paper,
                    }}
                    fontSize="medium"
                  />
                </IconButton>
              </Box>
            </Box>
          ))
        : null}
    </Box>
  );
};

export default ToastMessage;
