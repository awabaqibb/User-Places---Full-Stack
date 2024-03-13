const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const HttpError = require("../models/http-error");
const userControllers = require("../controller/users-controller");

router.get("/", userControllers.getAllUsers);
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userControllers.signupUser
);
router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userControllers.loginUser
);

module.exports = router;
