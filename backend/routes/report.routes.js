import express from 'express';
import {
  getMonthlySummary,
  getCategoryBreakdown,
  getDailySpending,
} from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getMonthlySummary);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/daily-spending', getDailySpending);

export default router;

