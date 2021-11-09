import {
  Button,
  Card,
  CardContent,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';

// ######################
// component start
export default function ProductScreen(props) {
  const router = useRouter();

  // getting the react context from useContext
  const { state, dispatch } = useContext(Store);

  // getting the product from the props from getServerSideProps
  const { product } = props;

  const classes = useStyles();

  if (!product) {
    return <div>Sorry, The Product Is Not Found</div>;
  }

  // console.log(product.image);
  // Add to cart handler function

  const addToCartHandler = async () => {
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

    // dispatching an action to the react context
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });

    // redirect user to the cart page

    router.push('/cart');
  };
  return (
    <Layout title={product.name} description={product.description}>
      <section>
        <div className={classes.section}>
          <NextLink href="/market" passHref>
            <Link>
              <Typography>Back To Shopping</Typography>
            </Link>
          </NextLink>
        </div>
        <Grid container spacing={1}>
          <Grid item md={6} xs={12}>
            <Image
              src={product.image}
              alt={product.name}
              width={640}
              height={640}
              layout="responsive"
            ></Image>
          </Grid>

          <Grid item md={3} xs={12}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  {product.name}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>Category: {product.category}</Typography>
              </ListItem>
              <ListItem>
                <Typography>Farm: {product.farmerName}</Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  Rating: {product.rating} stars ({product.numReviews} reviews)
                </Typography>
              </ListItem>
              <ListItem>
                <Typography> Description: {product.description}</Typography>
              </ListItem>
            </List>
          </Grid>

          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Price </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>€ {product.price}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Status </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>
                        {product.countInStock > 0 ? 'In Stock' : 'Unavailable'}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    align="center"
                    onClick={addToCartHandler}
                  >
                    Add To Cart
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
        <div>
          <Typography
            component="h1"
            variant="h1"
            className={classes.centerAligned}
          >
            Product Details
          </Typography>

          <Grid container spacing={1}>
            <Grid item md={3} xs={12}>
              <Card raised style={{ height: '100%' }}>
                <CardContent>
                  <List>
                    <ListItem>
                      <Typography>
                        <strong>Farmer Details</strong>
                      </Typography>
                    </ListItem>
                  </List>

                  <Typography variant="p" component="p">
                    {product.farmerName}
                  </Typography>

                  <Typography variant="p" component="p">
                    {product.address}
                  </Typography>

                  <Typography variant="p" component="p">
                    {product.postCode}, {product.city}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item md={3} xs={12}>
              <Card raised style={{ height: '100%' }}>
                <CardContent>
                  <List>
                    <ListItem>
                      <Typography>
                        <strong>What is in the Box</strong>
                      </Typography>
                    </ListItem>
                  </List>

                  <Typography variant="p" component="p">
                    {product.contains.split(',').map((item) => (
                      <Typography key={item}>{item},</Typography>
                    ))}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item md={3} xs={12}>
              <Card raised style={{ height: '100%' }}>
                <CardContent>
                  <List>
                    <ListItem>
                      <Typography>
                        <strong>Diet Type</strong>
                      </Typography>
                    </ListItem>
                  </List>

                  <Typography variant="p" component="p">
                    {product.dietType.split(',').map((item) => (
                      <Typography key={item}>{item},</Typography>
                    ))}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item md={3} xs={12}>
              <Card raised style={{ height: '100%' }}>
                <CardContent>
                  <List>
                    <ListItem>
                      <Typography>
                        <strong>Package Type</strong>
                      </Typography>
                    </ListItem>
                  </List>

                  <Typography variant="p" component="p">
                    {product.packaging}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item md={3} xs={12}>
              <Card raised style={{ height: '100%' }}>
                <CardContent>
                  <List>
                    <ListItem>
                      <Typography>
                        <strong>Farming Method</strong>
                      </Typography>
                    </ListItem>
                  </List>

                  <Typography variant="p" component="p">
                    {product.farmingMethod.split(',').map((item) => (
                      <Typography key={item}>{item},</Typography>
                    ))}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>

        <div>
          <Typography
            component="h1"
            variant="h1"
            className={classes.centerAligned}
          >
            Recipe Suggestion
          </Typography>

          <Typography component="p" variant="p">
            This is the suggestion of what you can cook with the farm produce
            contained in this box
          </Typography>

          <Grid container spacing={1}>
            <Grid item md={12} xs={12}>
              <Card>
                <CardContent>
                  <Typography component="p" variant="p">
                    {product.recipe}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </section>
    </Layout>
  );
}

// ###################
// Get product from the backend / database

export async function getServerSideProps(context) {
  // getting the context object params.. check!
  const { params } = context;

  // getting the slug out of the params
  const { slug } = params;

  // connecting to DB database;
  await db.connect();

  // Getting the products from the database;
  // we use lean object from mongoose to transform
  // the data back to a javascript object just like
  // JSON.stringify because mongoose always returns
  // Mongoose document from the database.
  const product = await Product.findOne({ slug }).lean();

  // disconnect from the database
  await db.disconnect();

  return {
    props: {
      // calling the convert to doc function on each product that is returned from the database
      // and pass the value to the products
      // this stops the id errors from this function
      // because of the mongo document model.
      product: db.convertDocToObj(product),
    },
  };
}
