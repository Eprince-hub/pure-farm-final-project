import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  TextareaAutosize,
  TextField,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Layout from '../../../components/Layout';
import { getError } from '../../../utils/error';
import { Store } from '../../../utils/Store';
import useStyles from '../../../utils/styles';

// The farmers can edit their users from the page
// creating the reducer for the user
function reducer(state, action) {
  switch (action.type) {
    // User fetch request reducer
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    // user update reducer

    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };

    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };

    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };

    default:
      return state;
  }
}

// The admin users / farmers in can view the users and call for a particular user edit from this component.

function UserEdit({ params }) {
  // getting the id from the params from serverside props
  const userId = params.id;

  // getting the userInfo from the state of the react context from the Store.js
  const { state } = useContext(Store);

  // using the reducer defined above
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    // default value
    loading: true,
    error: '',
  });

  // defining the variables from useForm from react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },

    // setting back the values of the users information to each field with this hook
    setValue,
  } = useForm();

  // defining state for isAdmin variables to check when the user is admin or not
  const [isAdmin, setIsAdmin] = useState(false);

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
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });

          const { data } = await axios.get(`/api/admin/users/${userId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });

          setIsAdmin(data.isAdmin);

          dispatch({ type: 'FETCH_SUCCESS' });

          // Setting the data for the user to be edited
          // this values will populate the edit form and enable edit.
          setValue('name', data.name);
        } catch (err) {
          // if there is an error

          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  // function that handles the form submission for the user update
  const submitHandler = async ({ name }) => {
    closeSnackbar();
    // prevent default
    // event.preventDefault(); // not needed because of react hook form

    // send an ajax post request with the user information
    try {
      dispatch({ type: 'UPDATE_REQUEST' });

      // update the user information
      await axios.put(
        `/api/admin/users/${userId}`,
        {
          name,
          isAdmin,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } },
      );

      dispatch({ type: 'UPDATE_SUCCESS' });

      // success message
      enqueueSnackbar('User Update Was Successful', {
        variant: 'success',
      });

      router.push('/admin/users');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  // The above submit handler function is also handling the update of the user information after it has been created from the users.js folder with createUserHandler on that page.
  // i will try to make it better by creating a separate user creation page where the farmer can create their user from scratch

  return (
    <Layout title={`Edit User ${userId}`}>
      <section>
        <Typography component="h1" variant="h1">
          Edit Your User Information {/* Maybe not needed	 */}
        </Typography>

        <Grid container spacing={1}>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <NextLink href="/admin/dashboard" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Admin Dashboard"></ListItemText>
                  </ListItem>
                </NextLink>

                <NextLink href="/admin/orders" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Orders"></ListItemText>
                  </ListItem>
                </NextLink>

                <NextLink href="/admin/products" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Products"></ListItemText>
                  </ListItem>
                </NextLink>

                <NextLink href="/admin/users" passHref>
                  <ListItem selected button component="a">
                    <ListItemText primary="Users"></ListItemText>
                  </ListItem>
                </NextLink>
              </List>
            </Card>
          </Grid>

          {/* Main user Edit information */}
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    Edit User {userId}
                  </Typography>
                </ListItem>

                <ListItem>
                  {loading && <CircularProgress />}
                  {error && (
                    <Typography className={classes.error}> {error}</Typography>
                  )}
                </ListItem>

                <ListItem>
                  <form
                    onSubmit={handleSubmit(submitHandler)}
                    className={classes.form}
                  >
                    <List>
                      {/* user's Name */}
                      <ListItem>
                        <Controller
                          name="name"
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
                              id="name"
                              label="Name"
                              error={Boolean(errors.name)}
                              helperText={
                                errors.name // errors exists or not
                                  ? 'Name is required'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      <ListItem>
                        <FormControlLabel
                          label={isAdmin ? 'Farmer' : 'User'}
                          control={
                            <Checkbox
                              onClick={(event) =>
                                setIsAdmin(event.target.checked)
                              }
                              checked={isAdmin}
                              name="isAdmin"
                            />
                          }
                        ></FormControlLabel>
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

                        {loadingUpdate && <CircularProgress />}
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

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false });
