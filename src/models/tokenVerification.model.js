const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
    expires: 43200 // token gets deleted in 24 hours
  }
});

module.exports = mongoose.model('Token', tokenSchema);
