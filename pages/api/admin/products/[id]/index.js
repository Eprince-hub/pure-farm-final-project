import nc from 'next-connect';
import Product from '../../../../../models/Product';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import db from '../../../../../utils/db';

const handler = nc();

// this error took me approximately about 5 hours to figure out. I have this authentication middleware like this => handler.use(isAdmin, isAuth); and i was getting a failed request error with status code 500 and a response with isAdmin undefined. So now i realized that the problem was that the authentication have to place first before the user can be checked for being an admin or not. so having this authentication middleware like this => handler.use(isAuth, isAdmin); solved my five hours of agony. thanks console.log

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();

  const product = await Product.findById(req.query.id);

  console.log('Products from API: ', product);

  console.log('ID OF THE PRODUCT: ', product);

  await db.disconnect();

  res.send(product);
});

export default handler;
