// 99 - setting up user routers  singing login get users
const express = require('express');
const { check } = require('express-validator');           // 101- validating user routes

const usersController = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');             //163- using multer to save file to backend
const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
  '/signup',                                              // 101- validating user routes name not empty, email is valid
  fileUpload.single('image'),
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;
