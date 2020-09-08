// 93 adding controllers
const HttpError = require('../models/http-error');  // 92-Adding our own error model
const uuid = require('uuid').v4;                    //94- adding a post
const { validationResult } = require('express-validator');    // 100- validating api input-req body
const getCoordsForAddress = require('../util/location');  //102 convert an address into coordinate

let DUMMY_PLACES = [                              //89-adding specific route- for dummy database
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'E. State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  }
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;                           // { pid: 'p1' }
  const place = DUMMY_PLACES.find(p => p.id === placeId);

  if (!place) {                                             //91-handling errors
    throw new HttpError('Could not find a place for the provided id.', 404);    // 92-Adding our own error model
  }

  res.json({ routedPlace: place });                         // => { place } => { place: place }
}

// function getPlaceById() { ... }
// const getPlaceById = function() { ... }

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;                            // { uid : u1 }
  const places = DUMMY_PLACES.filter(p => p.creator === userId);

  if (!places || places.length === 0) {                                             //91-handling errors
    //return res.status(404).json({ message: 'Could not find a place for the provided user id.' });
    // const error = new Error('Could not find a place for the provided user id.');
    // error.code = 404;
    return next(new HttpError('Could not find any places for the provided user id.', 404));    // 92-Adding our own error model
  }
  res.json({ routedPlace: places }); // => { place } => { place: place }
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

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)

  res.status(201).json({ routedPlace: createdPlace });
};

const updatePlace = (req, res, next) => {                 //96- adding update place
  const errors = validationResult(req);               // 100- validating 2. part
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { title, description } = req.body;               // allow this two ones
  const placeId = req.params.pid;
  const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

  if (placeIndex === -1) {                        // if there is no index to find, result is returned -1
    return next(new HttpError('Could not find a place to update for the provided place id.', 404));
  }
  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[placeIndex] = updatedPlace;
  res.status(200).json({ routedPlace: updatedPlace });
};


const deletePlace = (req, res, next) => {               // 97- deleting place
  const placeId = req.params.pid;
  const deletedPlace = DUMMY_PLACES.find(p => p.id === placeId);
  if (!deletedPlace) {
    return next(new HttpError('Could not find a place to delete for the provided place id.', 404));
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
  res.status(200).json({ message: `${deletedPlace.title} was deleted.` });
};

exports.getPlaceById = getPlaceById;                  // module.exports for sing one. below for multiple ones
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;