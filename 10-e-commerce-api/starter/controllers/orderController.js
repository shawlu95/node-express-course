const Order = require('../models/Order');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const Error = require('../errors');
const { checkPermissions } = require('../utils');

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error.NotFoundError(`No order with id: ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK)
    .json(order);
};

const getCurrentUserOrder = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK)
    .json({ orders, count: orders.length });
};

const fakeStripeApi = async ({ amount, currency }) => {
  const client_secret = 'SECRET';
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new Error.BadRequestError('No cart items');
  }

  if (!tax || !shippingFee) {
    throw new Error.BadRequestError('Please provide tax and shipping fee');
  }

  // loop through cart items and calculate subtotal
  let orderItems = [];
  let subtotal = 0;
  for (const item of cartItems) {
    const dbProduct = await Product.findById(item.product);
    if (!dbProduct) {
      throw new Error.NotFoundError(`No product with id: ${item.product}`);
    }

    // create a cart item
    const { name, price, image } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: item.product
    };

    // add item to order
    orderItems = [...orderItems, singleOrderItem];
    subtotal += price * item.amount;

    console.log('dbProduct', singleOrderItem);
  }
  const total = tax + shippingFee + subtotal;
  const payment = await fakeStripeApi({ amount: total, currency: 'usd' });
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: payment.client_secret,
    user: req.user.userId
  });

  res.status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.client_secret });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error.NotFoundError(`No order with id: ${orderId}`);
  }
  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
  await order.save()
  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder
}
