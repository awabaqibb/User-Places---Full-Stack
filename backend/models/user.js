const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userScehma = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

userScehma.plugin(uniqueValidator);
module.exports = mongoose.model("User", userScehma);
