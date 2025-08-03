const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createTrip,
  getAllTrips,
  getUserTrips,
  deleteTrip,
} = require("../controllers/tripController");

// Routes
router.post("/", protect, createTrip);
router.get("/", getAllTrips);
router.get("/user", protect, getUserTrips);
router.delete("/:id", protect, deleteTrip);

module.exports = router;
