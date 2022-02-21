const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please provide rating']
  },
  title: {
    type: String,
    trim: true,
    maxLength: 100,
    required: [true, 'Please provide title']
  },
  comment: {
    type: String,
    trim: true,
    maxLength: 100,
    required: [true, 'Please provide review text']
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, { timeseries: true });

// ensure user can only leave one review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// class method, as compared to ReviewSchema.methods (instance method)
ReviewSchema.statics.calculateAverageRating = async function (productId) {
  console.log("calculate avg rating", productId);
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product', // can be null in this case, because only one productId
        averageRating: { $avg: '$rating' },
        ratingCount: { $sum: 1 }
      }
    }
  ]);
  console.log(result);
  try {
    await this.model('Product').findByIdAndUpdate(productId, {
      averageRating: Math.ceil(result[0]?.averageRating || 0),
      ratingCount: result[0]?.ratingCount || 0
    });
  } catch (error) {
    console.log(error)
  }
};

// triggered by .save()
// trigger calculate rating avg
ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product);
  console.log('post save')
});

// triggered by .remove()
// trigger calculate rating avg
ReviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.product);
  console.log('post remove')
});

module.exports = mongoose.model('Review', ReviewSchema);