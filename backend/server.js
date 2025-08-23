const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes"); // ✅ import router

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes); // ✅ this must be a router

app.use("/api/trips", require("./routes/tripRoutes"));


// MongoDB connection + server start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));
