const bodyParser = require("body-parser");
const { validationResult } = require("express-validator");
const { DUMMY_PLACES } = require("../data/data");

const Place = require("../models/place");
const User = require("../models/user");
const HttpError = require("../models/http-error");
const { default: mongoose } = require("mongoose");

const getPlaceById = async (request, response, next) => {
  const pid = request.params.pid;
  let filtered;

  try {
    filtered = await Place.findById(pid);
  } catch (err) {
    const error = HttpError("something went wrong", 404);
    return next(error);
  }

  if (!filtered) {
    const error = new HttpError(
      "Could not find the place you are looking for",
      404
    );
    return next(error);
  }

  response.json({ filtered: filtered.toObject({ getters: true }) });
};

const getPlacesByUserId = async (request, response, next) => {
  const uid = request.params.uid;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(uid).populate("places");
    console.log(userWithPlaces);
  } catch (error) {
    next(new HttpError("fetching places failed", 500));
  }

  if (!userWithPlaces || userWithPlaces.length === 0) {
    return next(new HttpError("could not find places for user", 500));
  }

  response.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(new HttpError("invalid inputs", 422));
  }

  const { title, description, coordinates, address, creator } = request.body;
  const createdPlace = new Place({
    title,
    description,
    location: { lat: -77, long: 77 },
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/L%C3%A5da_-_Livrustkammaren_-_107142.tif/lossy-page1-1024px-L%C3%A5da_-_Livrustkammaren_-_107142.tif.jpg",
    address,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    return next(new HttpError("could not find user", 500));
  }

  if (!user) {
    return next(new HttpError("cant find user for provided id", 500));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    sess.commitTransaction();
    //
  } catch (error) {
    const err = new HttpError("creating place failed, try again!", 500);
    return next(error);
  }

  response.status(201).json({ place: createdPlace });
};

const updatePlace = async (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(new HttpError("invalid inputs", 422));
  }

  const { title, description } = request.body;
  const pid = request.params.pid;

  let place;
  try {
    place = await Place.findById(pid);
  } catch (err) {
    const error = new HttpError("something went wrong", 500);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("something went wrong", 500);
    return next(error);
  }

  response.json(201).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (request, response, next) => {
  const pid = request.params.pid;
  let place;
  try {
    place = Place.findById(pid).populate(creator);
  } catch (err) {
    const error = new HttpError("cant delete place", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError("place does not exist", 500);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
    //
  } catch (err) {
    const error = new HttpError("cant delete place", 500);
    return next(error);
  }

  response.status(201).json({ message: "place deleted" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
