import { User } from "./models/User";
import { connectDB } from "./db";
import crypto from "crypto";
import "dotenv/config";

function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

async function seed() {
  await connectDB();

  const demoEmail = "demo@tripgenius.com";
  console.log("🌱 Seeding demo user...");
  const hashedPassword = await hashPassword("Demo@123");
  await User.findOneAndUpdate(
    { email: demoEmail },
    {
      id: "demo-user-1",
      email: demoEmail,
      name: "Demo User",
      passwordHash: hashedPassword,
      createdAt: new Date().toISOString(),
      emailVerified: true,
    },
    { upsert: true, new: true },
  );
  console.log("✅ Demo user seeded with password: Demo@123");

  process.exit(0);
}

seed();
