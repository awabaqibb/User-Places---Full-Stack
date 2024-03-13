const bodyParser = require("body-parser");
const { validationResult } = require("express-validator");
const { DUMMY_PLACES } = require("../data/data");

const HttpError = require("../models/http-error");

const getPlacesByUserId = (request, response, next) => {
  const uid = request.params.uid;
  const filtered = DUMMY_PLACES.filter((item) => item.creator === uid);

  if (!filtered || filtered.length === 0) {
    return next(
      new HttpError("could not find places for specific user id", 404)
    );
  }

  response.json({ filtered });
};

const getPlaceById = (request, response, next) => {
  const id = request.params.pid;
  const filtered = DUMMY_PLACES.find((item) => item.id === +id);

  if (!filtered) {
    throw new HttpError("Could not find the place you are looking for", 404);
  }

  response.json({ filtered });
};

const createPlace = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    throw new HttpError("invalid inputs", 422);
  }

  const { title, description, coordinates, address, creator } = request.body;
  const createdPlace = {
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);
  response.status(201).json({ place: createdPlace });
};

const updatePlace = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    throw new HttpError("invalid inputs", 422);
  }

  const { title, description } = request.body;
  const pid = request.params.pid;

  const updatedPlace = {
    ...DUMMY_PLACES.find((current) => current.id === +pid),
  };
  const placeIndex = DUMMY_PLACES.findIndex((current) => current.id === +pid);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  response.json(201).json({ place: updatePlace });
};

const deletePlace = (request, response, next) => {
  const pid = request.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter((current) => current.id != +pid);

  response.status(201).json({ message: "place deleted" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
