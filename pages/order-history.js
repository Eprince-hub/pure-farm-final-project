import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
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
import React, { useContext, useEffect, useReducer } from 'react';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';

// on this page i am fetching all the orders of the user from the database and displaying them
// to the user

// defining the reducer function for the react useReducer hook with each cases
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

function OrderHistory() {
  // getting the userInfo from the state of the react context from the Store.js
  const { state } = useContext(Store);

  const router = useRouter();

  // Css
  const classes = useStyles();

  const { userInfo } = state;

  // defining the react reducer => parameters for useReducer: reducer function and default values
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  // this makes sure that only a logged in user can access this page
  useEffect(() => {
    // check if userInfo exists
    if (!userInfo) {
      // if not, redirect to login page
      router.push('/login');
    }

    // fetching the order information from the database
    const fetchOrders = async () => {
      try {
        // use the reducer hook to dispatch this information
        dispatch({ type: 'FETCH_REQUEST' }); // reducer hook

        // making the api call to fetch the orders
        const { data } = await axios.get(`/api/orders/history`, {
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

    // calling the fetchOrders function
    fetchOrders();
  }, []);

  return (
    <Layout title="Order History">
      <section>
        <Typography component="h1" variant="h1">
          Your Order History {/* Maybe not needed	 */}
        </Typography>

        <Grid container spacing={1}>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <NextLink href="/profile" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="User Profile"></ListItemText>
                  </ListItem>
                </NextLink>

                <NextLink href="/Order History" passHref>
                  <ListItem selected button component="a">
                    <ListItemText primary="Order History"></ListItemText>
                  </ListItem>
                </NextLink>
              </List>
            </Card>
          </Grid>

          {/* Main order information and content */}
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    Order History
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
                        {/* table header here */}
                        <TableHead>
                          <TableRow>
                            {/* columns */}
                            <TableCell>ID</TableCell>
                            <TableCell>DATE</TableCell>
                            <TableCell>TOTAL</TableCell>
                            <TableCell>PAYMENT STATUS</TableCell>
                            <TableCell>DELIVERY STATUS</TableCell>
                            <TableCell align="center">ACTION</TableCell>
                          </TableRow>
                        </TableHead>

                        {/* the table body */}
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order._id}>
                              <TableCell>
                                {order._id.substring(20, 24)}
                              </TableCell>

                              <TableCell>{order.createdAt}</TableCell>

                              <TableCell>€ {order.totalPrice}</TableCell>

                              <TableCell>
                                {order.isPaid
                                  ? `Paid At ${order.paidAt}`
                                  : 'Not Paid'}
                              </TableCell>

                              <TableCell>
                                {order.isDelivered
                                  ? `Delivery Started on ${order.isDelivered}`
                                  : 'Not Delivered'}
                              </TableCell>

                              <TableCell>
                                <NextLink href={`/order/${order._id}`} passHref>
                                  <Button
                                    style={{
                                      textAlign: 'center',
                                    }}
                                    variant="contained"
                                    color="secondary"
                                  >
                                    Order Detail
                                  </Button>
                                </NextLink>
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

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });

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

function OrderHistory() {
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
    <Layout title="Order History">
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
                  <ListItemText primary="Order History"></ListItemText>
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
                  Order History
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

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false }); */
