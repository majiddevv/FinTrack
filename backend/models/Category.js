import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    trim: true,
    maxlength: [30, 'Category name cannot be more than 30 characters'],
  },
  type: {
    type: String,
    required: [true, 'Please specify category type'],
    enum: ['income', 'expense'],
  },
  color: {
    type: String,
    default: '#6366f1',
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color'],
  },
  icon: {
    type: String,
    default: 'tag',
  },
  isDefault: {
    type: Boolean,
    default: false,
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

// Compound index for unique category name per user and type
categorySchema.index({ name: 1, type: 1, createdBy: 1 }, { unique: true });

export default mongoose.model('Category', categorySchema);

