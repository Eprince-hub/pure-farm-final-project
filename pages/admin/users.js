import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';

// this page will be accessible only to the site Admin,, Have to fix this

// on this page i am fetching all the users of the user from the database and displaying them
// to the user

// defining the reducer function for the react useReducer hook with each cases
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: '' };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    // Reducer for deleting a user
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };

    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };

    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}

function Users() {
  // getting the userInfo from the state of the react context from the Store.js
  const { state } = useContext(Store);

  const router = useRouter();

  // Css
  const classes = useStyles();

  const { userInfo } = state;

  console.log('User Info from user Display: ', userInfo);

  // defining the react reducer => parameters for useReducer: reducer function and default values
  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: '',
    });

  // this makes sure that only a logged in user can access this page
  useEffect(() => {
    // check if userInfo exists
    if (!userInfo) {
      // if not, redirect to login page
      router.push('/login');

      // if the userInfo is available but not an admin then redirect to the user's profile
    } /* else if (!userInfo.isAdmin) {
      router.push('/profile');
    } */
    // Removed the above condition trying to fix error but it didn't,, will return it later

    // fetching the user information from the database
    const fetchData = async () => {
      try {
        // use the reducer hook to dispatch this information
        dispatch({ type: 'FETCH_REQUEST' }); // reducer hook

        // making the api call to fetch the data
        const { data } = await axios.get(`/api/admin/users`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        // dispatch successful fetch using the react context
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        // if request fails
        // dispatch error
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    // resetting the users information to reflect the new value after deletion
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });

      // prevents fetchData from running when not needed
    } else {
      // calling the fetchData function
      fetchData();
    }
  }, [successDelete]);

  const { enqueueSnackbar } = useSnackbar();

  // function that handles the creation of a new user
  const deleteUserHandler = async (userId) => {
    // on click of the delete user => prompt a user to confirm this action
    // as a sample user would be deleted and the user need to edit it to a personal specification
    if (
      !window.confirm(
        'You are about to delete this user. This action can not be revised.',
      )
    ) {
      return;
    }

    try {
      // dispatch request context
      dispatch({ type: 'DELETE_REQUEST' });

      // making a post request
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });

      dispatch({ type: 'DELETE_SUCCESS' });

      enqueueSnackbar('The user was deleted successfully', {
        variant: 'success',
      });
    } catch (err) {
      // there is an error
      dispatch({ type: 'DELETE_FAIL' });

      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
    }
  };

  return (
    <Layout title="Admin User Display">
      <section className={classes.allPagesPadding}>
        <Typography component="h1" variant="h1">
          Users
        </Typography>

        <Grid container spacing={1}>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <NextLink href="/admin/dashboard" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Farm Manager"></ListItemText>
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

          {/* Main user information and content */}
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography>Users</Typography>
                  {/* Check if to change position or remove */}
                </ListItem>

                <ListItem>{loadingDelete && <CircularProgress />}</ListItem>

                <ListItem>
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <Typography className={classes.error}>{error}</Typography>
                  ) : (
                    <TableContainer>
                      <Table>
                        {/* table header here */}
                        <TableHead>
                          <TableRow>
                            {/* columns */}
                            <TableCell>ID</TableCell>
                            <TableCell>NAME</TableCell>
                            <TableCell>EMAIL</TableCell>
                            <TableCell>TYPE</TableCell>
                            <TableCell align="center">ACTIONS</TableCell>
                          </TableRow>
                        </TableHead>

                        {/* the table body */}
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user._id}>
                              <TableCell>
                                {user._id.substring(20, 24)}
                              </TableCell>

                              {/* This will display the user that made the particular user */}
                              <TableCell>{user.name}</TableCell>

                              <TableCell>{user.email}</TableCell>

                              <TableCell>
                                {user.isAdmin ? 'Farmer' : 'User'}
                              </TableCell>

                              <TableCell>
                                <NextLink
                                  href={`/admin/user/${user._id}`}
                                  passHref
                                >
                                  <Button
                                    size="small"
                                    style={{
                                      textAlign: 'center',
                                    }}
                                    variant="contained"
                                    color="secondary"
                                  >
                                    Edit
                                  </Button>
                                </NextLink>{' '}
                                <Button
                                  onClick={() => deleteUserHandler(user._id)}
                                  size="small"
                                  style={{
                                    textAlign: 'center',
                                  }}
                                  variant="contained"
                                  color="secondary"
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </section>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Users), { ssr: false });
