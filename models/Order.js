import mongoose from 'mongoose';

// For self: After making the models, the next step is to crete the Api that will receive the request from the front end and execute saving the information contained in the request to the database according to this schema
//#####################################################################

// This is the database model for the orders made by the user

// creating the order schema using mongoose
const orderSchema = new mongoose.Schema(
  {
    // creating the structure of the database
    // This is the schema that connected the user to the Order they are creating
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // type => object id from mongoose

    orderItems: [
      {
        name: { type: String, required: true },
        slug: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
          // added this to reference the product object in the order for later use
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentMethod: { type: String, required: true },
    paymentResult: { id: String, status: String, email_address: String },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },

  {
    // this creates the time line with date created and updated.
    timestamps: true,
  },
);

// creating the product model using the mongoose model
// if the value exists then save it ot the product variable,, if not create another model.
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;

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
