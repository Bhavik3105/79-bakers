// models/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest checkout
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String, // Store name for history
    price: Number, // Store price at time of order
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: String,
    customization: String
  }],
  customerInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  deliveryAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    landmark: String
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  deliveryTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true
  },
  specialInstructions: String,
  cakeMessage: String,
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: Date,
    note: String
  }],
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
OrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add status to history when changed
OrderSchema.pre('save', function(next) {
  if (this.isModified('orderStatus')) {
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
      note: `Status changed to ${this.orderStatus}`
    });
  }
  next();
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
