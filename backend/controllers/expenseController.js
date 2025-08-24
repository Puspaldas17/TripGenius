const Expense = require("../models/Expense");
const Trip = require("../models/Trip");

// @desc Get all expenses for a trip
// @route GET /api/trips/:tripId/expenses
// @access Private
const getExpenses = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, user: req.user._id });
    if (!trip) return res.status(404).json({ message: "Trip not found or not authorized" });

    const expenses = await Expense.find({ trip: trip._id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add an expense
// @route POST /api/trips/:tripId/expenses
// @access Private
const addExpense = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    const trip = await Trip.findOne({ _id: req.params.tripId, user: req.user._id });
    if (!trip) return res.status(404).json({ message: "Trip not found or not authorized" });

    const expense = new Expense({
      trip: trip._id,
      description,
      amount,
      category,
      date,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update an expense
// @route PUT /api/trips/:tripId/expenses/:expenseId
// @access Private
const updateExpense = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    const expense = await Expense.findById(req.params.expenseId);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    const trip = await Trip.findOne({ _id: expense.trip, user: req.user._id });
    if (!trip) return res.status(401).json({ message: "Not authorized" });

    if (description !== undefined) expense.description = description;
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;

    await expense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete an expense
// @route DELETE /api/trips/:tripId/expenses/:expenseId
// @access Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.expenseId);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    const trip = await Trip.findOne({ _id: expense.trip, user: req.user._id });
    if (!trip) return res.status(401).json({ message: "Not authorized" });

    await expense.deleteOne();
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExpenses, addExpense, updateExpense, deleteExpense };
