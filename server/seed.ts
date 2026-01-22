import { User } from "./models/User";
import { connectDB } from "./db";
import "dotenv/config";

async function seed() {
    await connectDB();

    const demoEmail = "demo@tripgenius.com";
    console.log("🌱 Seeding demo user...");
    await User.findOneAndUpdate(
        { email: demoEmail },
        {
            id: "demo-user-1",
            email: demoEmail,
            name: "Demo User",
            passwordHash: "Demo@123", // Matches UI hint and satisfies complexity requirements
            createdAt: new Date().toISOString(),
            emailVerified: true,
        },
        { upsert: true, new: true }
    );
    console.log("✅ Demo user seeded with password: Demo@123");

    process.exit(0);
}

seed();
