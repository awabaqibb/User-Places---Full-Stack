const url =
  "mongodb+srv://awabaqibb:giU4rPPeTwGMoit2@cluster0.6mdyx45.mongodb.net/places?retryWrites=true&w=majority&appName=Cluster0";

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const placeRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use("/api/places", placeRoutes);
app.use("/api/users", usersRoutes);

app.use((error, request, response, next) => {
  if (response.headerSent) {
    return next(error);
  }
  response.status(error.code || 500);
  response.json({ message: error.message || "unknown error occurred" });
});

mongoose
  .connect(url)
  .then(() => app.listen(5000))
  .catch((error) => console.log(error));
