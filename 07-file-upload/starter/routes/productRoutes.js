const express = require('express');
const router = express.Router();

const { create, getAll } = require('../controllers/productController');
const { upload } = require('../controllers/uploadsController');

router.route('/').post(create).get(getAll);
router.route('/upload').post(upload);

module.exports = router;