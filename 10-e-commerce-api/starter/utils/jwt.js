const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_TTL });
  return token;
};

const attachCookies = ({ res, user }) => {
  const token = createJWT({ payload: user });
  const oneDay = 24 * 60 * 60 * 1000;
  console.log('attach token', token);
  res.cookie('token', token, {
    expire: new Date(Date.now() + oneDay),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true
  });
}

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { createJWT, isTokenValid, attachCookies };