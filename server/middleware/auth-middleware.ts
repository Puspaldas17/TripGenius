import { RequestHandler } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");

    // In production, verify JWT properly with a secret key
    // For now, just extract userId from token format: token_userId_timestamp
    const parts = token.split("_");

    if (parts[0] !== "token" || parts.length < 4) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // userId is everything between the leading "token" and the trailing timestamp
    req.userId = parts.slice(1, -1).join("_");
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};
