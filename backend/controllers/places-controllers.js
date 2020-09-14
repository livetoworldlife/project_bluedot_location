// 93 adding controllers
const fs = require('fs');                           // 169- deleting images when places get deleted
const HttpError = require('../models/http-error');  // 92-Adding our own error model
const uuid = require('uuid').v4;                    //94- adding a post
const { validationResult } = require('express-validator');    // 100- validating api input-req body
const getCoordsForAddress = require('../util/location');  //102 convert an address into coordinate
const Place = require('../models/place');           // 124 - creating doc in db
const User = require('../models/user');             //135 adding places to user 
const mongoose = require('mongoose');

//89-adding specific route- for dummy database

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;                           // { pid: 'p1' }
  let place;
  try {
    place = await Place.findById(placeId);                //125-get places from db by id 
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find a place.', 500));
  }
  if (!place) {                                             //91-handling errors
    return next(new HttpError('Could not find a place for the provided id.', 404));    // 92-Adding our own error model
  }

  res.json({ place: place.toObject({ getters: true }) });    // ToObject mongoose make data to object and for string id getter                     // => { place } => { place: place }
}


const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;                            // { uid : u1 }

  //let places;     // 126-getting places from db by the userID
  let userWithPlaces;    // 137- alternative getting places from db by the userID
  try {
    //places = await Place.find({ creator: userId }); // for specific find create the property
    userWithPlaces = await User.findById(userId).populate('places');
    //console.log(places);
  } catch (err) {
    return next(new HttpError('Fetching places failed, please try again later', 500));
  }
  if (!userWithPlaces || userWithPlaces.places.length === 0) {                                             //91-handling errors
    return next(new HttpError('Could not find any places for the provided user id.', 404));    // 92-Adding our own error model
  }
  res.json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {                 //94- adding a post created place
  const errors = validationResult(req);               // 100- validating 2. part
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description, address, creator } = req.body;     // object destructuring - const title = req.body.title;

  let coordinates;                                               //102 convert an address into coordinate
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  // 124 - creating doc in db
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,              // 168 upload new places image to backend 
    creator
  });
  //135 adding places to user 
  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError('Creating place failed, please try again.', 500));
  }
  if (!user) {
    return next(new HttpError('Could not find user for provided id.', 500));
  }
  console.log(user);

  // 124 - creating doc and saving in db
  try {
    //await createdPlace.save();
    const session = await mongoose.startSession();        //135 adding places to user 
    session.startTransaction();
    await createdPlace.save({ session: session });

    user.places.push(createdPlace);     // mongoose push func add place id to user collection
    await user.save({ session: session });
    await session.commitTransaction();

  } catch (err) {
    return next(new HttpError('Creating place failed, please try again.', 500));
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {                 //96- adding update place
  const errors = validationResult(req);               // 100- validating 2. part
  if (!errors.isEmpty()) {
    return next(HttpError('Invalid inputs passed, please check your data.', 422));
  }
  const { title, description } = req.body;               // allow this two ones
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update place.', 500));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update place.', 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};


const deletePlace = async (req, res, next) => {               // 97- deleting place
  const placeId = req.params.pid;

  let place;                //128- deleting place
  try {                     // 136- deleting place from user
    place = await Place.findById(placeId).populate('creator');//populate refer to a doc stored in another collection
  } catch (err) {
    return next(new HttpError('Something went wrong, could not delete place.', 500));
  }
  if (!place) {
    return next(new HttpError('Could not find a place to delete for the provided place id.', 404));
  }
  const imagePath = place.image;              // 169- deleting images when places get deleted
  let deletedPlace = place;

  try {                                         // 136- deleting place from user
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.remove({ session: session });
    place.creator.places.pull(place);
    await place.creator.save({ session: session });
    await session.commitTransaction();

  } catch (err) {
    return next(new HttpError('Something went wrong, could not delete place.', 500));
  }
  fs.unlink(imagePath, err => console.log(err));              // 169- deleting images when places get deleted
  res.status(200).json({ message: `${deletedPlace.title} was deleted.` });
};

exports.getPlaceById = getPlaceById;                  // module.exports for sing one. below for multiple ones
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;