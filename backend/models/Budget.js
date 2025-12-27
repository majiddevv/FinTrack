import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  month: {
    type: String,
    required: [true, 'Please provide a month'],
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category'],
  },
  limitAmount: {
    type: Number,
    required: [true, 'Please provide a budget limit'],
    min: [1, 'Budget limit must be at least 1'],
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

// Compound index for unique budget per category per month per user
budgetSchema.index({ month: 1, category: 1, createdBy: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);

