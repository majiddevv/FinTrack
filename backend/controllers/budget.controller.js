import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import { validationResult } from 'express-validator';

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res) => {
  try {
    const { month } = req.query;
    const filter = { createdBy: req.user.id };

    if (month) {
      filter.month = month;
    }

    const budgets = await Budget.find(filter).populate('category', 'name color icon');

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const [year, monthNum] = budget.month.split('-').map(Number);
        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

        const spent = await Transaction.aggregate([
          {
            $match: {
              createdBy: budget.createdBy,
              category: budget.category._id,
              type: 'expense',
              date: { $gte: startDate, $lte: endDate },
            },
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        return {
          ...budget.toObject(),
          spent: spent[0]?.total || 0,
          percentage: Math.min(100, Math.round(((spent[0]?.total || 0) / budget.limitAmount) * 100)),
          exceeded: (spent[0]?.total || 0) > budget.limitAmount,
        };
      })
    );

    res.status(200).json({ success: true, count: budgetsWithSpent.length, data: budgetsWithSpent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { month, category, limitAmount } = req.body;

    const budget = await Budget.create({
      month,
      category,
      limitAmount,
      createdBy: req.user.id,
    });

    const populatedBudget = await Budget.findById(budget._id)
      .populate('category', 'name color icon');

    res.status(201).json({ success: true, data: populatedBudget });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Budget for this category and month already exists',
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    const { limitAmount } = req.body;

    budget = await Budget.findByIdAndUpdate(
      req.params.id,
      { limitAmount },
      { new: true, runValidators: true }
    ).populate('category', 'name color icon');

    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    await Budget.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

