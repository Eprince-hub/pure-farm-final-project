import nc from 'next-connect';
import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = nc();

// this api returns all the products categories to the frontend
handler.get(async (req, res) => {
  // connecting to the mongoDB database
  await db.connect();

  // getting the categories from all the products
  const categories = await Product.find().distinct('category');
  // distinct => will get only the category property of the products and distills multiple

  // disconnect from database after finding the products
  await db.disconnect();
  res.send(categories);
});

export default handler;
