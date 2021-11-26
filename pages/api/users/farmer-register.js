import bcrypt from 'bcryptjs';
import nc from 'next-connect';
import User from '../../../models/User';
import { signToken } from '../../../utils/auth';
import db from '../../../utils/db';

const handler = nc();

// This api would create a new user into the database based on the information that is coming from the register page on the front end
handler.post(async (req, res) => {
  try {
    // connecting to the mongoDB database
    await db.connect();

    // creating a new instance of the User model
    const newUser = new User({
      // passing all the information from the register page
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
      isAdmin: true,
      isSiteAdmin: false, // added this to make me accessible to some information
      image: req.body.image
        ? req.body.image
        : 'https://i.imgur.com/8sggcBp.png',
    });

    // saving the new created user to the database by calling the save object property of mongoose
    const user = await newUser.save();

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
