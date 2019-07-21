const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    method: {
      type: String,
      enum: ['local', 'google', 'facebook', 'twitter']
    },
    local: {
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      firstName: {
        type: String,
        trim: true
      },
      lastName: {
        type: String,
        trim: true
      },
      userName: {
        type: String,
        trim: true
      },
      isVerified: {
        type: Boolean
      },
      hashed_password: {
        type: String,
      },
    },
    google: {
      googleId: String,
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      firstName: String,
      lastName: String,
      picture: String
    },
    facebook: {
      facebookId: String,
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      firstName: String,
      lastName: String,
      picture: String
    },
    twitter: {
      twitterId: String,
      email: {
        type: String,
        lowercase: true,
        trim: true
      },
      username: String,
      displayName: String,
      firstName: String,
      lastName: String,
      picture: String
    },
    salt: String
  },
  {
    timestamps: true
  }
);

userSchema
  .virtual('local.password')
  .set(function (password) {
    this.local._password = password;
    this.salt = this.makeSalt();
    this.local.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this.local._password;
  });

userSchema.path('local.hashed_password').validate(function () {
  if (this.local._password && this.local._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.')
  }
  if (this.isNew && !this.local._password) {
    this.invalidate('password', 'Password is required')
  }
}, null);

userSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.local.hashed_password
  },
  encryptPassword: function(password) {
    if (!password) return '';
    try {

      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return err;
    }
  },
  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  }
};

module.exports = mongoose.model('User', userSchema);
