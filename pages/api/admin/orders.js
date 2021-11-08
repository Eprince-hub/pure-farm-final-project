import nc from 'next-connect';
import Order from '../../../models/Order';
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

  // getting the orders from the database and also the information of the user that created the order
  const orders = await Order.find({}).populate('user', 'name'); // get the user information

  await db.disconnect();

  res.send(orders);
});

export default handler;
