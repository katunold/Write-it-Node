import passport from 'passport';
import GooglePlusTokenStrategy from 'passport-google-plus-token';
import FacebookTokenStrategy from 'passport-facebook-token';
import TwitterTokenStrategy from 'passport-twitter-token';
import dotenv from 'dotenv';
import User from '../models/user.model';

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

    // if new account
    const newUser = userData(profile, 'google');
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

passport.use('twitterToken', new TwitterTokenStrategy({
    consumerKey: process.env.twitterClientID,
    consumerSecret: process.env.twitterClientSecret
  },
  async (accessToken, refreshToken, profile, done) => {
   // console.log(profile);
   try {
     const existingUser = await User.findOne({'twitter.twitterId': profile.id});
     if (existingUser) {
       return done(null, existingUser);
     }

     // if new account
     const newUser = userData(profile, 'twitter');
     await newUser.save();
     done(null, newUser);
   }catch (e) {
     done(e, false, e.message);
   }
  }
));

const userData = (profile, method) => {
  switch (method) {
    case method === 'facebook':
      return new User({
        method,
        facebook: {
          facebookId: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.familyName,
          lastName: profile.name.givenName,
          picture: profile.photos[0].value
        }
      });
    case method === 'google':
      return new User({
        method: 'google',
        google: {
          googleId: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.familyName,
          lastName: profile.name.givenName,
          picture: profile.photos[0].value
        }
      });
    default:
      return new User({
        method,
        twitter: {
          twitterId: profile.id,
          email: profile.emails[0].value,
          username: profile.username,
          displayName: profile.displayName,
          firstName: profile.name.familyName,
          lastName: profile.name.givenName,
          picture: profile.photos[0].value
        }
      });
  }
};

export { passport };
