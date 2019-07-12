const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const dotenv = require('dotenv');
const User = require('../models/user.model');

dotenv.config();

// Google OAuth strategy
passport.use('googleToken',new GooglePlusTokenStrategy({
  clientID: process.env.googleClientID,
  clientSecret: process.env.googleClientSecret,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // check whether user exists in the DB
    const existingUser = await User.findOne({ 'google.googleId': profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }

    // If new account
    const newUser = new User({
      method: 'google',
      google: {
        googleId: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.familyName,
        lastName: profile.name.givenName,
        picture: profile.photos[0].value
      }
    });
    await newUser.save();
    done(null, newUser);
  }catch (e) {
    done(e, false, e.message);
  }

}));

passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: process.env.facebookClientID,
    clientSecret: process.env.facebookClientSecret,
  },
  async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({'facebook.facebookId': profile.id});
    if (existingUser) {
      return done(null, existingUser);
    }

    // If new account
    const newUser = userData(profile, 'facebook');
    await newUser.save();
    done(null, newUser);

  }catch (e) {
    done(e, false, e.message);
  }
  } 
));

const userData = (profile, method) => {
  return new User({
    method,
    facebook: {
      facebookId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.familyName,
      lastName: profile.name.givenName,
      picture: profile.photos[0].value
    }
  })
};

module.exports = passport;
