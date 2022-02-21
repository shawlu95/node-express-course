const Review = require('../models/Review');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const Error = require('../errors');
const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error.NotFoundError(`No product with id: ${productId}`);
  }

  const alreadyReviewed = await Review.findOne(
    { product: productId, user: req.user.userId });
  if (alreadyReviewed) {
    throw new Error.BadRequestError('Already submitted review');
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
}

const getAllReview = async (req, res) => {
  const reviews = await Review.find({})
    .populate({ path: 'product', select: 'name company price' })
    .populate({ path: 'user', select: 'name' }); // retrieve foreign key's data
  res.status(StatusCodes.OK).json({ reviews });
}

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error.NotFoundError(`No review with id: ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
}

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error.NotFoundError(`No review with id: ${reviewId}`);
  }
  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  // validators are run by default
  await review.save();

  // another method, not so clean
  // const updated = await Review.findByIdAndUpdate(reviewId, req.body, {
  //   new: true,
  //   runValidators: true
  // });

  res.status(StatusCodes.OK).json({ review });
}

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error.NotFoundError(`No review with id: ${reviewId}`);
  }
  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "Review removed" });
}

// can be placed in either product or review controller
const getSingleProductReview = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
}

module.exports = {
  createReview,
  getAllReview,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReview
};