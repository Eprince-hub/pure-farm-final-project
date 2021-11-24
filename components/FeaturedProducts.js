import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Link,
  Typography,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import Image from 'next/image';
import NextLink from 'next/link';
import React from 'react';
import Carousel from 'react-material-ui-carousel';
import useStyles from '../utils/styles';

export default function FeaturedProducts({ featuredProducts }) {
  // css
  const classes = useStyles();

  return (
    <div className={classes.carouselComponent}>
      <Typography component="h2" variant="h2">
        Featured Products
      </Typography>

      <Carousel className={classes.componentTopMargin} animation="slide">
        {featuredProducts.map((featuredProduct) => (
          <Card
            raised
            key={featuredProduct._id}
            className={classes.carouselCard}
          >
            <NextLink
              className={classes.carouselNextLink}
              key={featuredProduct._id}
              href={`/product/${featuredProduct.slug}`}
              passHref
            >
              {/*  <Link>
                <Image
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className={classes.featuredImage}
                  width={400}
                  height={400}
                ></Image>
              </Link> */}

              <CardActionArea className={classes.carouselCardArea}>
                <CardMedia
                  className={classes.carouselImage}
                  component="img"
                  image={featuredProduct.image}
                  title={featuredProduct.name}
                ></CardMedia>
                <CardContent>
                  <Typography>{featuredProduct.name}</Typography>

                  <Rating value={featuredProduct.rating} readOnly></Rating>
                </CardContent>
              </CardActionArea>
            </NextLink>
          </Card>
        ))}
      </Carousel>
    </div>
  );
}

/*


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


*/
