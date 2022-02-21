const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createTokenUser, attachCookies, checkPermissions } = require('../utils');

// Only for admin! Use authorizePermission middleware
const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ users });
};

const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  checkPermissions(req.user, user._id);
  if (!user) {
    throw new CustomError("User not found");
  }
  res.status(StatusCodes.OK).json({ user });
};

// No need to query database
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

// Note: user must not be able to change role!
// Update cookie if update is successful
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError('Please provide name & email')
  }

  // Note: does not invoke pre-save hook
  const user = await User.findByIdAndUpdate(req.user.userId,
    { email, name },
    { new: true, runValidators: true }); // 'new' returns the updated user

  // check isModified('password') in pre-save hook
  // const user = await User.findById(req.user.userId);
  // user.name = name;
  // user.email = email;
  // await user.save();

  const tokenUser = createTokenUser(user);
  attachCookies({ res, user: tokenUser });
  res.status(StatusCodes.OK).send({ msg: 'User updated' });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide old & new passwords')
  }

  // middleware already ensures a valid userId exists
  // no need to double check
  const user = await User.findById(req.user.userId);
  const isMatch = await user.comparePassword(oldPassword);
  // if (!isMatch) {
  //   throw new CustomError.BadRequestError('Invalid password');
  // }
  user.password = newPassword;
  await user.save(); // the pre-save hook is invoked to hash password
  res.status(StatusCodes.OK).json({ msg: 'Password updated' });
};

module.exports = {
  getAllUsers,
  getUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
};