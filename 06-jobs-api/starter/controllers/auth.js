const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // use middleware to format response message
  // if (!name || !email || !password) {
  //   // Better to send 400 error
  //   // MongoDB validator would throw 500
  //   throw new BadRequestError('Missing information.');
  // }

  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED)
    .json({ user: { name: user.getName() }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // Better to send 400 error
    // MongoDB validator would throw 500
    throw new BadRequestError('Missing information.');
  }

  const user = await User.findOne({email});
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const correct = await user.comparePassword(password);
  if (!correct) {
    throw new UnauthenticatedError("Wrong password");
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK)
    .json({user: {name: user.getName()}, token});
};

module.exports = {
  register, login
};