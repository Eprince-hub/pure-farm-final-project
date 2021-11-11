import nc from 'next-connect';
import Order from '../../../../models/Order';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import onError from '../../../../utils/error';

const handler = nc({
  onError,
});
handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);

  // console.log('The Oder Info ID: ', order);

  // console.log('The query header: ', req.query);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };
    const paidOrder = await order.save();
    await db.disconnect();
    res.send({ message: 'order paid', order: paidOrder });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'order not found' });
  }
});

export default handler;

// import nc from 'next-connect';
// import Order from '../../../../models/Order';
// import { isAuth } from '../../../../utils/auth';
// import db from '../../../../utils/db';
// import onError from '../../../../utils/error';

// const handler = nc({
//   onError,
// });
// handler.use(isAuth);

// handler.put(async (req, res) => {
//   await db.connect();
//   const order = await Order.findById(req.query.id);

//   if (order) {
//     order.isPaid = true;
//     order.paidAt = Date.now;
//     order.paymentResult = {
//       id: req.body.id,
//       status: req.body.status,
//       email_address: req.body.email_address,
//     };

//     const paidOrder = await order.save();

//     await db.disconnect();
//     res.send({ message: 'Order Paid', order: paidOrder });
//   } else {
//     await db.disconnect();

//     res.status(404).send({ message: 'Order Not Valid' });
//   }
// });

// export default handler;

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
