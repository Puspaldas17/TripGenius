// Get all trips
exports.getAllTrips = (req, res) => {
    res.status(200).json({ message: "All trips fetched successfully" });
};

// Get a single trip by ID
exports.getTripById = (req, res) => {
    const { id } = req.params;
    res.status(200).json({ message: `Trip with ID ${id} fetched successfully` });
};

// Create a new trip
exports.createTrip = (req, res) => {
    const newTrip = req.body;
    res.status(201).json({ message: "Trip created successfully", trip: newTrip });
};

// Update a trip
exports.updateTrip = (req, res) => {
    const { id } = req.params;
    const updatedTrip = req.body;
    res.status(200).json({ message: `Trip with ID ${id} updated successfully`, trip: updatedTrip });
};

// Delete a trip
exports.deleteTrip = (req, res) => {
    const { id } = req.params;
    res.status(200).json({ message: `Trip with ID ${id} deleted successfully` });
};
