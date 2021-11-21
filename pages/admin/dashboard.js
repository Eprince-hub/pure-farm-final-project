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
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useReducer } from 'react';
import { Bar } from 'react-chartjs-2';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';

// on this page i am fetching all the orders of the user from the database and displaying them
// to the user

// defining the reducer function for the react useReducer hook with each cases
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function AdminDashboard() {
  // getting the userInfo from the state of the react context from the Store.js
  const { state } = useContext(Store);

  const router = useRouter();

  // Css
  const classes = useStyles();

  const { userInfo } = state;

  console.log('User Info from Dashboard: ', userInfo);

  // defining the react reducer => parameters for useReducer: reducer function and default values
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: '',
  });

  console.log('Sales Data: ', summary.salesData);

  // this makes sure that only a logged in user can access this page
  useEffect(() => {
    // check if userInfo exists
    if (!userInfo) {
      // if not, redirect to login page
      router.push('/login');

      // if the userInfo is available but not an admin then redirect to the user's profile
    } else if (!userInfo.isAdmin) {
      router.push('/profile');
    }

    // fetching the order information from the database
    const fetchData = async () => {
      try {
        // use the reducer hook to dispatch this information
        dispatch({ type: 'FETCH_REQUEST' }); // reducer hook

        // making the api call to fetch the data
        const { data } = await axios.get(`/api/admin/summary`, {
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
    <Layout title="Admin Dashboard">
      <section>
        <Typography component="h1" variant="h1">
          Admin Dashboard {/* Maybe not needed	 */}
        </Typography>

        <Grid container spacing={1}>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <NextLink href="/admin/dashboard" passHref>
                  <ListItem selected button component="a">
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
                  <ListItem button component="a">
                    <ListItemText primary="Users"></ListItemText>
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
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <Typography className={classes.error}>{error}</Typography>
                  ) : (
                    <Grid container spacing={5}>
                      <Grid item md={3}>
                        <Card raised>
                          <CardContent>
                            <Typography variant="h1" component="h1">
                              € {summary.ordersPrice}
                            </Typography>

                            <Typography>Sales</Typography>
                          </CardContent>

                          <CardActions>
                            <NextLink
                              href="/admin/sales"
                              color="primary"
                              passHref
                            >
                              <Button size="small" color="primary">
                                View Sales
                              </Button>
                            </NextLink>
                          </CardActions>
                        </Card>
                      </Grid>

                      <Grid item md={3}>
                        <Card raised>
                          <CardContent>
                            <Typography variant="h1" component="h1">
                              {summary.ordersCount}
                            </Typography>

                            <Typography>Orders</Typography>
                          </CardContent>

                          <CardActions>
                            <NextLink
                              href="/admin/orders"
                              color="primary"
                              passHref
                            >
                              <Button size="small" color="primary">
                                View Orders
                              </Button>
                            </NextLink>
                          </CardActions>
                        </Card>
                      </Grid>

                      <Grid item md={3}>
                        <Card raised>
                          <CardContent>
                            <Typography variant="h1" component="h1">
                              {summary.productsCount}
                            </Typography>

                            <Typography>Products</Typography>
                          </CardContent>

                          <CardActions>
                            <NextLink
                              href="/admin/products"
                              color="primary"
                              passHref
                            >
                              <Button size="small" color="primary">
                                View Products
                              </Button>
                            </NextLink>
                          </CardActions>
                        </Card>
                      </Grid>

                      <Grid item md={3}>
                        <Card raised>
                          <CardContent>
                            <Typography variant="h1" component="h1">
                              {summary.usersCount}
                            </Typography>

                            <Typography>Users</Typography>
                          </CardContent>

                          <CardActions>
                            <NextLink
                              href="/admin/users"
                              color="primary"
                              passHref
                            >
                              <Button size="small" color="primary">
                                View Users
                              </Button>
                            </NextLink>
                          </CardActions>
                        </Card>
                      </Grid>
                    </Grid>
                  )}
                </ListItem>

                <ListItem>
                  <Typography component="h1" variant="h1">
                    Daily Sales Chart
                  </Typography>
                </ListItem>

                <ListItem>
                  <Bar
                    data={{
                      labels: summary.salesData.map((data) => data._id),
                      datasets: [
                        {
                          label: 'Daily Sales',
                          backgroundColor: 'rgba(0, 43, 43, 1)',
                          data: summary.salesData.map(
                            (data) => data.totalSales,
                          ),
                        },
                      ],
                    }}
                    options={{
                      legend: { display: true, position: 'right' },
                    }}
                  ></Bar>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </section>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
