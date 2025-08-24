// routes/tripRoutes.js
const express = require("express");
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes
router.post("/", protect, createTrip);      // Create trip
router.get("/", protect, getTrips);         // Get all trips
router.get("/:id", protect, getTripById);   // Get trip by ID
router.put("/:id", protect, updateTrip);    // Update trip
router.delete("/:id", protect, deleteTrip); // Delete trip

module.exports = router;
