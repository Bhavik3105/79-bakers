// models/Review.js
import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Comment is required']
  },
  images: [{
    type: String
  }],
  isVerified: {
    type: Boolean,
    default: false // True if user actually purchased
  },
  helpful: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update product rating when review is added
ReviewSchema.post('save', async function() {
  const Product = mongoose.model('Product');
  const reviews = await mongoose.model('Review').find({ product: this.product });
  
  const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  await Product.findByIdAndUpdate(this.product, {
    rating: avgRating.toFixed(1),
    reviewCount: reviews.length
  });
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
