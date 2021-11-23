import nc from 'next-connect';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';

const handler = nc();

// this api returns the product that is being added to the cart by the product id
handler.get(async (req, res) => {
  // connecting to the mongoDB database
  await db.connect();

  // Using the product models created at the models folder which is a mongoose model.
  const product = await Product.findById(req.query.id);

  // disconnect from database after finding the products
  await db.disconnect();
  res.send(product);
});

export default handler;

// creating an api that will return the list of items from Database

// next-connect creates routing and middleware for nextjs backend
