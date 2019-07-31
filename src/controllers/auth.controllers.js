import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import expressjwt from 'express-jwt';

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
  auth(res, _id, google);
};

const facebookOAuth = (req, res) => {
  const {_id, facebook} = req.user;
  auth(res, _id, facebook);
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

const auth = (res, _id, strategy) => {
  res.status(200).send({
    accessToken: signToken(_id),
    user: {
      _id,
      name: strategy.firstName,
      email: strategy.email
    }
  });
};

/**
 * check user authentication status
 * @type {middleware}
 */

const requireSignIn = expressjwt({
  secret: config.jwtSecret,
  userProperty: 'auth'
});

export default { login, requireSignIn, googleOAuth, facebookOAuth, twitterOAuth };
