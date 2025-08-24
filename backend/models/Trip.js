const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  activity: { type: String, required: true },
  time: { type: String }, // optional (e.g. "10:00 AM")
  notes: { type: String }, // optional
});

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: { type: Number },
    itinerary: [itinerarySchema], // embedded itinerary
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
