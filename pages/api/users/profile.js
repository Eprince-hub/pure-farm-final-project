import bcrypt from 'bcryptjs';
import nc from 'next-connect';
import User from '../../../models/User';
import { isAuth, signToken } from '../../../utils/auth';
import db from '../../../utils/db';

const handler = nc();

// this api call allows the user to edit their profile

// Only a logged in and valid user would have access to this api call
handler.use(isAuth);

// This api would create a new user into the database based on the information that is coming from the register page on the front end
handler.put(async (req, res) => {
  try {
    // connecting to the mongoDB database
    await db.connect();

    // get the user from the database that matches the id on the request header
    const user = await User.findById(req.user._id);

    // update the user information with the information available from the request header
    user.name = req.body.name;
    user.email = req.body.email;
    (user.image = req.body.image
      ? req.body.image
      : 'https://res.cloudinary.com/fluema-digital/image/upload/v1637929538/farmer-avater_vncwey.png'),
      // to update password we need to make sure that we only update when the password is not an empty string

      (user.password = req.body.password
        ? bcrypt.hashSync(req.body.password)
        : user.password);

    // save the user back in the database
    await user.save();

    // disconnect from database after finding the user
    await db.disconnect();

    // using the user information to create a token using jwt
    const token = signToken(user);

    // information we are sending back to the frontend
    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSiteAdmin: user.isSiteAdmin,
      image: user.image,
    });
  } catch (error) {
    // console.log(error);
    res.status(401).send({ message: '😭😭😭Email already exists' });
  }
});

export default handler;
