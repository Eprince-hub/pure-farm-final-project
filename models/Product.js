import mongoose from 'mongoose';

// The schema for the reviews
const reviewSchema = new mongoose.Schema(
  {
    // connecting the review with the person that created it.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // user information
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    comment: { type: String, required: true },
  },
  {
    // this creates the time line with date created and updated.
    timestamps: true,
  },
);

// This is the database model for our products

// creating the product schema using mongoose
const productSchema = new mongoose.Schema(
  {
    // This is the schema that connected the user to the product they are creating
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // }, // type => object id from mongoose // commented out for error

    // creating the structure of the database
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    farmerName: { type: String, required: true },
    farmingMethod: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postCode: { type: String, required: true },
    rating: { type: String, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    contains: { type: String, required: true },
    dietType: { type: String, required: true },
    packaging: { type: String, required: true },
    recipe: { type: String, required: true },
    reviews: [reviewSchema],
    // featuredImage: { type: String },
    // featured: { type: Boolean, required: true, default: false },
  },
  {
    // this creates the time line with date created and updated.
    timestamps: true,
  },
);

// creating the product model using the mongoose model
// if the value exists then save it ot the product variable,, if not create another model.
const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
