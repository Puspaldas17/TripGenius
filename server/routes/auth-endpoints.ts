import { RequestHandler } from "express";
import { z } from "zod";
import { User } from "../models/User";
import crypto from "crypto";

// Simple JWT-like token generator (in production, use real JWT)
function generateToken(userId: string): string {
  return `token_${userId}_${Date.now()}`;
}

// Hash password using scrypt (built-in, no extra dependency)
function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex") === key);
    });
  });
}

const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const { email, name, password } = signupSchema.parse(req.body);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user
    const userId = `user_${Date.now()}`;
    // In production: bcrypt.hash(password, 10)

    const user = await User.create({
      id: userId,
      email,
      name,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
      emailVerified: false,
      verificationToken: `verify_${userId}_${Math.random().toString(36)}`,
    });

    const token = generateToken(userId);

    // In production: send verification email with user.verificationToken
    console.log(
      `[Email Verification] Send email to ${email} with token: ${user.verificationToken}`,
    );

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const handleVerifyEmail: RequestHandler = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

export const handleGetMe: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");

    // Logic to parse token: token_USERID_TIMESTAMP
    // This assumes the token format created by generateToken
    const parts = token.split("_");
    // basic validation of format
    if (parts.length < 4 || parts[0] !== "token") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // userId is everything between leading "token" and trailing timestamp
    const userId = parts.slice(1, -1).join("_"); // extract user ID

    // Find user by ID
    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Auth check failed" });
  }
};
