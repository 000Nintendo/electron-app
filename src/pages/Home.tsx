/* eslint-disable import/no-duplicates */
/* eslint-disable import/extensions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, Person } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { useFormik } from 'formik';
import {
  fireBaseAuthService,
  IUserValues,
} from 'firebase/services/authService';
import * as Yup from 'yup';
import { AuthMessages } from 'firebase/utils/enums';
import { useDispatch } from 'react-redux';
import { userActions } from 'redux/features/users/userSlice';
import { useHistory } from 'react-router';
import localStorageServices from 'services/localStorage';

const useStyles = makeStyles({
  lognInTitle: {},
  form: {
    maxWidth: 450,
    flex: 1,
    padding: 40,
    borderRadius: '15px !important',
  },
  inputField: {
    marginBottom: `20px !important`,
    color: '#494a60 !important',
    '& .MuiInputBase-root': {
      borderRadius: '30px !important',
    },
  },
  loginButton: {
    background: '#ff414b !important',
    borderRadius: '30px !important',
    height: '59px !important',
    padding: '14px !important',
    fontWeight: `700 !important`,
    fontSize: `1.1rem !important`,
    marginBottom: '30px !important',
  },
  logoContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    minHeight: 200,
  },
  logoImage: {
    width: '200px !important',
  },
  inputRoot: {
    borderRadius: '30px !important',
  },
});

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email!')
    .required('Please enter valid email address!'),
  password: Yup.string()
    .min(6, 'Password is too short'!)
    .required('Please enter valid password!'),
});

const Home = () => {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (values: IUserValues) => {
    setLoading(true);
    setErrors([]);
    const res = await fireBaseAuthService.signInUser(values);
    if (res?.user) {
      dispatch(userActions.setUser(res?.user ?? {}));
      dispatch(userActions.getUserDetails({ userId: res.user.user.uid }));
      localStorageServices.storeUserDetails(res.user);
      history.push('/tracker');
    }

    if (res.error) {
      if (res.error.name === AuthMessages.FIREBASE_ERROR) {
        const _errors: string[] = [];
        if (res.error.code === AuthMessages.WRONG_PASSWORD) {
          _errors.push('Password is wrong!');
        }
        if (res.error.code === AuthMessages.INVALID_EMAIL) {
          _errors.push('You entered wrong email!');
        }
        if (res.error.code === AuthMessages.USER_NOT_FOUND) {
          _errors.push('User not found!');
        }
        if (res.error.code === AuthMessages.INTERNAL_ERROR) {
          _errors.push('Internal server error!');
        }
        setErrors(_errors);
      }
    }
    setLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: handleSubmit,
    validationSchema: LoginSchema,
    validateOnMount: false,
    validateOnChange: false,
  });

  const handleClickShowPassword = () => {
    showPassword ? setShowPassword(false) : setShowPassword(true);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const removeError = (index: number) => {
    const __errors = errors.filter((_err, idx) => idx !== index);
    setErrors(__errors);
  };

  return (
    <Box minHeight={400} minWidth={500}>
      <form onSubmit={formik.handleSubmit}>
        <Box className={classes.form} component={Paper}>
          <Box className={classes.logoContainer}>
            <img
              src="/images/writ-labs-logo.png"
              alt=""
              className={classes.logoImage}
            />
          </Box>
          <Typography
            variant="h3"
            component="h1"
            className={classes.lognInTitle}
            fontWeight={700}
            marginBottom={4}
            textAlign="center"
            color="textPrimary"
          >
            Log in
          </Typography>

          <TextField
            type="email"
            name="email"
            fullWidth
            color="primary"
            className={classes.inputField}
            onBlur={formik.handleBlur}
            classes={{
              root: classes.inputRoot,
            }}
            error={
              Boolean(formik.touched.email) && Boolean(formik.errors.email)
            }
            helperText={
              Boolean(formik.touched.email) &&
              Boolean(formik.errors.email) &&
              formik.errors.email
            }
            onChange={formik.handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility">
                    <Person />
                  </IconButton>
                </InputAdornment>
              ),
              placeholder: 'Email',
              sx: {
                paddingLeft: 1.5,
              },
            }}
          />

          <TextField
            name="password"
            type={showPassword ? 'text' : 'password'}
            className={classes.inputField}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            helperText={
              Boolean(formik.touched.password) &&
              Boolean(formik.errors.password) &&
              formik.errors.password
            }
            error={
              Boolean(formik.touched.password) &&
              Boolean(formik.errors.password)
            }
            fullWidth
            classes={{
              root: classes.inputRoot,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              placeholder: 'Password',
              sx: {
                paddingLeft: 1.5,
              },
            }}
          />

          {errors.length ? (
            <Box marginBottom={2}>
              {errors.map((error, index) => (
                <Alert
                  severity="error"
                  key={index}
                  onClose={() => removeError(index)}
                  sx={{
                    borderRadius: 30,
                  }}
                >
                  {error}
                </Alert>
              ))}
            </Box>
          ) : null}

          <Button
            type="submit"
            className={classes.loginButton}
            fullWidth
            sx={{
              textTransform: 'none',
            }}
            variant="contained"
          >
            {!loading ? (
              'Sign in'
            ) : (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress size="2rem" color="inherit" />
              </Box>
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Home;
