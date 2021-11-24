import 'react-slideshow-image/dist/styles.css';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Slide } from 'react-slideshow-image';
import useStyles from '../utils/styles';

export default function FeaturedProductSlides({ featuredProducts }) {
  // css
  const classes = useStyles();

  const style = {
    textAlign: 'center',
    background: 'transparent',
    padding: '2rem 0.5rem',
    fontSize: '30px',
  };

  const properties = {
    duration: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    indicators: true,
  };

  return (
    <Card className={classes.carouselComponent}>
      <Typography component="h2" variant="h2">
        Featured Products
      </Typography>
      <div className={classes.carouselContainer}>
        <Slide {...properties}>
          {featuredProducts.map((featuredProduct) => (
            <div
              style={style}
              key={featuredProduct._id}
              className={classes.carouselInfoDiv}
            >
              <Card raised className={classes.carouselCard}>
                <NextLink
                  className={classes.carouselNextLink}
                  key={featuredProduct._id}
                  href={`/product/${featuredProduct.slug}`}
                  passHref
                >
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
            </div>
          ))}
        </Slide>
      </div>
    </Card>
  );
}
