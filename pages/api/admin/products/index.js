import nc from 'next-connect';
import Product from '../../../../models/Product';
import { isAdmin, isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';

const handler = nc();

handler.use(isAuth, isAdmin);

// this handler returns back all the products there is in the database
handler.get(async (req, res) => {
  await db.connect();

  const products = await Product.find({});

  await db.disconnect();

  res.send(products);
});

// this handler creates a new product with some sample information and user can update those information and personalize it.
handler.post(async (req, res) => {
  await db.connect();

  // create a new instance of the product model
  const newProduct = new Product({
    // creating the reference to the user that created the product
    /* ...req.body, */
    // farmer: req.user._id, // comment out, checking errors
    // user: mongoose.Types.ObjectId(req.user._id), Import mongoose

    // All needed fields for the product being created

    // populate the product information with the new information coming from the api request
    name: 'sample name',
    slug: 'sample-slug-' + Math.random(),
    price: 0,
    image: '/images/box1.jpeg',
    category: 'sample category',
    farmerName: 'sample farmer name',
    farmingMethod: 'farming method in detail',
    description: 'detail description of the product ',
    contains: 'explain in detail what is inside the box ',
    dietType: 'the diet type and benefits and allergy information ',
    packaging: 'how is it packaged',
    recipe: 'what can be cooked with what the food box contains ',
    countInStock: 0,
    address: 'farm address and location ',
    city: 'what city is your farm',
    postCode: 'sample post code',
    rating: 0,
    numReview: 0,
  });

  // save the new information of the product
  const product = await newProduct.save();

  await db.disconnect();

  res.send({ message: 'Product created, You can edit now', product });
});

export default handler;
