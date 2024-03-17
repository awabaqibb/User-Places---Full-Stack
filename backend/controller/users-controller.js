const { DUMMY_USERS } = require("../data/data");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const { v4: uuidv4 } = require("uuid");

const getAllUsers = async (request, response, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new HttpError("fetching failed", 500));
  }

  if (users) {
    response
      .status(201)
      .json({ users: users.map((user) => user.toObject({ getters: true })) });
  }
};

const signupUser = async (request, response, next) => {
  const { name, email, password } = request.body;
  const id = uuidv4();

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(new HttpError("invalid inputs", 422));
  }

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("signup failed", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("user already exists", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      "https://st3.depositphotos.com/1229718/16738/i/1600/depositphotos_167383022-stock-photo-business-way-idea.jpg",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    const err = new HttpError("creating user failed", 500);
    return next(error);
  }

  response
    .status(201)
    .json({ newUser: createdUser.toObject({ getters: true }) });
};

const loginUser = async (request, response, next) => {
  const { email, password } = request.body;
  let currentUser;

  try {
    currentUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError("logging in failed", 404));
  }

  if (!currentUser || currentUser.password !== password) {
    return next(new HttpError("Invalid password entered", 404));
  }

  try {
    await currentUser.save();
  } catch (error) {
    return next(new HttpError("loggin in failed", 404));
  }

  response.status(201).json({ LoggedIn: currentUser });
};

exports.getAllUsers = getAllUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
