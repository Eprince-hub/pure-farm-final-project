import nc from 'next-connect';
import Order from '../../../models/Order';
import { isAuth } from '../../../utils/auth';
import db, { onError } from '../../../utils/db';

// api for creating the orders

const handler = nc({ onError }); // onError would handle any error that occurs while creating the order => eg payment method is undefined

// Implementing a middleware using the handler from the next-connect to make sure
// that only an authenticated user would be able to make the post request
// to create the order in our database.

handler.use(isAuth);

// Api for creating orders in the database
handler.post(async (req, res) => {
  // Connect to the mongoDB database
  await db.connect();

  // also use this function to add the farmers id to the products they are creating!!
  const newOrder = new Order({
    // Takes everything that is included in the body of the request
    ...req.body,
    user: req.user._id, // info coming from the user we defined in the Auth file req.user = decode;
  });

  // save the orders to the database
  const order = await newOrder.save();

  res.status(201).send(order); // try to use statusCode later on all status

  // disconnect from MongoDB database
  // await db.disconnect();
});

export default handler;

// creating an api that will return the list of items from Database

// next-connect creates routing and middleware for nextjs backend
