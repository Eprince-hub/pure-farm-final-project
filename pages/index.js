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
import { useContext, useEffect, useState } from 'react';
import CategoryNavigation from '../components/CategoryNavigation';
import FeaturedProductSlides from '../components/FeaturedProductSlides';
import HeroPage from '../components/HeroPage';
import LandingPageInfoDisplay from '../components/LandingPageInfoDisplay';
import Layout from '../components/Layout';
import Product from '../models/Product';
import User from '../models/user';
// import data from '../utils/data';
import db from '../utils/db';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';

// Using the grid component from material UI
// The grid parent is called Container and it can take spaces and other props
// the grid items are called card and
// the cardActionArea inside the card will be clickable areas.
// cardMedia = image

export default function Home(props) {
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
  const { products, featuredProducts } = props;

  // The code bellow fixed the window undefined error that i get when i render the carousel component here, it enables the component to load only when window becomes defined => fixed a 30 mins bug!.
  const [windowDefined, setWindowDefined] = useState(false);
  useEffect(() => {
    const defineWindow = () => {
      if (window === undefined) {
        return;
      } else {
        setWindowDefined(true);
      }
    };
    defineWindow();
  }, []);

  return (
    <Layout title="Home Page">
      <section className={classes.homePageProductsStyle}>
        <div>
          <HeroPage />
          <CategoryNavigation />
        </div>
        <div>
          <Typography
            variant="h3"
            align="center"
            className={classes.productPageHeader}
          >
            Fresh From Farm
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

        <div>
          {/* render this component only when window is defined,, => fixed window undefined error */}
          {windowDefined ? (
            <FeaturedProductSlides featuredProducts={featuredProducts} />
          ) : (
            []
          )}
        </div>

        <LandingPageInfoDisplay farmers={props.farmers ? props.farmers : []} />
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
  // const products = await Product.find({}, '-reviews').lean();
  const ratedProducts = await Product.find({}, '-reviews')
    .lean()
    .sort({ countInStock: -1, createdAt: -1 })
    .limit(6);

  // getting the featured products
  const featuredProducts = await Product.find({}, '-reviews')
    .lean()
    .sort({ rating: -1 })
    .limit(6);

  // console.log('featured products: ', featuredProducts);

  // getting the farmers information
  const farmers = await User.find({ isAdmin: true }).lean().limit(4);

  // disconnect from the database
  await db.disconnect();

  return {
    props: {
      // calling the convert to doc function on each product that is returned from the database
      // and pass the value to the products
      // this stops the id errors from this function
      // because of the mongo document model.
      products: ratedProducts.map(db.convertDocToObj),
      farmers: farmers.map(db.convertDocToObj),
      featuredProducts: featuredProducts.map(db.convertDocToObj),
    },
  };
}
