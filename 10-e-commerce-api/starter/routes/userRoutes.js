const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermission } = require('../middleware/authentication');
const {
  getAllUsers,
  getUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
} = require('../controllers/userController');

router.route('/').get(authenticateUser, authorizePermission('admin', 'owner'), getAllUsers);

// must come before the `/:id` route! Or "showMe" will be treated as :id
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);
router.route('/:id').get(authenticateUser, getUser);

module.exports = router;