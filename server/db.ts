import mongoose from "mongoose";

export async function connectDB() {
    try {
        const uri = process.env.MONGO_URI || "mongodb://localhost:27017/tripgenius";

        await mongoose.connect(uri);

        console.log("✅ MongoDB connected successfully");

        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("⚠️ MongoDB disconnected");
        });

    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}
