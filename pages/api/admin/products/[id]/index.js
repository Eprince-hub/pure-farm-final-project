import nc from 'next-connect';
import Product from '../../../../../models/Product';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import db from '../../../../../utils/db';

const handler = nc();

handler.use(isAuth, isAdmin);

// api that handles the product information fetch to the frontend. The product that should be edited.
handler.get(async (req, res) => {
  await db.connect();

  const product = await Product.findById(req.query.id);

  await db.disconnect();

  res.send(product);
});

// api that handles the product information update that is coming from the frontend
handler.put(async (req, res) => {
  await db.connect();

  // find the product with corresponding id
  const product = await Product.findById(req.query.id);

  // console.log('The body request header: ', req.body);
  // console.log('checking for user info: ', req.user);

  // check if product exists and was found
  if (product) {
    // this uses the reference from the product model to create an objectId of the farmer that updated this product and it can be referenced in other to get the farmer's information
    // product.farmer = req.user._id; // comment it out: checking errors

    // convert the product name to SEO friendly slug and removing any extra white space
    const newSlug =
      req.body.name
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()
        .replaceAll(' ', '-') +
      '-' +
      Math.random();

    // populate the product information with the new information coming from the api request
    product.name = req.body.name;
    product.slug = newSlug; // have to remove the slug from the frontend
    product.price = req.body.price;
    product.image = req.body.image;
    product.category = req.body.category;
    product.farmerName = req.body.farmerName;
    product.farmingMethod = req.body.farmingMethod;
    product.description = req.body.description;
    product.contains = req.body.contains;
    product.dietType = req.body.dietType;
    product.packaging = req.body.packaging;
    product.recipe = req.body.recipe;
    product.countInStock = req.body.countInStock;
    product.address = req.body.address;
    product.city = req.body.city;
    product.postCode = req.body.postCode;

    // save the new information of the product
    await product.save();

    // disconnect from the database
    await db.disconnect();

    res.send({ message: 'The product update was successful' });
  } else {
    await db.disconnect();

    res.status(404).send({ message: 'The Product does not exist' });
  }
});

// api that handles the deletion of the product
handler.delete(async (req, res) => {
  await db.connect();

  const product = await Product.findById(req.query.id);

  if (product) {
    await product.remove();

    await db.disconnect();

    res.send({ message: 'This Product have been deleted' });
  } else {
    await db.disconnect();

    res.status(404).send({ message: 'The Product does not exist' });
  }
});

export default handler;
