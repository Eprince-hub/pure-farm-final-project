import nc from 'next-connect';
import Product from '../../../../../models/Product';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import db from '../../../../../utils/db';

const handler = nc();

handler.use(isAdmin, isAuth);

handler.get(async (req, res) => {
  await db.connect();

  const product = await Product.findById(req.query.id);

  console.log('Products from API: ', product);

  console.log('ID OF THE PRODUCT: ', req.query.id);

  await db.disconnect();

  res.send(product);
});

export default handler;
