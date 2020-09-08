// 99 - setting up user routers  singing login get users
const uuid = require('uuid').v4;
const { validationResult } = require('express-validator');  // 101- validating user routes

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Eric',
    email: 'test@test.com',
    password: '1234'
  }
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);                   // 101- validating user routes
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find(u => u.email === email);
  if (hasUser) {
    throw new HttpError('Could not create user, email already exists.', 422);  // 422- invalid user input
  }

  const createdUser = {
    id: uuid(),
    name, // name: name
    email,
    password
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find(u => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {    // basic validator so not need express-validator 
    throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);  // 401 authentication fail
  }

  res.json({ message: `${identifiedUser} Logged in!` });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
