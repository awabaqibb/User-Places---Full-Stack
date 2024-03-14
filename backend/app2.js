const express = require("express");
const app = express();
const mongoPractice = require("./mongoose");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.post("/products", mongoPractice.createProduct);
app.get("/products", mongoPractice.getProducts);

app.listen(5000);
