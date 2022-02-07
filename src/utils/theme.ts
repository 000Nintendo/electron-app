/* eslint-disable prettier/prettier */
import { createTheme } from '@mui/material';

const themeOtions = {
  palette: {
    primary: {
      main: '#ff414b',
    },
    secondary: {
      main: '#f50057',
    },
    text: {
      primary: '#2e2f46',
      secondary: '#494a60',
    },
  },
};

const muiTheme = createTheme(themeOtions);

export default muiTheme;
