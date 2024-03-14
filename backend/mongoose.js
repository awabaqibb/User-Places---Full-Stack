const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://awabaqibb:giU4rPPeTwGMoit2@cluster0.6mdyx45.mongodb.net/products_test?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("connected to db");
  })
  .catch((error) => {
    console.log(error);
  });

const Product = require("./models/products");

const createProduct = async (request, response, next) => {
  const newProduct = new Product({
    name: request.body.name,
    price: request.body.price,
  });

  const result = await newProduct.save();
  response.json(result);
};

const getProducts = async (request, response, next) => {
  const products = await Product.find().exec();
  response.json(products);
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
