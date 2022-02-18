const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  // a path that points to the image on server
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Product', ProductSchema);