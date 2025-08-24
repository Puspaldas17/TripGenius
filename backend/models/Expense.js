// backend/models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true,
    },
    title: { type: String, required: true }, // e.g., "Hotel", "Food"
    category: {
      type: String,
      enum: ['transport', 'stay', 'food', 'activity', 'shopping', 'misc'],
      default: 'misc',
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
