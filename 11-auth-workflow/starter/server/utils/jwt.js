const jwt = require('jsonwebtoken');

// with refreshToken, no longer need to hard-code TTL
const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

// deprecated
const attachSingleCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const oneMonth = oneDay * 30;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneMonth),
    secure: process.env.NODE_ENV === 'production',
    signed: true
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
