import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

// @desc    Get monthly summary
// @route   GET /api/reports/summary
// @access  Private
export const getMonthlySummary = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide month in YYYY-MM format',
      });
    }

    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    const summary = await Transaction.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const income = summary.find((s) => s._id === 'income')?.total || 0;
    const expense = summary.find((s) => s._id === 'expense')?.total || 0;

    res.status(200).json({
      success: true,
      data: {
        income,
        expense,
        net: income - expense,
        month,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get category breakdown
// @route   GET /api/reports/category-breakdown
// @access  Private
export const getCategoryBreakdown = async (req, res) => {
  try {
    const { month, type = 'expense' } = req.query;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide month in YYYY-MM format',
      });
    }

    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    const breakdown = await Transaction.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.id),
          type,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryName: '$category.name',
          categoryColor: '$category.color',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    const grandTotal = breakdown.reduce((sum, item) => sum + item.total, 0);

    const breakdownWithPercentage = breakdown.map((item) => ({
      ...item,
      percentage: grandTotal > 0 ? Math.round((item.total / grandTotal) * 100) : 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        breakdown: breakdownWithPercentage,
        total: grandTotal,
        month,
        type,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get daily spending for chart
// @route   GET /api/reports/daily-spending
// @access  Private
export const getDailySpending = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide month in YYYY-MM format',
      });
    }

    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);
    const daysInMonth = new Date(year, monthNum, 0).getDate();

    const dailyData = await Transaction.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Create array with all days
    const chartData = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      date: `${month}-${String(i + 1).padStart(2, '0')}`,
      income: 0,
      expense: 0,
    }));

    dailyData.forEach((item) => {
      const idx = item._id.day - 1;
      chartData[idx][item._id.type] = item.total;
    });

    res.status(200).json({ success: true, data: chartData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

