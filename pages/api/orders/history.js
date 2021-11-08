import nc from 'next-connect';
import Order from '../../../models/Order';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';

// if any error exists, no access to the handler
const handler = nc({
  onError,
});

// making sure that only an authorized user can access this information
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  // getting the order of the current users
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
});

export default handler;
