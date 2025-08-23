// models/Trip.js
const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  destination: { type: String, required: true },
  startDate: Date,
  endDate: Date,
  itinerary: { type: Array, default: [] },
  budget: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);
