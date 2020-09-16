// 178- Backend route protection with authorization middleware
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; //authorization in app headers like that Authorization: 'Bearer TOKEN'
    if (!token) { throw new Error('Authorization failed'); }
    const decodedToken = jwt.verify(token, 'supersecret');      // verify-validate the token
    req.userData = { userId: decodedToken.userId };             // add to data to request
    next();
  } catch (error) {
    return next(new HttpError('Authorization failed'), 401);
  }
};