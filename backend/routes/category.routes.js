import express from 'express';
import { body } from 'express-validator';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getCategories)
  .post(
    [
      body('name').trim().notEmpty().withMessage('Category name is required'),
      body('type')
        .isIn(['income', 'expense'])
        .withMessage('Type must be income or expense'),
    ],
    createCategory
  );

router
  .route('/:id')
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;

