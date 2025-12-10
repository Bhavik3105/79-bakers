// models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Chocolate', 'Fruit', 'Eggless', 'Customize']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  inStock: {
    type: Boolean,
    default: true
  },
  ingredients: [{
    type: String
  }],
  allergens: [{
    type: String
  }],
  sizes: [{
    weight: String,
    price: Number,
    serves: String
  }],
  occasions: [{
    type: String
  }],
  isVegetarian: {
    type: Boolean,
    default: true
  },
  isEggless: {
    type: Boolean,
    default: false
  },
  preparationTime: {
    type: String,
    default: '24 hours'
  },
  customizable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
