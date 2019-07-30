import express from 'express';
import authController from '../controllers/auth.controllers';
import passport from 'passport';
const pasportGoogle = passport.authenticate('googleToken',{ session: false});
const pasportFacebook = passport.authenticate('facebookToken',{ session: false});
const passportTwitter = passport.authenticate('twitterToken', { session: false });


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

authRouter.route('/auth/twitter')
  .post(passportTwitter, authController.twitterOAuth);

export default authRouter;
