import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';

// reducer for image uplaod using react reducer
function uploadReducer(state, action) {
  switch (action.type) {
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: false, errorUpload: '' };

    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };

    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}

// from this page the none admin users can view their user profile to make changes and update it
// changes like name, email address and etc
function Profile() {
  // using the reducer set above for the image upload
  const [{ loading, error, loadingUpload }, uploadDispatch] = useReducer(
    uploadReducer,
    {
      loading: true,
      error: '',
    },
  );

  // when i logout, the userInfo.isAdmin throws an undefined error && i try to fix this with useState
  const [isUserAdmin, setIsUserAdmin] = useState(false); // fixed the error

  // getting the userInfo from the state of the react context from the Store.js
  const { state, dispatch } = useContext(Store);

  // console.log('The userInfo', state.userInfo);

  // defining the variables from useForm from react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },

    // setting back the values of the users information to each field with this hook
    setValue,
  } = useForm();

  // setting up notistack notification by destructuring the enqeuesnackbar and closesnackbar properties from the usesnackbar according to the documentation.
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

  // Css
  const classes = useStyles();

  const { userInfo } = state;

  // this makes sure that only a logged in user can access this page
  useEffect(() => {
    // check if userInfo exists
    if (!userInfo) {
      // if not, redirect to login page
      return router.push('/login');
    }
    // if userInfo exists
    setValue('name', userInfo.name);
    setValue('email', userInfo.email);
    setValue('image', userInfo.image);

    setIsUserAdmin(userInfo.isAdmin);
  }, []);

  console.log('searching for admin: ', isUserAdmin);

  // function that handles the image upload to Cloudinary
  const uploadHandler = async (event) => {
    const file = event.target.files[0];

    // define a new form data
    const bodyFormData = new FormData();

    // append the new file to the form data
    bodyFormData.append('file', file);

    // send an ajax request
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });

      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data', // multipart file system allows file upload through ajax request
          authorization: `Bearer ${userInfo.token}`,
        },
      });

      dispatch({ type: 'UPLOAD_SUCCESS' });

      // populate the image field with the url from cloudinary
      setValue('image', data.secure_url); // from cloudinary

      enqueueSnackbar('File upload was successful', { variant: 'success' });
    } catch (err) {
      // the upload request was not successful

      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  // function that handles the form submission for user profile update
  const submitHandler = async ({
    name,
    email,
    image,
    password,
    confirmPassword,
  }) => {
    closeSnackbar();
    // prevent default
    // event.preventDefault();

    if (password !== confirmPassword) {
      enqueueSnackbar("passwords doesn't match", { variant: 'error' });
      return;
    }

    // send an ajax post request with the user information
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          image,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } },
      );

      // save the data we got from the backend here to the react context
      dispatch({ type: 'USER_LOGIN', payload: data });

      // after dispatching the above action then we set the cookies with the user information
      Cookies.set('userInfo', JSON.stringify(data));

      // success message
      enqueueSnackbar('Profile Update Was Successful', {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title="Profile">
      <section className={classes.allPagesPadding}>
        <Typography component="h1" variant="h1">
          You Can Edit Your Profile {/* Maybe not needed	 */}
        </Typography>

        <Grid container spacing={1}>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <NextLink href="/profile" passHref>
                  <ListItem selected button component="a">
                    <ListItemText primary="User Profile"></ListItemText>
                  </ListItem>
                </NextLink>

                <NextLink href="/order-history" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Order History"></ListItemText>
                  </ListItem>
                </NextLink>
              </List>
            </Card>
          </Grid>

          {/* Main profile information */}
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    Your Profile
                  </Typography>
                </ListItem>

                <ListItem>
                  <form
                    onSubmit={handleSubmit(submitHandler)}
                    className={classes.form}
                  >
                    <List>
                      {/* User's Name */}
                      <ListItem>
                        <Controller
                          name="name"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                            minLength: 2,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="name"
                              label="Name"
                              inputProps={{ type: 'name' }}
                              error={Boolean(errors.name)}
                              helperText={
                                errors.name // errors exists or not
                                  ? errors.name.type === 'minLength' // is it a pattern error?
                                    ? 'Name length should not be less than 2 characters'
                                    : 'Name is required' // else is a required error
                                  : '' // else there are no errors
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/* Show option for image upload only if admin */}

                      {isUserAdmin ? (
                        <ListItem>
                          {/* product's Image */}
                          <ListItem>
                            <Controller
                              name="image"
                              control={control}
                              defaultValue=""
                              rules={{
                                // validations
                                required: true,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  id="image"
                                  label="Image"
                                  error={Boolean(errors.image)}
                                  helperText={
                                    errors.image // errors exists or not
                                      ? 'Image is required'
                                      : ''
                                  }
                                  /* onChange={(event) => setName(event.target.value)} */
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>

                          {/* Image uplaod to cloudinary */}
                          <ListItem>
                            <Button variant="contained" component="label">
                              Upload File
                              <input
                                type="file"
                                onChange={uploadHandler}
                                hidden
                              />
                            </Button>

                            {loadingUpload && <CircularProgress />}
                          </ListItem>
                        </ListItem>
                      ) : (
                        []
                      )}

                      <ListItem>
                        <Controller
                          name="email"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                            pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="email"
                              label="Email"
                              inputProps={{ type: 'email' }}
                              error={Boolean(errors.email)}
                              helperText={
                                errors.email // errors exists or not
                                  ? errors.email.type === 'pattern' // is it a pattern error?
                                    ? 'Email is invalid'
                                    : 'Email is required' // else is a required error
                                  : '' // else there are no errors
                              }
                              /* onChange={(event) => setEmail(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/*User's Password */}
                      <ListItem>
                        <Controller
                          name="password"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            // rules(when the password is empty, then don't change if not other password rules apply. must be 8 and above)
                            validate: (value) =>
                              value === '' ||
                              value.length > 7 ||
                              'Password length should be 8 and above',
                          }}
                          // rendering the input element and the error messages in case there is one
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="password"
                              label="Password"
                              inputProps={{ type: 'password' }}
                              error={Boolean(errors.password)}
                              helperText={
                                errors.password // errors exists or not
                                  ? 'Password must be 8 character and above'
                                  : '' // else there are no errors
                              }
                              /* onChange={(event) => setPassword(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/*User's confirm Password */}
                      <ListItem>
                        <Controller
                          name="confirmPassword"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            validate: (value) =>
                              value === '' ||
                              value.length > 7 ||
                              'Confirm Password length should be 8 and above',
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="confirmPassword"
                              label="Confirm Password"
                              inputProps={{ type: 'password' }}
                              error={Boolean(errors.confirmPassword)}
                              helperText={
                                errors.password // errors exists or not
                                  ? 'Confirm Password must be 8 character and above'
                                  : '' // else there are no errors
                              }
                              /* onChange={(event) => setPassword(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      <ListItem>
                        <Button
                          variant="contained"
                          type="submit"
                          fullWidth
                          color="primary"
                        >
                          Update
                        </Button>
                      </ListItem>
                    </List>
                  </form>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </section>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
