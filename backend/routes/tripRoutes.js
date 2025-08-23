// backend/routes/tripRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Trip = require("../models/Trip");

// @route   POST /api/trips
// @desc    Create a new trip
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { destination, startDate, endDate, itinerary, budget } = req.body;

    if (!destination) {
      return res.status(400).json({ message: "Destination is required" });
    }

    const trip = await Trip.create({
      user: req.user,
      destination,
      startDate,
      endDate,
      itinerary: itinerary || [],
      budget: budget || 0,
    });

    res.status(201).json(trip);
  } catch (err) {
    console.error("Error creating trip:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/trips
// @desc    Get all trips for logged-in user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    console.error("Error fetching trips:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
