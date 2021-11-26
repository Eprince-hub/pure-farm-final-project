import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';

function PlaceOrder() {
  // Css
  const classes = useStyles();

  const router = useRouter();
  // getting state from useContext and passing in the Store to get access to get access to the
  // react context in the utils/Store
  const { state, dispatch } = useContext(Store);

  // Getting the cart items from state
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;

  // Prices calculations
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // convert to 2 decimal point(123.4567) to (123.46)

  const itemsPrice = round2(
    cartItems.reduce(
      (accumulator, currentItem) =>
        accumulator + currentItem.price * currentItem.quantity,
      0,
    ),
  );

  const shippingPrice = itemsPrice > 150 ? 0 : 5;

  const taxPrice = round2(itemsPrice * 0.1);

  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  // redirect the user back to the payment method if it doesn't exist
  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }

    // redirect back to the cart screen if the order have been placed and cart items deleted
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, []);

  // Function and setups that handles the place order action
  const [loading, setLoading] = useState(false);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  // this functions sends an api call to the order api at the backend to create the order
  // in the database
  const placeOrderHandler = async () => {
    closeSnackbar();

    try {
      setLoading(true);

      // sending an ajax request to the backend to create an order

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          // passing the token from the user to authorize this request
          headers: {
            authorization: `Bearer ${userInfo.token}`, // solved the unauthorized error
          },
        },
      );

      // dispatch an action to clear the Cart and make it empty again
      dispatch({ type: 'CART_CLEAR' });

      // Clear the cart items cookies from the browser
      Cookies.remove('cartItems');

      setLoading(false);

      // redirect user to the data summary page after placing order
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);

      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title="Place Order">
      <section className={classes.allPagesPadding}>
        <CheckoutWizard activeStep={3} />
        <Typography component="h1" variant="h1">
          Place Your Order
        </Typography>

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
                  {shippingAddress.fullName}, &nbsp; {shippingAddress.address},
                  &nbsp;
                  {shippingAddress.city}, &nbsp;{shippingAddress.postalCode},
                  &nbsp;
                  {shippingAddress.country}
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
                        {cartItems.map((cartItem) => (
                          <TableRow key={cartItem._id}>
                            {/* Table Image Cell */}
                            <TableCell>
                              <NextLink
                                href={`/product/${cartItem.slug}`}
                                passHref
                              >
                                <Link>
                                  <Image
                                    src={cartItem.image}
                                    alt={cartItem.name}
                                    width={50}
                                    height={50}
                                  ></Image>
                                </Link>
                              </NextLink>
                            </TableCell>

                            {/* Table name Cell */}

                            <TableCell>
                              <NextLink
                                href={`/product/${cartItem.slug}`}
                                passHref
                                /* Use this for the farmer to connect the farmer and their products : Idea */
                              >
                                <Link>
                                  <Typography>{cartItem.name}</Typography>
                                </Link>
                              </NextLink>
                            </TableCell>

                            {/* Table Quantity Cell */}
                            <TableCell align="right">
                              <Typography>{cartItem.quantity}</Typography>
                            </TableCell>

                            {/* Table cell for Price */}
                            <TableCell align="right">
                              <Typography>€{cartItem.price}</Typography>
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

                <ListItem>
                  <Button
                    onClick={placeOrderHandler}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Place Order
                  </Button>
                </ListItem>

                {/* setting the loading */}

                {loading && (
                  <ListItem>
                    <CircularProgress />
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      </section>
    </Layout>
  );
}

// setting es6 to true in .eslintrc file removed the error coming from using Promise.
// setting the cart page to a dynamic component and setting the ssr to false
// makes this component only renders on the client side because the cookie was giving errors
export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
