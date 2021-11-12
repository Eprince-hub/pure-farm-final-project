import nc from 'next-connect';
import NewsLetter from '../../../models/newsLetter';
import db from '../../../utils/db';

const handler = nc();

// This api would create a new newsletter document in my database and submit this email address
handler.post(async (req, res) => {
  try {
    // connecting to the mongoDB database
    await db.connect();

    // creating a new instance of the User model
    const newNewsletter = new NewsLetter({
      // passing all the information from the register page

      email: req.body.email,
    });

    // saving the new created user to the database by calling the save object property of mongoose
    const newsLetter = await newNewsletter.save();

    // disconnect from database after finding the user
    await db.disconnect();

    // information we are sending back to the frontend
    res
      .status(200)
      .send({ message: 'Thanks for registering for our newsletter' });
  } catch (error) {
    // console.log(error);
    res.status(401).send({ message: 'It seems you are already registered' });
  }
});

export default handler;
