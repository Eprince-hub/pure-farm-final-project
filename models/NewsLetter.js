import mongoose from 'mongoose';

// This is the database model for our newsletter

// creating the newsletter schema using mongoose
const newsLetterSchema = new mongoose.Schema(
  {
    // creating the structure of the database
    email: { type: String, required: true, unique: true },
  },
  {
    // this creates the time line with date created and updated.
    timestamps: true,
  },
);

// creating the newsletter model using the mongoose model
// if the value exists then save it ot the user variable,, if not create another model.
const NewsLetter =
  mongoose.models.NewsLetter || mongoose.model('NewsLetter', newsLetterSchema);

export default NewsLetter;

// ##############
/*

   id: 1,
      name: 'Food Box One',
      slug: 'food-box-one',
      category: 'Vegetables',
      image: '/images/box1.jpeg',
      price: 70,
      farm: 'farmer one',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description:
        'The food box contains the following items and they are sweet. and the farmer will suggest some recept for cooking what is inside the box',



*/
