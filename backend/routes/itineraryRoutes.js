const express = require("express");
const {
  getItineraryItems,
  addItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
} = require("../controllers/itineraryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true }); // allow access to :tripId

router.get("/", protect, getItineraryItems);             // Get all items
router.post("/", protect, addItineraryItem);             // Add item
router.put("/:itemId", protect, updateItineraryItem);    // Update item
router.delete("/:itemId", protect, deleteItineraryItem); // Delete item

module.exports = router;
