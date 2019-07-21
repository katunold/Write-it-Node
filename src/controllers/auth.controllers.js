const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const expressjwt = require('express-jwt');

/**
 * Function to perform user authentication
 */

const login = (req, res) => {
  User.findOne({ 'local.userName': req.body.userName }, (err, user) => {
    if (err || !user) {
      return res.status(401).send({ error: 'User not found'});
    }
    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({error: 'Email and Password dont match'});
    }

    if (!user.local.isVerified) {
      return res.status(401).send({error: 'This account is yet to be verified'});
    }

    return res.status(200).send({
      accessToken: signToken(user._id),
      user: {_id: user._id, name: user.local.userName, email: user.local.email}
    })
  })
};

const googleOAuth = (req, res) => {
  // console.log(req.user);
  const {_id, google} = req.user;
  res.status(200).send({
    accessToken: signToken(_id),
    user: {
      _id,
      name: google.firstName,
      email: google.email
    }
  });
};

const facebookOAuth = (req, res) => {
  const {_id, facebook} = req.user;
  res.status(200).send({
    accessToken: signToken(_id),
    user: {
      _id,
      name: facebook.firstName,
      email: facebook.email
    }
  });
};

const twitterOAuth = (req, res) => {
  const {_id, twitter} = req.user;
  res.status(200).send({
    accessToken: signToken(_id),
    user: {
      _id,
      username: twitter.username,
      displayName: twitter.displayName,
      email: twitter.email
    }
  })
};

const signToken = (id) => {
  return jwt.sign({
    _id: id
  }, config.jwtSecret, { expiresIn: 60*60});
};

/**
 * check user authentication status
 * @type {middleware}
 */

const requireSignIn = expressjwt({
  secret: config.jwtSecret,
  userProperty: 'auth'
});

module.exports = { login, requireSignIn, googleOAuth, facebookOAuth, twitterOAuth };
