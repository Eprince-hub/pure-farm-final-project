import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import NextLink from 'next/link';
import React from 'react';

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <section>
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
    </section>
  );
}
