import nc from 'next-connect';
import User from '../../../../models/User';
import { isAdmin, isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';

const handler = nc();

handler.use(isAuth, isAdmin);

// this handler returns back all the users there is in the database
handler.get(async (req, res) => {
  await db.connect();

  const users = await User.find({});

  await db.disconnect();

  res.send(users);
});

export default handler;
