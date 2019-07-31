import User from '../models/user.model';
import errorHandler from '../helpers/dbErrorHandler';
import {emailVerify, passwordReset} from '../helpers/emailVerification';
import Token from '../models/tokenVerification.model';
import { validationResult } from 'express-validator';

/**
 * method to create a new user account
 */
const create = (req, res) => {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  Object.values(req.body).find(value => value === '');
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, firstName, lastName, userName, password } = req.body;
  if (Object.keys(req.body).find(key => req.body[key] === '')) {
    return res.status(401).json({ errors: `${req.body[key]} field is empty` });
  }
  const data = {
    method: 'local',
    local: {
      isVerified: false,
      email, firstName, lastName, userName, password
    }
  };

  const user = new User(data);
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
    user.local.isVerified = true;
    saveUser(res, user, "The account has been verified. Please log in.");
  })
};

const resendVerificationToken = (req, res) => {

  User.findOne({'local.email': req.body.email}, function (err, user) {
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

const resetPassword = (req, res) => {
  User.findOne({'local.email': req.body.email}, (err, user) => {
    if (!user) {
      return res.status(400).send({
        messsage: 'We were unable to find a user with that email.'
      });
    }
    if (!user.local.isVerified) {
      return res.status(400).send({
        messsage: 'This account is not yet verified'
      });
    }
    return passwordReset(user, req, res);
  });
};

const passwordUpate = (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  Token.findOne({token: token}, function (err, token) {
    if (!token) {
      return res.status(400).send({
        type: 'not-verified',
        message: 'We were unable to find a user for this token.'
      })
    }

    User.findOne({_id: token._userId}, (err, user) => {
      if (!user) {
        return res.status(400).send({
          message: 'User account doesnot exist'
        })
      }
      user.local.password = password;
      saveUser(res, user, "Password successfully reset");
    })
  })
};

const saveUser = (res,user, message) => {
  user.save(
    (err) => {
      if (err) {
        return res.status(500).send({
          message: err.message
        })
      }
      res.status(200).send({
        message
      });
    }
  );
};

export default { create, emailConfirmation, resendVerificationToken, resetPassword, passwordUpate };
