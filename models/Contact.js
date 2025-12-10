// models/Contact.js
import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  repliedAt: Date,
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
