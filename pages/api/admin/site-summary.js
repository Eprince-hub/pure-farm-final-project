import nc from 'next-connect';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import User from '../../../models/user';
import { isAuth, isSiteAdmin } from '../../../utils/auth';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';

// if any error exists, no access to the handler
const handler = nc({
  onError,
});

// making sure that only an authorized user and must be an admin that can access this information
// this middleware was defined in auth.js in utils
handler.use(isAuth, isSiteAdmin);

handler.get(async (req, res) => {
  await db.connect();

  // count all the Order document record in the database
  const ordersCount = await Order.countDocuments();

  // count all the products document record in the database
  const productsCount = await Product.countDocuments();

  // count all the users document record in the database
  const usersCount = await User.countDocuments();

  // using the aggregate function and group pipeline from mongoDb to count only the paid orders from
  // the order document
  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,

        // calculate sales by summing all the totalPrice property in the Order document
        sales: { $sum: '$totalPrice' },
      }, // object type => group / key = null groups all the records without any special key
    },
  ]); // accepts an array as parameter

  // if orderPriceGroup has  a value then save the sales of it to the ordersPrice variable
  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  // implementing the sales Data
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);

  await db.disconnect();

  res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
});

export default handler;
