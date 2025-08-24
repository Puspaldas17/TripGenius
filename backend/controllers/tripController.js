// controllers/tripController.js
const Trip = require("../models/Trip");

// @desc Create a new trip
// @route POST /api/trips
// @access Private
const createTrip = async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, itinerary } = req.body;

    const trip = await Trip.create({
      user: req.user._id,
      destination,
      startDate,
      endDate,
      budget,
      itinerary: itinerary || [],
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all trips for logged-in user
// @route GET /api/trips
// @access Private
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single trip by ID
// @route GET /api/trips/:id
// @access Private
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a trip
// @route PUT /api/trips/:id
// @access Private
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ message: "Trip not found or not authorized" });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a trip
// @route DELETE /api/trips/:id
// @access Private
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found or not authorized" });
    }

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};
