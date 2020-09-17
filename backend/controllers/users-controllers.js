// 99 - setting up user routers  singing login get users
const { validationResult } = require('express-validator');  // 101- validating user routes
const bcrypt = require('bcryptjs');                         // 174 hashing the user password
const jwt = require('jsonwebtoken');                        //176- generating token
const HttpError = require('../models/http-error');
const User = require('../models/user');   //131-using model for signup

const getUsers = async (req, res, next) => {
  let users;                                            // 133- getting users
  try {
    users = await User.find({}, '-password');          // not get password for security reason
  } catch (err) {
    return next(new HttpError('Fetching users failed, please try again later.', 500));
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};




const signup = async (req, res, next) => {
  const errors = validationResult(req);                   // 101- validating user routes
  if (!errors.isEmpty()) {
    return next(HttpError('Invalid inputs passed, please check your data.', 422));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {                                                   //131-using model for signup
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError('Singing up failed, please try again later.', 500));
  }

  if (existingUser) {
    return next(new HttpError('User exists already, please login instead.', 422));
  }

  let hashedPassword;                           // 174 hashing the user password
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError('Could not created user, please try again.', 500));
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,          // 166 connecting users to image
    password: hashedPassword,
    places: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again.', 500));
  }

  let token;                                        //176- generating token
  try {
    token = jwt.sign({
      userId: createdUser.id,
      email: createdUser.email
    },
      "supersecret",
      { expiresIn: "1h" });
  } catch (error) {
    return next(new HttpError('Signing up failed, please try again.', 500));
  }

  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });      //176- generating token
  //res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};






const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;                                   //132-adding the user login
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError('Logging in failed, please try again later.', 500));
  }

  let isValidPassword = false;        // 175 login user with hashed password
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(new HttpError('Could not log you in, please check your credentials and try again.', 500));
  }

  if (!existingUser || !isValidPassword) {    // basic validator so not need express-validator 
    return next(new HttpError('Could not identify user, credentials seem to be wrong.', 403));  // 401 authentication fail
  }

  let token;                                        //176- generating token
  try {
    token = jwt.sign({
      userId: existingUser.id,
      email: existingUser.email
    },
      "supersecret",
      { expiresIn: "1h" });
  } catch (error) {
    return next(new HttpError('Log in failed, please try again.', 500));
  }

  res.json({ userId: existingUser.id, email: existingUser.email, token: token });      //176- generating token
  //res.json({ message: `${existingUser.name} Logged in!`, user: existingUser.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
