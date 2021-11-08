import {
  Button,
  Card,
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
import React, { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';

// from this page the none admin users can view their user profile to make changes and update it
// changes like name, email address and etc
function Profile() {
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
  }, []);

  // function that handles the form submission for user profile update
  const submitHandler = async ({ name, email, password, confirmPassword }) => {
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
      <section>
        <Typography component="h1" variant="h1">
          Your Profile {/* Maybe not needed	 */}
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
                    Profile
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

                      <ListItem>
                        {/* Define the controller component that comes from the react-hook-form
              using the controller to wrap all our textField, but before it works we need to define the render property. and give it a function that will return the textField*/}
                        {/* User's Email */}
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

/* import {
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
import NexLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useReducer } from 'react';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function Profile() {
  const { state } = useContext(Store);
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);
  return (
    <Layout title="Profile">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NexLink href="/profile" passHref>
                <ListItem button component="a">
                  <ListItemText primary="User Profile"></ListItemText>
                </ListItem>
              </NexLink>
              <NexLink href="/order-history" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Profile"></ListItemText>
                </ListItem>
              </NexLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Profile
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>DATE</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAID</TableCell>
                          <TableCell>DELIVERED</TableCell>
                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>{order.createdAt}</TableCell>
                            <TableCell>${order.totalPrice}</TableCell>
                            <TableCell>
                              {order.isPaid
                                ? `paid at ${order.paidAt}`
                                : 'not paid'}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered
                                ? `delivered at ${order.deliveredAt}`
                                : 'not delivered'}
                            </TableCell>
                            <TableCell>
                              <NexLink href={`/order/${order._id}`} passHref>
                                <Button variant="contained">Details</Button>
                              </NexLink>
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
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false }); */
