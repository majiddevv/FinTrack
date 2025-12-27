import express from 'express';
import { body } from 'express-validator';
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transaction.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

const transactionValidation = [
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be income or expense'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('category').notEmpty().withMessage('Category is required'),
  body('date').notEmpty().withMessage('Date is required'),
];

router
  .route('/')
  .get(getTransactions)
  .post(transactionValidation, createTransaction);

router
  .route('/:id')
  .get(getTransaction)
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;

