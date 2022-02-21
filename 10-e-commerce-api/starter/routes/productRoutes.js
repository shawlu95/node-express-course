const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermission } = require('../middleware/authentication');
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
} = require('../controllers/productController');
const { getSingleProductReview } = require('../controllers/reviewController');

router.route('/')
  .post([authenticateUser, authorizePermission('admin')], createProduct)
  .get(getAllProducts); // user can get all products

// Must come before `/:id` route
router.route('/uploadImage')
  .post([authenticateUser, authorizePermission('admin')], uploadProductImage);

router.route('/:id')
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermission('admin')], updateProduct)
  .delete([authenticateUser, authorizePermission('admin')], deleteProduct);

router.route('/:id/reviews').get(getSingleProductReview);

module.exports = router;