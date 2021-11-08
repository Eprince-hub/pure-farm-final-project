import mongoose from 'mongoose';

// This is the database model for our users

// creating the users schema using mongoose
const userSchema = new mongoose.Schema(
  {
    // creating the structure of the database
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isSiteAdmin: { type: Boolean, required: false, default: false }, // might make it require
  },
  {
    // this creates the time line with date created and updated.
    timestamps: true,
  },
);

// creating the user model using the mongoose model
// if the value exists then save it ot the user variable,, if not create another model.
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

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
