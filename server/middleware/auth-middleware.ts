import { RequestHandler } from "express";
import { verifyJwt } from "../utils/jwt";
import { env } from "../utils/env";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Verifies the Bearer JWT and sets `req.userId` from the `sub` claim.
 */
export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.slice(7);
    const secret = env().JWT_SECRET || "dev_secret_change_me";
    const payload = verifyJwt(token, secret);

    if (!payload || !payload.sub) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.userId = payload.sub as string;
    next();
  } catch (_error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};
