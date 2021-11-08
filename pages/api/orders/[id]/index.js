import nc from 'next-connect';
import Order from '../../../../models/Order';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';

const handler = nc();
handler.use(isAuth);
handler.get(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  await db.disconnect();
  res.send(order);
});

export default handler;

// import nc from 'next-connect';
// import Order from '../../../../models/Order';
// import { isAuth } from '../../../../utils/auth';
// import db from '../../../../utils/db';

// const handler = nc();

// // request must be made by only authenticated users
// handler.use(isAuth);

// // this api returns the order that is being added to the cart by the order id
// handler.get(async (req, res) => {
//   // connecting to the mongoDB database
//   await db.connect();

//   // Using the order models created at the models folder which is a mongoose model.
//   const order = await Order.findById(req.query.id);

//   // disconnect from database after finding the orders
//   await db.disconnect();
//   res.send(order);
// });

// export default handler;

// // creating an api that will return the list of items from Database

// // next-connect creates routing and middleware for nextjs backend
