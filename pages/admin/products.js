import {
  Button,
  Card,
  CardActions,
  CardContent,
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
import React, { useContext, useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';

// on this page i am fetching all the products of the user from the database and displaying them
// to the user

// defining the reducer function for the react useReducer hook with each cases
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function Products() {
  // getting the userInfo from the state of the react context from the Store.js
  const { state } = useContext(Store);

  const router = useRouter();

  // Css
  const classes = useStyles();

  const { userInfo } = state;

  console.log('User Info from product Display: ', userInfo);

  // defining the react reducer => parameters for useReducer: reducer function and default values
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
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

    // fetching the product information from the database
    const fetchData = async () => {
      try {
        // use the reducer hook to dispatch this information
        dispatch({ type: 'FETCH_REQUEST' }); // reducer hook

        // making the api call to fetch the data
        const { data } = await axios.get(`/api/admin/products`, {
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

    // calling the fetchData function
    fetchData();
  }, []);

  return (
    <Layout title="Admin Product Display">
      <section>
        {/* <Typography component="h1" variant="h1">
          Admin Dashboard
        </Typography> */}

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
                  <ListItem selected button component="a">
                    <ListItemText primary="Products"></ListItemText>
                  </ListItem>
                </NextLink>
              </List>
            </Card>
          </Grid>

          {/* Main product information and content */}
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    Products
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
                            <TableCell>NAME</TableCell>
                            <TableCell>PRICE</TableCell>
                            <TableCell>CATEGORY</TableCell>
                            <TableCell>COUNT</TableCell>
                            <TableCell>RATING</TableCell>
                            <TableCell align="center">ACTIONS</TableCell>
                          </TableRow>
                        </TableHead>

                        {/* the table body */}
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product._id}>
                              <TableCell>
                                {product._id.substring(20, 24)}
                              </TableCell>

                              {/* This will display the user that made the particular product */}
                              <TableCell>{product.name}</TableCell>

                              <TableCell>€ {product.price}</TableCell>

                              <TableCell>{product.category}</TableCell>

                              <TableCell>{product.countInStock}</TableCell>

                              <TableCell>{product.rating}</TableCell>

                              <TableCell>
                                <NextLink
                                  href={`/admin/product/${product._id}`}
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

export default dynamic(() => Promise.resolve(Products), { ssr: false });
