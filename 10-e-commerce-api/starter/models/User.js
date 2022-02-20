const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { createJWT } = require('../utils');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      message: 'Please provide a valid email',
      validator: validator.isEmail
    },
    unique: true, // create a primary index (not a validator)
  },
  password: {
    type: String,
    required: [true, 'Please provide password']
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
});

// this will always point to document
// do not use arrow func
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (submitted) {
  const isMatch = await bcrypt.compare(submitted, this.password);
  return isMatch;
}

// do not use arrow func
UserSchema.methods.getName = function () {
  return this.name;
}

UserSchema.methods.createJWT = function () {
  const payload = { userId: this._id, name: this.name, role: this.role };
  return createJWT({ payload })
}

module.exports = mongoose.model('User', UserSchema);