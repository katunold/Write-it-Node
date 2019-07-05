const User = require('../models/user.model');
const errorHandler = require('../helpers/dbErrorHandler');
const emailVerify = require('../helpers/emailVerification');
const Token = require('../models/tokenVerification.model');

/**
 * method to create a new user account
 */
const create = (req, res) => {
  const user = new User(req.body);
  user.save((err, result) => {
    if (err) {
      return res.status(400).json({error: errorHandler.getErrorMessage(err)});
    }

    // create a verification token, save it and send an email
    return emailVerify(user, req, res);
  });
};

const emailConfirmation = (req, res) => {
  const { token } = req.params;
  // find a matching token
  Token.findOne({token: token}, function (err, token) {
    if (!token) {
      return res.status(400).send({
        type: 'not-verified',
        message: 'We were unable to find a user for this token.'
      })
    }

    findUser(res, token);
  })
};

const findUser = (res, token) => {
  User.findOne({_id: token._userId}, function (err, user) {
    if (!user) {
      return res.status(400).send({
        type: 'not-verified',
        message: 'We were unable to find a user for this token.'
      })
    }
    if (user.isVerified) {
      return res.status(401).send({
        type: 'already-verified',
        message: 'This user has already been verified.'
      })
    }
    user.isVerified = true;
    user.save(function (err) {
      if (err) {
        return res.status(500).send({
          message: err.message
        })
      }
      res.status(200).send({
        message: "The account has been verified. Please log in."
      });
    })
  })
};

const resendVerificationToken = (req, res) => {

  User.findOne({email: req.body.email}, function (err, user) {
    if (!user) {
      return res.status(400).send({
        messsage: 'We were unable to find a user with that email.'
      });
    }
    if (user.isVerified) {
      return res.status(400).send({
        messsage: 'This account has already been verified. Please log in.'
      });
    }

    // create a verification token, save it and send an email
    return emailVerify(user, req, res);
  })
};

module.exports = { create, emailConfirmation, resendVerificationToken };
