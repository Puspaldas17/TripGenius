import { RequestHandler } from "express";
import { z } from "zod";

// Simple in-memory user store (in production, use a real database)
interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
  emailVerified: boolean;
  verificationToken?: string;
}

const users: Map<string, StoredUser> = new Map();

// Demo user for testing
users.set("demo@tripgenius.com", {
  id: "demo-user-1",
  email: "demo@tripgenius.com",
  name: "Demo User",
  passwordHash: "hashed_password_demo123", // In production, hash with bcrypt
  createdAt: new Date().toISOString(),
  emailVerified: true,
});

const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Simple JWT-like token generator (in production, use real JWT)
function generateToken(userId: string): string {
  return `token_${userId}_${Date.now()}`;
}

export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const { email, name, password } = signupSchema.parse(req.body);

    // Check if user exists
    if (users.has(email)) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user
    const userId = `user_${Date.now()}`;
    const user: StoredUser = {
      id: userId,
      email,
      name,
      passwordHash: password, // In production: bcrypt.hash(password, 10)
      createdAt: new Date().toISOString(),
      emailVerified: false,
      verificationToken: `verify_${userId}_${Math.random().toString(36)}`,
    };

    users.set(email, user);

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
    res.status(500).json({ message: "Signup failed" });
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = users.get(email);

    if (!user || user.passwordHash !== password) {
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
    res.status(500).json({ message: "Login failed" });
  }
};

export const handleVerifyEmail: RequestHandler = async (req, res) => {
  try {
    const { token } = req.body;

    let foundUser: StoredUser | null = null;
    for (const user of users.values()) {
      if (user.verificationToken === token) {
        foundUser = user;
        break;
      }
    }

    if (!foundUser) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    foundUser.emailVerified = true;
    foundUser.verificationToken = undefined;

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};

export const handleGetMe: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // In production, verify JWT properly
    const token = authHeader.replace("Bearer ", "");

    let foundUser: StoredUser | null = null;
    for (const user of users.values()) {
      if (generateToken(user.id) === token) {
        foundUser = user;
        break;
      }
    }

    // For demo user, accept the token format
    if (!foundUser && token.includes("demo")) {
      const demoUser = users.get("demo@tripgenius.com");
      if (demoUser) foundUser = demoUser;
    }

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.json({
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      createdAt: foundUser.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Auth check failed" });
  }
};
