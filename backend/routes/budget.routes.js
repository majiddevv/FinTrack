import express from 'express';
import { body } from 'express-validator';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budget.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getBudgets)
  .post(
    [
      body('month')
        .matches(/^\d{4}-\d{2}$/)
        .withMessage('Month must be in YYYY-MM format'),
      body('category').notEmpty().withMessage('Category is required'),
      body('limitAmount')
        .isFloat({ min: 1 })
        .withMessage('Limit amount must be at least 1'),
    ],
    createBudget
  );

router
  .route('/:id')
  .put(updateBudget)
  .delete(deleteBudget);

export default router;

