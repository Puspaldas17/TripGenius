import { RequestHandler } from "express";
import { verifyJwt } from "../utils/jwt";

export const requireAuth: RequestHandler = (req, res, next) => {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  const user = verifyJwt(token, secret);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  (req as any).user = user;
  next();
};
