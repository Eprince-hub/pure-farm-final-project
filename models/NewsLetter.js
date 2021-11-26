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
