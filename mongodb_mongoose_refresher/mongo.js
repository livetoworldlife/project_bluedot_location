const MongoClient = require('mongodb').MongoClient;

const user = "bluedot";
const password = "bluedot1234";
const db_name = 'product_test';
const url = `mongodb+srv://${user}:${password}@cluster0.dul42.mongodb.net/${db_name}?retryWrites=true&w=majority`;

const createProduct = async (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    price: req.body.price
  };
  const client = new MongoClient(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('products').insertOne(newProduct); // products collection-table insert new product
  } catch (error) {
    return res.json({ message: 'Could not store data.' });
  };
  client.close();

  res.json(newProduct);
};

const getProducts = async (req, res, next) => {
  const client = new MongoClient(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  let products;

  try {
    await client.connect();
    const db = client.db();
    products = await db.collection('products').find().toArray();
  } catch (error) {
    return res.json({ message: 'Could not retrieve products.' });
  };
  client.close();

  res.json(products);
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;


/**

    "body-parser": "^1.19.0",
    "express": "^4.17.1",
    "mongodb": "^3.3.4",
    "nodemon": "^1.19.4"
 */