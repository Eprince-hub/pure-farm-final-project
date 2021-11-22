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

    // Reducer for creating a product
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };

    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };

    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

    // Reducer for deleting a product
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

function Products() {
  // getting the userInfo from the state of the react context from the Store.js
  const { state } = useContext(Store);

  const router = useRouter();

  // Css
  const classes = useStyles();

  const { userInfo } = state;

  console.log('User Info from product Display: ', userInfo);

  // defining the react reducer => parameters for useReducer: reducer function and default values
  const [
    {
      loading,
      error,
      products,
      loadingCreate /* new product */,
      successDelete,
      loadingDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
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

    // resetting the products information to reflect the new value after deletion
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });

      // prevents fetchData from running when not needed
    } else {
      // calling the fetchData function
      fetchData();
    }
  }, [successDelete]);

  const { enqueueSnackbar } = useSnackbar();

  // function that handles the creation of a new product
  const createProductHandler = async () => {
    // on click of the create product => prompt a user to confirm this action
    // as a sample product would be created and the user need to edit it to a personal specification
    if (
      !window.confirm(
        'You are about to create a product with pre-filled information - you will need to edit the information?',
      )
    ) {
      return;
    }

    try {
      // dispatch request context
      dispatch({ type: 'CREATE_REQUEST' });

      // making a post request
      const { data } = await axios.post(
        '/api/admin/products',
        {
          /* name and other information needed for the creation of the product*/
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        },
      );

      dispatch({ type: 'CREATE_SUCCESS' });

      enqueueSnackbar('The product was created successfully', {
        variant: 'success',
      });

      router.push(`/admin/product/${data.product._id}`);
    } catch (err) {
      // there is an error
      dispatch({ type: 'CREATE_FAIL' });

      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
    }
  };

  // function that handles the creation of a new product
  const deleteProductHandler = async (productId) => {
    // on click of the delete product => prompt a user to confirm this action
    // as a sample product would be deleted and the user need to edit it to a personal specification
    if (
      !window.confirm(
        'You are about to delete this product. This action can not be revised.',
      )
    ) {
      return;
    }

    try {
      // dispatch request context
      dispatch({ type: 'DELETE_REQUEST' });

      // making a post request
      await axios.delete(`/api/admin/products/${productId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });

      dispatch({ type: 'DELETE_SUCCESS' });

      enqueueSnackbar('The product was deleted successfully', {
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
    <Layout title="Admin Product Display">
      <section>
        <Typography component="h1" variant="h1">
          Products
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
                  <ListItem selected button component="a">
                    <ListItemText primary="Products"></ListItemText>
                  </ListItem>
                </NextLink>

                <NextLink href="/admin/users" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Users"></ListItemText>
                  </ListItem>
                </NextLink>
              </List>
            </Card>
          </Grid>

          {/* Main product information and content */}
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>{loadingDelete && <CircularProgress />}</ListItem>
                <Grid container spacing={1}>
                  <Grid item>
                    {/* create product with filled information */}
                    <ListItem>
                      <Card raised>
                        <Button
                          onClick={createProductHandler}
                          color="secondary"
                          variant="contained"
                        >
                          Create Quick Products
                        </Button>

                        {/* while creating a product,, load a spinner */}
                        {loadingCreate && <CircularProgress />}
                      </Card>
                    </ListItem>
                  </Grid>
                  <Grid item>
                    {/* Create product from scratch */}
                    <ListItem>
                      <Card raised>
                        <Button color="secondary" variant="contained">
                          Create Products
                        </Button>
                      </Card>
                    </ListItem>
                  </Grid>
                </Grid>
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
                                  onClick={() =>
                                    deleteProductHandler(product._id)
                                  }
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
