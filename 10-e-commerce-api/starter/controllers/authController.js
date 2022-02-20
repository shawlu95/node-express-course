const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookies } = require('../utils');

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    // better than mongoose unique index
    throw new CustomError.BadRequestError("Email already exists");
  }

  const isFirstAccount = await User.countDocuments({}) == 0;
  const role = isFirstAccount ? 'admin' : 'user';

  // user cannot just set role in json body
  const user = await User.create({ name, email, password, role });
  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  attachCookies({ res, user });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.BadRequestError("User not found");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new CustomError.BadRequestError("Invalid credential");
  }

  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  attachCookies({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  console.log('logout')
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000)
  });
  res.status(StatusCodes.OK).end();
};

module.exports = {
  register, login, logout
}