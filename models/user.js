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
    image: { type: String, required: true },
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
