const express = require('express');
const placesControllers = require('../controllers/places-controllers');   // 93 adding controllers
const { check } = require('express-validator');                  // 100- validating api input-req body
const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById);                  //89-adding specific place route

router.get('/user/:uid', placesControllers.getPlacesByUserId);         //90-getting places by user id

router.post('/',                                                      //94- adding a post
  [
    check('title')                                                    //100- validating title,address not empty, desc 5chars
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address')
      .not()
      .isEmpty()
  ], placesControllers.createPlace);

router.patch('/:pid',                   //96- adding update place-PATCH only included the some that were being modified not all
  [
    check('title')                              //100- validating title not empty, desc 5chars
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ], placesControllers.updatePlace);

router.delete('/:pid', placesControllers.deletePlace);                // 97- deleting place

module.exports = router;