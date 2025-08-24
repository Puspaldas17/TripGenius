// backend/routes/expenseRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// list + create
router.get('/', protect, getExpenses);
router.post('/', protect, createExpense);

// update + delete
router.put('/:expenseId', protect, updateExpense);
router.delete('/:expenseId', protect, deleteExpense);

// ✅ summary
router.get('/summary', protect, getExpenseSummary);

module.exports = router;
