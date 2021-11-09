import nc from 'next-connect';
import Product from '../../../../../models/Product';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import db from '../../../../../utils/db';

const handler = nc();

// this error took me approximately about 5 hours to figure out. I have this authentication middleware like this => handler.use(isAdmin, isAuth); and i was getting a failed request error with status code 500 and a response with isAdmin undefined. So now i realized that the problem was that the authentication have to place first before the user can be checked for being an admin or not. so having this authentication middleware like this => handler.use(isAuth, isAdmin); solved my five hours of agony. thanks console.log

handler.use(isAuth, isAdmin);

// api that handles the product information fetch to the frontend.
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

  // check if product exists and was found
  if (product) {
    // convert the product name to SEO friendly slug and removing any extra white space
    const newSlug = req.body.name
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
      .replaceAll(' ', '-');

    // populate the product information with the new information coming from the api request
    product.name = req.body.name;
    product.slug = newSlug;
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

export default handler;
