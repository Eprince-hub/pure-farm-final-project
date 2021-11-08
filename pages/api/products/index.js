import nc from 'next-connect';
import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = nc();

// this api returns all the products we have in our database to the front end
handler.get(async (req, res) => {
  // connecting to the mongoDB database
  await db.connect();

  // Using the product models created at the models folder which is a mongoose model.
  const products = await Product.find({});

  // disconnect from database after finding the products
  await db.disconnect();
  res.send(products);
});

export default handler;

// creating an api that will return the list of items from Database

// next-connect creates routing and middleware for nextjs backend
