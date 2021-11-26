// utility function for user authentication

import jwt from 'jsonwebtoken';

// function that signs the user session token using jwt
const signToken = (user) => {
  return jwt.sign(
    // first parameter : the user information
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSiteAdmin: user.isSiteAdmin,
      image: user.image,
    },

    // second parameter: the jwt secrete
    process.env.JWT_SECRET,

    // third parameter: is an object that contains the options for the sign in tokens

    {
      expiresIn: '30d',
    },
  );
};

// This function is being used on the  api to authenticate the user before
// accessing the information they shouldn't
const isAuth = async (req, res, next) => {
  // get the authorization from the request header
  const { authorization } = req.headers;

  if (authorization) {
    // authorization exists
    // get the token from the authorization => Bearer token

    const token = authorization.slice(7, authorization.length); // returns only the token

    // verify the token with JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      // after the compare check if an error exists

      if (err) {
        // token is not valid then emit this error message
        res.status(401).send({ message: 'Unauthorized Request' });
      } else {
        req.user = decode; // contains all the user information, id, names,email, etc

        // calling next pushes the program to start the next middleware or function

        next();
      }
    });
  } else {
    // No token was supplied by the post request.
    res.status(401).send({ message: 'Invalid request!, Not allowed' });
  }
};

// This function is being used on the  api to authenticate the user before
// accessing the information they shouldn't
const isAdmin = async (req, res, next) => {
  // if the user is an admin
  if (req.user.isAdmin) {
    // call the next function
    next();
  } else {
    // The user is not an admin.
    res.status(401).send({ message: 'User is not permitted' });
  }
};

// This function is being used on the  api to authenticate the user before
// accessing the information they shouldn't
const isSiteAdmin = async (req, res, next) => {
  // if the user is an admin
  if (req.user.isSiteAdmin) {
    // call the next function
    next();
  } else {
    // The user is not an admin.
    res.status(401).send({ message: 'User is not permitted' });
  }
};

export { isAdmin, isAuth, isSiteAdmin, signToken };