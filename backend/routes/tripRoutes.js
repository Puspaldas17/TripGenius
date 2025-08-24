const express = require("express");
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");
const itineraryRoutes = require("./itineraryRoutes");

const router = express.Router();

// Trip routes
router.post("/", protect, createTrip);
router.get("/", protect, getTrips);
router.get("/:id", protect, getTripById);
router.put("/:id", protect, updateTrip);
router.delete("/:id", protect, deleteTrip);

// Nested Itinerary routes
router.use("/:tripId/itinerary", itineraryRoutes);

module.exports = router;
