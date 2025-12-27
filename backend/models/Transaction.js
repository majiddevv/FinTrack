import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Please specify transaction type'],
    enum: ['income', 'expense'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: [0.01, 'Amount must be greater than 0'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
    default: Date.now,
  },
  note: {
    type: String,
    trim: true,
    maxlength: [200, 'Note cannot be more than 200 characters'],
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank', 'other'],
    default: 'cash',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
transactionSchema.index({ createdBy: 1, date: -1 });
transactionSchema.index({ createdBy: 1, type: 1, date: -1 });

export default mongoose.model('Transaction', transactionSchema);

