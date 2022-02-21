const { createJWT, isTokenValid, attachCookies } = require('./jwt');
const { createTokenUser } = require('./createTokenUser');
const { checkPermissions } = require('./checkPermission');
module.exports = {
  createJWT,
  isTokenValid,
  attachCookies,
  createTokenUser,
  checkPermissions
};