const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
  },
  address: { type: String, required: true },
  creator: { type: String, required: true },
});

const Place = mongoose.model("Place", placeSchema);
module.exports = Place;
