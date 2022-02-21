const Error = require('../errors');

const checkPermissions = (requestUser, resourceUserId) => {
  // console.log(requestUser, resourceUserId);

  // admin can check everyone
  if (requestUser.role === 'admin') return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new Error.UnauthorizedError('Not authorized');
}

module.exports = { checkPermissions };