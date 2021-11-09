import mongoose from 'mongoose';

// This is the database model for our products

// creating the product schema using mongoose
const productSchema = new mongoose.Schema(
  {
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

// ##############
/*

      id: 1,
      name: 'Food Box One',
      slug: 'food-box-one',
      category: 'Vegetables',
      image: '/images/box1.jpeg',
      price: 70,
      farmerName: 'farmer one',
      farmingMethod: 'Bio and Climate Friendly',
      address: 'man dummy street 26',
      city: 'Vienna',
      postCode: '4810',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description:
        'The food box contains the following items and they are sweet. and the farmer will suggest some recept for cooking what is inside the box',
      contains: 'Spinach, Tomatoes, Asparagus, Garlic',
      dietType: 'Gluten Free, Lactose Free, Vegan, No preservatives',
      packaging: 'In a Carton Box',
      recipe: 'You can cook bla bla bla with this items',


*/
