const dotenv = require("dotenv");
dotenv.config(); // <--- Always FIRST

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const tripRoutes = require("./routes/tripRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());

console.log("MONGO_URI being used:", process.env.MONGO_URI); // Debug

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/trips", tripRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
