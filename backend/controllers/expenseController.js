// backend/controllers/expenseController.js
const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');

// helper to check trip ownership (optional)
const ensureTripAccessible = async (tripId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(tripId)) return null;
  const trip = await Trip.findById(tripId);
  if (!trip) return null;

  // Uncomment if you want strict ownership check:
  // if (trip.user.toString() !== userId.toString()) return 'forbidden';

  return trip;
};

// @desc Get all expenses for a trip
// @route GET /api/trips/:tripId/expenses
// @access Private
exports.getExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await ensureTripAccessible(tripId, req.user?._id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const expenses = await Expense.find({ trip: tripId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc Create a new expense
// @route POST /api/trips/:tripId/expenses
// @access Private
exports.createExpense = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { title, category, amount, currency, date, notes, paidBy } = req.body;

    const trip = await ensureTripAccessible(tripId, req.user?._id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const expense = await Expense.create({
      trip: tripId,
      title,
      category,
      amount,
      currency,
      date,
      notes,
      paidBy,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: 'Bad request', error: err.message });
  }
};

// @desc Update an expense
// @route PUT /api/trips/:tripId/expenses/:expenseId
// @access Private
exports.updateExpense = async (req, res) => {
  try {
    const { tripId, expenseId } = req.params;

    const trip = await ensureTripAccessible(tripId, req.user?._id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const expense = await Expense.findOneAndUpdate(
      { _id: expenseId, trip: tripId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    res.json(expense);
  } catch (err) {
    res.status(400).json({ message: 'Bad request', error: err.message });
  }
};

// @desc Delete an expense
// @route DELETE /api/trips/:tripId/expenses/:expenseId
// @access Private
exports.deleteExpense = async (req, res) => {
  try {
    const { tripId, expenseId } = req.params;

    const trip = await ensureTripAccessible(tripId, req.user?._id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const expense = await Expense.findOneAndDelete({ _id: expenseId, trip: tripId });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ @desc Get expense summary (total vs budget)
// @route GET /api/trips/:tripId/expenses/summary
// @access Private
exports.getExpenseSummary = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await ensureTripAccessible(tripId, req.user?._id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Aggregate for better performance
    const [agg] = await Expense.aggregate([
      { $match: { trip: new mongoose.Types.ObjectId(tripId) } },
      { $group: { _id: null, totalExpenses: { $sum: '$amount' } } },
    ]);

    const totalExpenses = agg?.totalExpenses || 0;
    const budget = trip.budget || 0;
    const remainingBudget = budget - totalExpenses;
    const percentageUsed = budget > 0 ? Number(((totalExpenses / budget) * 100).toFixed(2)) : 0;

    res.json({
      tripId,
      budget,
      totalExpenses,
      remainingBudget,
      percentageUsed,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
