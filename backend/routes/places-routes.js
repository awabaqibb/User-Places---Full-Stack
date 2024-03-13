const express = require("express");
const router = express.Router();
const placeControllers = require("../controller/places-controller");
const HttpError = require("../models/http-error");
const { check } = require("express-validator");

router.get("/:pid", placeControllers.getPlaceById);
router.get("/user/:uid", placeControllers.getPlacesByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placeControllers.createPlace
);

router.patch(
  "/:pid",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placeControllers.updatePlace
);
router.delete("/:pid", placeControllers.deletePlace);

module.exports = router;
