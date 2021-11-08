import bcrypt from 'bcryptjs';
import nc from 'next-connect';
import User from '../../../models/user';
import { signToken } from '../../../utils/auth';
import db from '../../../utils/db';

const handler = nc();

// this api returns any user we have in our database to the front end that has the email address that is contained in the request.body.email object
handler.post(async (req, res) => {
  // connecting to the mongoDB database
  await db.connect();

  // this will return a single user that matches the email address that is being received from the request header,
  const user = await User.findOne({ email: req.body.email });

  // disconnect from database after finding the user
  await db.disconnect();

  // check if the user exists and the password matches with the email
  // the password is encrypted by bcrypt so getting the password require that we compare it with the one that bcrypt encrypted.

  // compare the encrypted password from the database with the plain password from the user from the frontend.

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    // if the above condition is true then we need
    // to use the user information to generate a
    // token that will then be the login session token using jwt

    const token = signToken(user);

    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSiteAdmin: user.isSiteAdmin,
    });
  } else {
    res.status(401).send({ message: '✋🏻 Invalid Email or password' });
  }
});

export default handler;
