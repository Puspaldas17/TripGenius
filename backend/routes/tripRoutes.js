import express from "express";
import Trip from "../models/Trip.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to check auth
const auth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// Create trip
router.post("/", auth, async (req, res) => {
  try {
    const { destination, startDate, endDate, itinerary, budget } = req.body;
    const trip = new Trip({ user: req.user, destination, startDate, endDate, itinerary, budget });
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all user trips
router.get("/", auth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
