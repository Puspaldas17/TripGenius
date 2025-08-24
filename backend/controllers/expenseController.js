// backend/controllers/expenseController.js
const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');

// helper to verify trip ownership (optional; assume req.user is set by auth middleware)
const ensureTripAccessible = async (tripId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(tripId)) return null;
  const trip = await Trip.findById(tripId);
  if (!trip) return null;
  // if you want strict ownership checks, uncomment:
  // if (trip.user.toString() !== userId.toString()) return 'forbidden';
  return trip;
};

// GET /api/trips/:tripId/expenses
exports.getExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await ensureTripAccessible(tripId, req.user?._id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip === 'forbidden') return res.status(403).json({ message: 'Forbidden' });

    const expenses = await Expense.find({ trip: tripId }).sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/trips/:tripId/expenses
exports.createExpense = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { title, category, amount, currency, date, notes, paidBy } = req.body;

    const trip = await ensureTripAccessible(tripId, req.user?._id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip === 'forbidden') return res.status(403).json({ message: 'Forbidden' });

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

// PUT /api/trips/:tripId/expenses/:expenseId
exports.updateExpense = async (req, res) => {
  try {
    const { tripId, expenseId } = req.params;

    const trip = await ensureTripAccessible(tripId, req.user?._id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip === 'forbidden') return res.status(403).json({ message: 'Forbidden' });

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

// DELETE /api/trips/:tripId/expenses/:expenseId
exports.deleteExpense = async (req, res) => {
  try {
    const { tripId, expenseId } = req.params;

    const trip = await ensureTripAccessible(tripId, req.user?._id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip === 'forbidden') return res.status(403).json({ message: 'Forbidden' });

    const expense = await Expense.findOneAndDelete({ _id: expenseId, trip: tripId });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ GET /api/trips/:tripId/expenses/summary
exports.getExpenseSummary = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await ensureTripAccessible(tripId, req.user?._id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip === 'forbidden') return res.status(403).json({ message: 'Forbidden' });

    // use aggregation for performance
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
