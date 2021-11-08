import nc from 'next-connect';
import Product from '../../../models/Product';
import { isAdmin, isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';

// if any error exists, no access to the handler
const handler = nc({
  onError,
});

// making sure that only an authorized user and must be an admin that can access this information
// this middleware was defined in auth.js in utils
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();

  const Products = await Product.find({});

  await db.disconnect();

  res.send(Products);
});

export default handler;
