const { DUMMY_USERS } = require("../data/data");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

const getAllUsers = (request, response, next) => {
  response.status(201).json({ place: DUMMY_USERS });
};

const signupUser = (request, response, next) => {
  const { name, email, password } = request.body;
  const id = uuidv4();

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    throw new HttpError("invalid inputs", 422);
  }

  const emailExists = DUMMY_USERS.find((user) => user.email === email);
  if (emailExists) {
    throw new HttpError("email already exists, cant make another user", 404);
  }

  const createdUser = { id, name, email, password };
  DUMMY_USERS.push(createdUser);

  response.status(201).json({ newUser: createdUser });
};

const loginUser = (request, response, next) => {
  const { email, password } = request.body;

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    throw new HttpError("invalid inputs", 422);
  }

  const currentUser = {
    ...DUMMY_USERS.filter(
      (user) => user.email === email && user.password === password
    ),
  };

  if (currentUser) {
    response.status(201).json({ LoggedIn: currentUser });
  } else {
    throw new HttpError("Invalid credentials", 404);
  }
};

exports.getAllUsers = getAllUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
