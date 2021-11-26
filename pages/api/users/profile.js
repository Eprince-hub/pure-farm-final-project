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
    (user.image = req.body.email
      ? req.body.email
      : 'https://i.imgur.com/8sggcBp.png'),
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

// This was working before i changed it to the above function to make sure that i catch any error that might occur

/* // This api would create a new user into the database based on the information that is coming from the register page on the front end
handler.post(async (req, res) => {
  // connecting to the mongoDB database
  await db.connect();

  // creating a new instance of the User model
  const newUser = new User({
    // passing all the information from the register page
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
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
  });
});

export default handler; */
