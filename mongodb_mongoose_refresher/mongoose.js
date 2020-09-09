const mongoose = require('mongoose');

const Product = require('./models/product');

const user = "bluedot";
const password = "bluedot1234";
const db_name = 'product_test';
const url = `mongodb+srv://${user}:${password}@cluster0.dul42.mongodb.net/${db_name}?retryWrites=true&w=majority`;


const createProduct = async (req, res, next) => {

  mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
    .then(() => {
      console.log('Connected to database! from mongoose')
    }).catch(() => {
      console.log('Connection failed!')
    });

  const createdProduct = new Product({
    name: req.body.name,
    price: req.body.price
  });
  const result = await createdProduct.save();  // save mongoose func
  console.log(typeof createdProduct.id);  // mongoose make object id this(.id) make it string
  res.json(result);
};


const getProducts = async (req, res, next) => {
  const product = await Product.find().exec(); // not need toArray in mongoose
  res.json(product);
};



exports.createProduct = createProduct;
exports.getProducts = getProducts;