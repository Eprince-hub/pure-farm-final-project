// api end point would be: /api/products/:id/reviews
import mongoose from 'mongoose';
import nextConnect from 'next-connect';
import Product from '../../../../models/Product';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';

// create an instance of next connect
const handler = nextConnect({
  onError,
});

// api that returns all the reviews
handler.get(async (req, res) => {
  // connect to database
  await db.connect();

  // get the product
  const product = await Product.findById(req.query.id);

  // disconnect from database
  await db.disconnect();

  // found product? return the reviews
  if (product) {
    res.send(product.reviews);
  } else {
    res.status(404).send({ message: 'Product Is Not Available' });
  }
});

// api for creating reviews
handler.use(isAuth).post(async (req, res) => {
  await db.connect();

  const product = await Product.findById(req.query.id);

  if (product) {
    // check if the current user already created a review
    const existReviews = product.reviews.find(
      (review) => review.user == req.user._id,
    );

    // check if review already exists
    if (existReviews) {
      // review already exists? then update instead of creating new one
      await Product.updateOne(
        {
          _id: req.query.id,
          'reviews._id': existReviews._id,
        },
        {
          $set: {
            'reviews.$.comment': req.body.comment, // update fields with the info from frontend
            'reviews.$.rating': Number(req.body.rating), // update fields with the info from frontend
          },
        },
      );

      // update the rating information to the product properties
      const updatedProduct = await Product.findById(req.query.id);
      updatedProduct.numReviews = updatedProduct.reviews.length;

      updatedProduct.rating =
        updatedProduct.reviews.reduce((a, c) => c.rating + a, 0) /
        updatedProduct.reviews.length;

      await updatedProduct.save();

      await db.disconnect();
      return res.send({ message: 'You Updated Your Review' });
    } else {
      // User haven't create a review? create a new review and connect the user id to the review
      const review = {
        user: mongoose.Types.ObjectId(req.user._id),
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };

      product.reviews.push(review); // push created review to the lists of reviews in the product

      // Update the product review counter numReviews
      product.numReviews = product.reviews.length;

      // update the product ratings:
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;

      await product.save(); // save all changes to database
      await db.disconnect();

      res.status(201).send({ message: 'Your review have been submitted' });
    }
  } else {
    // no product information found
    await db.disconnect();

    res.status(404).send({ message: "Can't find product" });
  }
});

export default handler;
