import {
  Button,
  Card,
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
import dynamic from 'next/dynamic';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

function CartScreen() {
  const router = useRouter();
  // getting state from useContext and passing in the Store to get access to get access to the
  // react context in the utils/Store
  const { state, dispatch } = useContext(Store);

  // Getting the cart items from state
  const {
    cart: { cartItems },
  } = state;

  // function for updating the cart quantity
  async function updateCartHandler(cartItem, quantity) {
    // Getting the product from the backend using axios
    const { data } = await axios.get(`/api/products/${cartItem._id}`);

    // checking if product is in stock before adding to the cart
    if (data.countInStock < quantity) {
      window.alert('Sorry, product is out of stock');
      return;
    }
    // dispatching an action to the react context
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...cartItem, quantity } });
  }

  // function that deletes item from the cart Items.
  function removeItemHandler(cartItem) {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: cartItem });
  }

  // function that handles checkout and redirects the user to the login page
  // if not already logged in

  const checkoutHandler = () => {
    router.push('shipping');
  };

  return (
    <Layout title="Shopping Cart">
      <section>
        <Typography component="h1" variant="h1">
          Shopping Cart
        </Typography>

        {cartItems.length === 0 ? (
          <div>
            Cart is Empty.{' '}
            <NextLink href="/" passHref>
              <Link>Go Shopping</Link>
            </NextLink>
          </div>
        ) : (
          <Grid container spacing={1}>
            <Grid item md={9} xs={12}>
              <TableContainer>
                <Table>
                  {/* Table Header From Material UI */}
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>

                  {/* Table Body From Material UI*/}
                  <TableBody>
                    {cartItems.map((cartItem) => (
                      <TableRow key={cartItem._id}>
                        {/* Table Image Cell */}
                        <TableCell>
                          <NextLink href={`/product/${cartItem.slug}`} passHref>
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
                          <NextLink href={`/product/${cartItem.slug}`} passHref>
                            <Link>
                              <Typography>{cartItem.name}</Typography>
                            </Link>
                          </NextLink>
                        </TableCell>

                        {/* Table Quantity Cell */}
                        <TableCell align="right">
                          <Select
                            aria-label="Select value to increase the item quantity"
                            value={cartItem.quantity}
                            onChange={(event) =>
                              updateCartHandler(cartItem, event.target.value)
                            }
                          >
                            {/* Creating an array from countInStock and mapping them to display only the amount of items that is left on the stock*/}
                            {[...Array(cartItem.countInStock).keys()].map(
                              (x) => (
                                /* Making sure that the zero index doesn't show and we start
																counting from 1 */
                                <MenuItem key={x + 1} value={x + 1}>
                                  {x + 1}
                                </MenuItem>
                              ),
                            )}
                          </Select>
                        </TableCell>

                        {/* Table cell for Price */}
                        <TableCell align="right">€{cartItem.price}</TableCell>

                        {/* Table cell for action */}
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            color="secondary"
                            aria-label="Delete Item from Cart"
                            onClick={() => removeItemHandler(cartItem)}
                          >
                            X
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item md={3} xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Typography variant="h2">
                      Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                      Items) : €{' '}
                      {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                    </Typography>
                  </ListItem>

                  <ListItem>
                    <Button
                      onClick={checkoutHandler}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Check Out
                    </Button>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        )}
      </section>
    </Layout>
  );
}

// setting es6 to true in .eslintrc file removed the error coming from using Promise.
// setting the cart page to a dynamic component and setting the ssr to false
// makes this component only renders on the client side because the cookie was giving errors
export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
