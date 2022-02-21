const Error = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new Error.UnauthenticatedError('No token present');
  }

  try {
    const { name, userId, role } = isTokenValid(token);
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new Error.UnauthenticatedError('invalid token');
  }
};

/**
 * Return a function that accepts param specifying which role is allowed.
 * Roles are provided immediately when server spins up. The returned 
 * function serves as middleware callback.
 */
const authorizePermission = (...roles) => {
  return (req, res, next) => {
    console.log('admin route', req.user.role);
    if (!roles.includes((req.user.role))) {
      throw new Error.UnauthorizedError('Unauthorized');
    }
    next();
  }
}

module.exports = { authenticateUser, authorizePermission };