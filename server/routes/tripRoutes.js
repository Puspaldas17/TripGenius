const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

// Route to get all trips
router.get("/", tripController.getAllTrips);

// Route to get a trip by ID
router.get("/:id", tripController.getTripById);

// Route to create a new trip
router.post("/", tripController.createTrip);

// Route to update a trip
router.put("/:id", tripController.updateTrip);

// Route to delete a trip
router.delete("/:id", tripController.deleteTrip);

module.exports = router;
