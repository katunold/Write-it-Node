const express = require('express');
const authController = require('../controllers/auth.controllers');
const passport = require('passport');
const pasportGoogle = passport.authenticate('googleToken',{ session: false});
const pasportFacebook = passport.authenticate('facebookToken',{ session: false});


const authRouter = express.Router();

/**
 * route to handle user login
 */
authRouter.route('/auth/signin')
  .post(authController.login);

/**
 * routes to handle social authentication
 */
authRouter.route('/auth/google')
  .post(pasportGoogle, authController.googleOAuth);

authRouter.route('/auth/facebook')
  .post(pasportFacebook, authController.facebookOAuth);

module.exports = authRouter;
