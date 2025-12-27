import Transaction from '../models/Transaction.js';
import { validationResult } from 'express-validator';

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const { month, type, categoryId, search, page = 1, limit = 10 } = req.query;
    const filter = { createdBy: req.user.id };

    // Filter by month (YYYY-MM format)
    if (month) {
      const [year, monthNum] = month.split('-').map(Number);
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }

    if (categoryId) {
      filter.category = categoryId;
    }

    if (search) {
      filter.note = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(filter);

    const transactions = await Transaction.find(filter)
      .populate('category', 'name type color icon')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    }).populate('category', 'name type color icon');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { type, amount, category, date, note, paymentMethod } = req.body;

    const transaction = await Transaction.create({
      type,
      amount,
      category,
      date,
      note,
      paymentMethod,
      createdBy: req.user.id,
    });

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('category', 'name type color icon');

    res.status(201).json({ success: true, data: populatedTransaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const { type, amount, category, date, note, paymentMethod } = req.body;

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { type, amount, category, date, note, paymentMethod },
      { new: true, runValidators: true }
    ).populate('category', 'name type color icon');

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

