import nc from 'next-connect';
import Product from '../../models/Product';
import User from '../../models/user';
import data from '../../utils/data';
import db from '../../utils/db';

// here we will seed some data to the database as it is currently empty.

const handler = nc();

handler.get(async (req, res) => {
  // connecting to the mongoDB database
  await db.connect();

  // the products in the product model need to be deleted before seeding a new product to the database using the product model
  await Product.deleteMany(); // deletes everything first

  // now new product should be inserted
  await Product.insertMany(data.products);

  // the users in the user model need to be deleted before seeding a new user to the database using the user model
  await User.deleteMany(); // deletes everything first

  // now new user should be inserted
  await User.insertMany(data.users);

  // disconnect from database after finding the products
  await db.disconnect();
  res.send({ message: 'seeded successfully' });
});

export default handler;

// creating an api that will return the list of items from Database
