import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import { validationResult } from 'express-validator';

// @desc    Get all categories for user
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { createdBy: req.user.id };
    
    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }

    const categories = await Category.find(filter).sort({ type: 1, name: 1 });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, type, color, icon } = req.body;

    const category = await Category.create({
      name,
      type,
      color,
      icon,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists for this type',
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res) => {
  try {
    let category = await Category.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { name, color, icon } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (color) updateData.color = color;
    if (icon) updateData.icon = icon;

    category = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category is in use
    const transactionCount = await Transaction.countDocuments({
      category: req.params.id,
    });

    if (transactionCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It is used in ${transactionCount} transaction(s).`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

