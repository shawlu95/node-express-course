const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide product name'],
    maxLength: [100, 'Name cannot exceed 100 chars']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product npriceme'],
    default: 0
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    maxLength: [1000, 'Description cannot exceed 1000 chars']
  },
  image: {
    type: String,
    default: '/uploads/example.jpeg'
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    enum: ['office', 'kitchen', 'bedroom'],
    default: 'office'
  },
  company: {
    type: String,
    required: [true, 'Please provide company'],
    enum: {
      values: ['ikea', 'liddy', 'marcos'],
      message: '{VALUE} is not supported'
    }
  },
  colors: {
    type: [String], // array of strings
    default: ['#222'],
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  freeShipping: {
    type: Boolean,
    default: false
  },
  inventory: {
    type: Number,
    required: true,
    default: 15
  },
  averageRating: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user']
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// name of virtual field: reviews
// local key: _id (in ProductSchema)
// foreign key: 'product (specified in ReviewSchema)
ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false, // get list
  // match: { rating: 5 } // apply filters as needed
});

// before removing a product, remove all of its reviews
ProductSchema.pre('remove', async function (next) {
  await this.model('Review').deleteMany({ product: this._id });
  next();
})

module.exports = mongoose.model('Product', ProductSchema);