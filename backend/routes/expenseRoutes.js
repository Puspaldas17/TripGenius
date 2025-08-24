const express = require("express");
const {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true });

router.get("/", protect, getExpenses);              // Get all expenses
router.post("/", protect, addExpense);              // Add expense
router.put("/:expenseId", protect, updateExpense);  // Update expense
router.delete("/:expenseId", protect, deleteExpense); // Delete expense

module.exports = router;
