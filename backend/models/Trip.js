import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  destination: String,
  startDate: Date,
  endDate: Date,
  itinerary: Array,
  budget: Number
}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);
