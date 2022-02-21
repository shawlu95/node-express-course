const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const Error = require('../errors');
const path = require('path');

const createProduct = async (req, res) => {
  console.log(req.body, req.user.userId);
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({})
    .populate('reviews');
  res.status(StatusCodes.OK).json({ products });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product
    .findById(productId)
    .populate('reviews');
  if (!product) {
    throw new Error.NotFoundError(`No product with id: ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new Error.NotFoundError(`No product with id: ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error.NotFoundError(`No product with id: ${productId}`);
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: 'Product removed' });
};

const uploadProductImage = async (req, res) => {
  console.log(req.files.image);
  if (!req.files.image) {
    throw new Error.BadRequestError('Please provide image');
  }
  const image = req.files.image;
  if (!image.mimetype.startsWith('image')) {
    throw new Error.BadRequestError('Not an image');
  }
  const maxSize = 1024 ** 2;
  if (image.size > maxSize) {
    throw new Error.BadRequestError('Image exceeds 1mb');
  }
  const imagePath = path.join(__dirname, '../public/uploads/' + image.name);
  await image.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: imagePath });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
};