const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);

const stripeController = async (req, res) => {
  const { purchase, total_amount, shipping_fee } = req.body;

  // in practice, don't use order amount from front end
  // must verify with backend logic
  const calculateOrderAmount = () => {
    return total_amount + shipping_fee;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(),
    currency: 'usd'
  });
  console.log(req.body);
  res.json({ clientSecret: paymentIntent.client_secret });
};

module.exports = stripeController;