const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/trips/:tripId/expenses", expenseRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("TripGenius API is running 🚀");
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
