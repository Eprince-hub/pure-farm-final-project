import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { Pagination } from '@material-ui/lab';
import Rating from '@material-ui/lab/Rating';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';

const PAGE_SIZE = 3;

// prices search ranges
const prices = [
  {
    name: '€1 to €10',
    value: '1-10',
  },

  {
    name: '€11 to €25',
    value: '11-25',
  },

  {
    name: '€26 to €45',
    value: '26-45',
  },

  {
    name: '€46 to €60',
    value: '46-60',
  },

  {
    name: '€61 to €80',
    value: '61-80',
  },

  {
    name: '€81 to €100',
    value: '81-100',
  },

  {
    name: '€101 to €250',
    value: '101-250',
  },

  {
    name: '€260 to €500',
    value: '260-500',
  },
];

const ratings = [1, 2, 3, 4, 5];

export default function Search(props) {
  // css
  const classes = useStyles();

  // getting the react context from useContext
  const { state, dispatch } = useContext(Store);

  const router = useRouter();

  // deconstruct all the values i need from the router query
  const {
    query = 'all',
    category = 'all',
    farmerName = 'all',
    price = 'all',
    rating = 'all',
    sort = 'featured',
  } = router.query;

  // deconstruct the values from the backend from the props
  const { products, countProducts, categories, farmerNames, pages } = props;

  // function handling the categories
  const filterSearch = ({
    page,
    category,
    farmerName,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
  }) => {
    // get the part from the router
    const path = router.pathname;

    // get the query
    const { query } = router;

    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (farmerName) query.farmerName = farmerName;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;

    // redirect to the generated values
    router.push({
      pathname: path,
      query: query,
    });
  };

  const categoryHandler = (event) => {
    filterSearch({ category: event.target.value });
  };

  const pageHandler = (event, page) => {
    filterSearch({ page });
  };

  const farmerNameHandler = (event) => {
    filterSearch({ farmerName: event.target.value });
  };

  const sortHandler = (event) => {
    filterSearch({ sort: event.target.value });
  };

  const priceHandler = (event) => {
    filterSearch({ price: event.target.value });
  };

  const ratingHandler = (event) => {
    filterSearch({ rating: event.target.value });
  };

  // function for adding item to the cart
  const addToCartHandler = async (product) => {
    // Getting the current quantity of the item
    const existItem = state.cart.cartItems.find(
      (item) => item._id === product._id,
    );

    const quantity = existItem ? existItem.quantity + 1 : 1; // dispatching an action to the react context

    // Getting the product from the backend using axios
    const { data } = await axios.get(`/api/products/${product._id}`);

    // checking if product is in stock before adding to the cart
    if (data.countInStock < quantity) {
      window.alert('Sorry, product is out of stock');
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity: quantity },
    });

    // redirect user to the cart page

    router.push('/cart');
  };

  console.log(query.page);
  return (
    <Layout title="Search">
      <section className={classes.allPagesPadding}>
        <Grid className={classes.componentTopMargin} container spacing={1}>
          <Grid item md={3}>
            <List>
              {/* categories */}
              <ListItem>
                <Box className={classes.fullWidth}>
                  <Typography>Categories</Typography>

                  <Select fullWidth value={category} onChange={categoryHandler}>
                    <MenuItem value="all">All</MenuItem>
                    {categories &&
                      categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
              </ListItem>

              {/* Farmers name */}
              <ListItem>
                <Box className={classes.fullWidth}>
                  <Typography>Farm Name</Typography>

                  <Select
                    fullWidth
                    value={farmerName}
                    onChange={farmerNameHandler}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {farmerNames &&
                      farmerNames.map((farmerName) => (
                        <MenuItem key={farmerName} value={farmerName}>
                          {farmerName}
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
              </ListItem>

              {/* Prices */}
              <ListItem>
                <Box className={classes.fullWidth}>
                  <Typography>Prices</Typography>

                  <Select fullWidth value={price} onChange={priceHandler}>
                    <MenuItem value="all">All</MenuItem>
                    {prices &&
                      prices.map((price) => (
                        <MenuItem key={price.value} value={price.value}>
                          {price.name}
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
              </ListItem>

              {/* Ratings */}
              <ListItem>
                <Box className={classes.fullWidth}>
                  <Typography>Ratings</Typography>

                  <Select fullWidth value={rating} onChange={ratingHandler}>
                    <MenuItem value="all">All</MenuItem>
                    {ratings &&
                      ratings.map((rating) => (
                        <MenuItem key={rating} value={rating}>
                          <Rating value={rating} readOnly />
                          <Typography component="span">&amp; Above</Typography>
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
              </ListItem>
            </List>
          </Grid>

          <Grid item md={9}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                {products.length === 0 ? 'No' : countProducts} Results
                {query !== 'all' && query !== '' && ' : ' + query}
                {category !== 'all' && ' : ' + category}
                {farmerName !== 'all' && ' : ' + farmerName}
                {price !== 'all' && ' : Price ' + price}
                {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                {(query !== 'all' && query !== '') ||
                category !== 'all' ||
                farmerName !== 'all' ||
                rating !== 'all' ||
                price !== 'all' ? (
                  <Button onClick={() => router.push('/search')}>
                    <CancelIcon />
                  </Button>
                ) : null}
              </Grid>

              {/* sort */}
              <Grid item>
                <Typography component="span" className={classes.sort}>
                  Sort by
                </Typography>
                <Select value={sort} onChange={sortHandler}>
                  <MenuItem value="featured">Featured</MenuItem>
                  <MenuItem value="lowest">Price: Low to High</MenuItem>
                  <MenuItem value="highest">Price: High to Low</MenuItem>
                  <MenuItem value="toprated">Customer Reviews</MenuItem>
                  <MenuItem value="newest">Newest Arrivals</MenuItem>
                </Select>
              </Grid>
            </Grid>

            <Grid className={classes.componentTopMargin} container spacing={3}>
              {products.map((product) => (
                <Grid item md={4} key={product.name}>
                  <ProductItem
                    product={product}
                    addToCartHandler={addToCartHandler}
                  />
                </Grid>
              ))}
            </Grid>

            <Pagination
              className={classes.componentTopMargin}
              defaultPage={parseInt(query.page || '1')}
              count={pages}
              onChange={pageHandler}
            ></Pagination>
          </Grid>
        </Grid>
      </section>
    </Layout>
  );
}

// getting the server side props
export async function getServerSideProps({ query }) {
  // connect to database
  await db.connect();

  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || '';
  const farmerName = query.farmerName || '';
  const price = query.price || '';
  const rating = query.rating || '';
  const sort = query.sort || '';
  const searchQuery = query.query || '';

  console.log('page query: ', query.page);
  console.log('from backend: ', query);
  console.log('the page: ', page);

  // create the filter criterias
  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i', // case insensitive
          },
        }
      : {};

  const categoryFilter = category && category !== 'all' ? { category } : {};

  const farmerNameFilter =
    farmerName && farmerName !== 'all' ? { farmerName } : {};

  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};

  const priceFilter =
    price && price !== 'all'
      ? {
          // get the price that is greater than the first price and less than the second price
          price: {
            // 20 - 60
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};

  // sorting the products depending on different criteria

  const order =
    sort === 'featured'
      ? { featured: -1 }
      : sort === 'lowest'
      ? { price: 1 }
      : sort === 'highest'
      ? { price: -1 }
      : sort === 'toprated'
      ? { rating: -1 }
      : sort === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };

  const categories = await Product.find().distinct('category');
  const farmerNames = await Product.find().distinct('farmerName');

  // getting the set filters from the database
  const productDocs = await Product.find(
    {
      ...queryFilter,
      ...categoryFilter,
      ...farmerNameFilter,
      ...ratingFilter,
      ...priceFilter,
    },
    '-reviews', // no reviews information needed
  )
    .sort(order) // sort the information based on the above defined order
    .skip(pageSize * (page - 1)) // pagination
    .limit(pageSize) // limit based on page size
    .lean(); // convert to pure javascript

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...farmerNameFilter,
    ...ratingFilter,
    ...priceFilter,
  });

  // disconnect
  await db.disconnect();

  const products = productDocs.map(db.convertDocToObj);

  return {
    props: {
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
      farmerNames,
    },
  };
}
