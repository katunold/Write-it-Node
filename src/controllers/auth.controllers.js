const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const expressjwt = require('express-jwt');

/**
 * Function to perform user authentication
 */

const login = (req, res) => {
  User.findOne({ 'userName': req.body.userName }, (err, user) => {
    if (err || !user) {
      return res.status(401).send({ error: 'User not found'});
    }
    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({error: 'Email and Password dont match'});
    }
    const token = jwt.sign({
      _id: user._id
    }, config.jwtSecret, { expiresIn: 60*60});

    return res.status(200).send({
      accessToken: token,
      user: {_id: user._id, name: user.userName, email: user.email}
    })
  })
};

/**
 * check user authentication status
 * @type {middleware}
 */

const requireSignIn = expressjwt({
  secret: config.jwtSecret,
  userProperty: 'auth'
});

module.exports = { login, requireSignIn };
