const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');

const create = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAll = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products });
};

module.exports = { create, getAll };