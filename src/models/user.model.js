import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      trim: true,
      match: [/.+@.+\..+/, 'Please insert a valid email format'],
    },
    firstName: {
      type: String,
      required: [true, 'First Name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is required'],
      trim: true
    },
    userName: {
      type: String,
      required: [true, 'User Name is required'],
      trim: true,
      unique: true
    },
    hashed_password: {
      type: String,
      required: [true, 'Password is required']
    },
    salt: String
  },
  {
    timestamps: true
  }
);

userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password;
  });

userSchema.path('hashed_password').validate(function () {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required')
  }
}, null);

userSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  }
};

module.exports = mongoose.model('User', userSchema);
