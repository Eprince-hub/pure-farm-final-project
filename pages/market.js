import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import axios from 'axios';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import Layout from '../components/Layout';
import MarketHero from '../components/MarketHero';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';

// Using the grid component from material UI
// The grid parent is called Container and it can take spaces and other props
// the grid items are called card and
// the cardActionArea inside the card will be clickable areas.
// cardMedia = image

export default function Market(props) {
  const router = useRouter();

  // getting the react context from useContext
  const { state, dispatch } = useContext(Store);
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

  const classes = useStyles();
  const { products } = props;
  return (
    <Layout title="Market">
      <section className={classes.homePageProductsStyle}>
        <div>
          <MarketHero />
        </div>
        <div>
          <Typography
            variant="h3"
            align="center"
            className={classes.productPageHeader}
          >
            Pure Farm Market
          </Typography>
        </div>
        <div className={classes.productDisplayContainer}>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item md={4} key={product.id}>
                <Card raised style={{ height: '100%' }}>
                  <NextLink href={`/product/${product.slug}`} passHref>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        image={product.image}
                        title={product.name}
                      ></CardMedia>
                      <CardContent>
                        <Typography>{product.name}</Typography>

                        <Rating value={product.rating} readOnly></Rating>
                      </CardContent>
                    </CardActionArea>
                  </NextLink>

                  <CardActions>
                    <Typography>€{product.price}</Typography>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => addToCartHandler(product)}
                    >
                      Collect Box
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </section>
    </Layout>
  );
}

// ###################
// Get product from the backend / database

export async function getServerSideProps() {
  // connecting to DB database;
  await db.connect();

  // Getting the products from the database;
  // we use lean object from mongoose to transform
  // the data back to a javascript object just like
  // JSON.stringify because mongoose always returns
  // Mongoose document from the database.
  const products = await Product.find({}, '-reviews').lean();

  // disconnect from the database
  await db.disconnect();

  return {
    props: {
      // calling the convert to doc function on each product that is returned from the database
      // and pass the value to the products
      // this stops the id errors from this function
      // because of the mongo document model.
      products: products.map(db.convertDocToObj),
    },
  };
}
