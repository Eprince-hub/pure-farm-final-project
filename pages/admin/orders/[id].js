import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useReducer } from 'react';
import Layout from '../../../components/Layout';
import { getError } from '../../../utils/error';
import { Store } from '../../../utils/Store';
import useStyles from '../../../utils/styles';

// defining the reducer function for the react useReducer hook with each cases
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };

    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };

    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };

    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };

    // The delivery status cases

    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };

    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };

    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };

    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: '',
      };
    default:
      state;
  }
}

function OrderDeliver({ params }) {
  // getting the orderId from the params
  const orderId = params.id;

  // using the reducer hook from paypal
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  // Css
  const classes = useStyles();

  const router = useRouter();

  // getting state from useContext and passing in the Store to get access to get access to the
  // react context in the utils/Store
  const { state } = useContext(Store);

  // Getting the userInfo from state
  const { userInfo } = state;

  // getting undefined from the paymentMethod here, when refreshed even though value present in the cookies but not here
  // console.log('States: ', state);

  // console.log('payment method from order: ', paymentMethod);

  // defining the react reducer => parameters for useReducer: reducer function and default values
  const [
    { loading, error, order, successPay, loadingDeliver, successDeliver },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  // get all information from order by deconstructing order object after we fetch it from the database using the api
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  // redirect the user back to the login page if user info is undefined (means not authenticated)
  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }

    if (!userInfo.isAdmin) {
      return router.push('/profile');
    }

    // fetching the order information from the database
    const fetchOrder = async () => {
      try {
        // use the reducer hook to dispatch this information
        dispatch({ type: 'FETCH_REQUEST' }); // reducer hook

        const { data } = await axios.get(`/api/orders/${orderId}`, {
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

    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      // order coming from reducer
      // calling the function

      fetchOrder();

      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }

      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    } else {
      // implementing paypal payment action
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        // loading the paypal payment screen by dispatching the action
        // setting the client id for paypal
        paypalDispatch({
          type: 'resetOptions', // bc we have access to clientId we use this to change it
          value: {
            'client-id': clientId, // clientId going to come from the backend
            currency: 'EUR',
          },
        });

        // loading paypal script from paypal website.
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };

      loadPaypalScript();
    }
  }, [order, successPay, successDeliver]);

  const { enqueueSnackbar } = useSnackbar();

  // function for controlling the delivery status of the orders
  async function deliverOrderHandler() {
    try {
      // do something
      dispatch({ type: 'DELIVER_REQUEST' });

      // ajax request to update the order information on the backend
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        },
      );

      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      enqueueSnackbar('The Order Has Been Delivered', {
        variant: 'success',
      });
      // enqueueSnackbar('Order is paid', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  }

  return (
    <Layout title={`Oder Detail Id: ${orderId}`}>
      <section className={classes.allPagesPadding}>
        <Typography component="h1" variant="h1">
          Order Id: {orderId}
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography className={classes.error}>{error}</Typography>
        ) : (
          <Grid container spacing={1}>
            <Grid item md={9} xs={12}>
              {/* Shipping Information Material Ui Card */}
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography component="h2" variant="h2">
                      Shipping Address
                    </Typography>
                  </ListItem>

                  <ListItem>
                    {shippingAddress.fullName}, &nbsp; {shippingAddress.address}
                    , &nbsp;
                    {shippingAddress.city}, &nbsp;{shippingAddress.postalCode},
                    &nbsp;
                    {shippingAddress.country}
                  </ListItem>

                  <ListItem>
                    Status:{' '}
                    {isDelivered
                      ? `delivered at ${deliveredAt}`
                      : 'not delivered'}
                  </ListItem>
                </List>
              </Card>

              {/* payment method Material Ui Card */}
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography component="h2" variant="h2">
                      Payment Method
                    </Typography>
                  </ListItem>

                  <ListItem>{paymentMethod}</ListItem>

                  <ListItem>
                    Status: {isPaid ? `paid at ${paidAt}` : 'not paid'}
                  </ListItem>
                </List>
              </Card>

              {/* product details Material Ui Card */}
              <Card className={classes.section}>
                {' '}
                <List>
                  <ListItem>
                    <Typography component="h2" variant="h2">
                      Order Items
                    </Typography>
                  </ListItem>

                  <ListItem>
                    <TableContainer>
                      <Table>
                        {/* Table Header From Material UI */}
                        <TableHead>
                          <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                          </TableRow>
                        </TableHead>

                        {/* Table Body From Material UI*/}
                        <TableBody>
                          {orderItems.map((orderItem) => (
                            <TableRow key={orderItem._id}>
                              {/* Table Image Cell */}
                              <TableCell>
                                <NextLink
                                  href={`/product/${orderItem.slug}`}
                                  passHref
                                >
                                  <Link>
                                    <Image
                                      src={orderItem.image}
                                      alt={orderItem.name}
                                      width={50}
                                      height={50}
                                    ></Image>
                                  </Link>
                                </NextLink>
                              </TableCell>

                              {/* Table name Cell */}

                              <TableCell>
                                <NextLink
                                  href={`/product/${orderItem.slug}`}
                                  passHref
                                  /* Use this for the farmer to connect the farmer and their products : Idea */
                                >
                                  <Link>
                                    <Typography>{orderItem.name}</Typography>
                                  </Link>
                                </NextLink>
                              </TableCell>

                              {/* Table Quantity Cell */}
                              <TableCell align="right">
                                <Typography>{orderItem.quantity}</Typography>
                              </TableCell>

                              {/* Table cell for Price */}
                              <TableCell align="right">
                                <Typography>€{orderItem.price}</Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </ListItem>
                </List>
              </Card>
            </Grid>

            {/* Order Summary Material Ui Card */}
            <Grid item md={3} xs={12}>
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography variant="h2">Oder Summary</Typography>
                  </ListItem>
                  {/* Items Price */}
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Items:</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography align="right">€{itemsPrice}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  {/* Tax Price */}
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Tax:</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography align="right">€{taxPrice}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  {/* Shipping Price */}
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Shipping:</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography align="right">€{shippingPrice}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  {/* Total Price */}
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>
                          <strong>Total:</strong>
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography align="right">
                          <strong>€{totalPrice}</strong>
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>

                  {/* conditional rendering of the buttons */}

                  {userInfo.isAdmin && !isPaid && (
                    /* !userInfo.isAdmin ?  */ <ListItem>
                      {isPending ? (
                        <CircularProgress />
                      ) : (
                        <div className={classes.fullWidth}>
                          <ListItem>
                            <NextLink href="/admin/orders" passHref>
                              <Button
                                variant="contained"
                                fullWidth
                                component="a"
                                color="primary"
                              >
                                Back To Orders
                              </Button>
                            </NextLink>
                          </ListItem>
                        </div>
                      )}
                    </ListItem>
                  )}

                  {userInfo.isAdmin && isPaid && !isDelivered && (
                    <ListItem>
                      {loadingDeliver && <CircularProgress />}

                      <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        onClick={deliverOrderHandler}
                      >
                        Mark As Delivered
                      </Button>
                    </ListItem>
                  )}

                  {userInfo.isAdmin && isDelivered && isPaid && (
                    <ListItem>
                      <NextLink href="/admin/orders" passHref>
                        <Button
                          variant="contained"
                          fullWidth
                          component="a"
                          color="primary"
                        >
                          Back To Dashboard
                        </Button>
                      </NextLink>
                    </ListItem>
                  )}
                </List>
              </Card>
            </Grid>
          </Grid>
        )}
      </section>
    </Layout>
  );
}

// getting the orderId from the database in other to get the ordered items.
export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

// setting es6 to true in .eslintrc file removed the error coming from using Promise.
// setting the cart page to a dynamic component and setting the ssr to false
// makes this component only renders on the client side because the cookie was giving errors
export default dynamic(() => Promise.resolve(OrderDeliver), { ssr: false });
