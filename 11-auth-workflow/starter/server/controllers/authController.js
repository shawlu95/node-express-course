const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser, sendVerificationEmail, sendResetPasswordEmail, createHash } = require('../utils');
const crypto = require('crypto');

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  // send back status instead of the cookie
  const verificationToken = crypto.randomBytes(40).toString('hex');
  const user = await User.create({ name, email, password, role, verificationToken });

  // the 'origin' url would be opened when user clicks on the verification email
  // const origin = 'http://localhost:3000';
  // const proxy = req.get('origin');
  // const protocol = req.protocol;
  // const host = req.get('host');
  const forwardedHost = req.get('x-forwarded-host');
  // const forwardedProtocol = req.get('x-forwarded-proto');

  await sendVerificationEmail({
    name: user.name, email: user.email, verificationToken: user.verificationToken, origin: forwardedHost
  });

  res.status(StatusCodes.CREATED).json({ msg: 'Registered! Please verify email.' });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError('Please verify email');
  }

  const tokenUser = createTokenUser(user);

  // create refresh token
  let refreshToken = '';

  // check if existing token for user
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      // can set this to false for whatever reason (e.g. repeated abuse)
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }

    // reuse existing token
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    return res.status(StatusCodes.OK).json({ user: tokenUser });
  }

  // create new Token object and refresh token
  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent']; // or req.headers.get('user-agent')
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };
  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError(`No user with email ${email}`);
  }

  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError('Bad token');
  }

  // set user as verified
  user.verificationToken = '';
  user.isVerified = true;
  user.verified = Date.now();
  user.save();

  res.status(StatusCodes.OK).json({ msg: 'Email has been verified' });
}

const logout = async (req, res) => {
  // delete token from database
  console.log(req.user)
  await Token.findOneAndDelete({ user: req.user.userId });

  // remove both cookie
  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError('Please provide email');
  }

  const user = await User.findOne({ email });
  if (user) {
    // send email; reset link has expiration date
    const passwordToken = crypto.randomBytes(70).toString('hex');
    const tenMinutes = 10 * 60 * 1000;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();

    const forwardedHost = req.get('x-forwarded-host');
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin: forwardedHost
    });
  }

  // send success regardless of whether user actually exists
  res.status(StatusCodes.OK)
    .json({ msg: 'Please check email to reset password' });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    throw new CustomError.BadRequestError('Please provide token, email, password');
  }

  const user = await User.findOne({ email });
  if (user) {
    const now = new Date();
    if (user.passwordToken === createHash(token)
      && user.passwordTokenExpirationDate > now) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }

  res.status(StatusCodes.OK)
    .json({ msg: 'Please login now' });
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword
};
