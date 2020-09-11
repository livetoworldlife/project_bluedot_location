// 99 - setting up user routers  singing login get users
const { validationResult } = require('express-validator');  // 101- validating user routes

const HttpError = require('../models/http-error');
const User = require('../models/user');   //131-using model for signup
const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Eric',
    email: 'test@test.com',
    password: '1234'
  }
];

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
  const createdUser = new User({
    name,
    email,
    image: 'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg',
    password,
    places: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again.', 500));
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;                                   //132-adding the user login
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    return next(new HttpError('Logging in failed, please try again later.', 500));
  }

  if (!existingUser || existingUser.password !== password) {    // basic validator so not need express-validator 
    return next(new HttpError('Could not identify user, credentials seem to be wrong.', 401));  // 401 authentication fail
  }

  res.json({ message: `${existingUser.name} Logged in!`, user: existingUser.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
