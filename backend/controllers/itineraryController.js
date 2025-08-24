const Trip = require("../models/Trip");

// @desc Get itinerary items for a trip
// @route GET /api/trips/:tripId/itinerary
// @access Private
const getItineraryItems = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, user: req.user._id });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found or not authorized" });
    }

    res.json(trip.itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add itinerary item to a trip
// @route POST /api/trips/:tripId/itinerary
// @access Private
const addItineraryItem = async (req, res) => {
  try {
    const { day, activity, time, notes } = req.body;

    const trip = await Trip.findOne({ _id: req.params.tripId, user: req.user._id });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found or not authorized" });
    }

    const newItem = { day, activity, time, notes };
    trip.itinerary.push(newItem);
    await trip.save();

    res.status(201).json(trip.itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update itinerary item
// @route PUT /api/trips/:tripId/itinerary/:itemId
// @access Private
const updateItineraryItem = async (req, res) => {
  try {
    const { day, activity, time, notes } = req.body;

    const trip = await Trip.findOne({ _id: req.params.tripId, user: req.user._id });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found or not authorized" });
    }

    const item = trip.itinerary.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Itinerary item not found" });
    }

    // update fields only if provided
    if (day !== undefined) item.day = day;
    if (activity !== undefined) item.activity = activity;
    if (time !== undefined) item.time = time;
    if (notes !== undefined) item.notes = notes;

    await trip.save();

    res.json({ message: "Itinerary item updated", itinerary: trip.itinerary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete itinerary item
// @route DELETE /api/trips/:tripId/itinerary/:itemId
// @access Private
const deleteItineraryItem = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, user: req.user._id });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found or not authorized" });
    }

    trip.itinerary = trip.itinerary.filter(
      (item) => item._id.toString() !== req.params.itemId
    );
    await trip.save();

    res.json({ message: "Itinerary item deleted", itinerary: trip.itinerary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getItineraryItems,
  addItineraryItem, 
  updateItineraryItem, 
  deleteItineraryItem 
};
