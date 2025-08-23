// routes/tripRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Trip = require("../models/Trip");

const router = express.Router();

// Auth middleware
const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ msg: "No token provided" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ msg: "Invalid auth header" });

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

// Create trip
router.post("/", auth, async (req, res) => {
  try {
    const { destination, startDate, endDate, itinerary, budget } = req.body;
    if (!destination) return res.status(400).json({ msg: "destination required" });

    const trip = new Trip({
      user: req.userId,
      destination,
      startDate,
      endDate,
      itinerary: itinerary || [],
      budget: budget || 0
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all user trips
router.get("/", auth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get single trip
router.get("/:id", auth, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.userId });
    if (!trip) return res.status(404).json({ msg: "Trip not found" });
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update trip
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: "Trip not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete trip
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Trip.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ msg: "Trip not found" });
    res.json({ msg: "Trip deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
