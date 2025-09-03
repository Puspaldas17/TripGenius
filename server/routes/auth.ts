import { RequestHandler } from "express";
import crypto from "crypto";
import { signJwt } from "../utils/jwt";

type User = { id: string; name: string; email: string; passwordHash: string; salt: string };
const users = new Map<string, User>();

function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export const signup: RequestHandler = (req, res) => {
  const { name, email, password } = req.body ?? {};
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
  if (users.has(email)) return res.status(409).json({ error: "Email already registered" });
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);
  const user: User = { id: crypto.randomUUID(), name, email, passwordHash, salt };
  users.set(email, user);
  const token = signJwt({ sub: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET || "dev_secret_change_me");
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
};

export const login: RequestHandler = (req, res) => {
  const { email, password } = req.body ?? {};
  const u = users.get(email);
  if (!u) return res.status(401).json({ error: "Invalid credentials" });
  const attempt = hashPassword(password ?? "", u.salt);
  if (attempt !== u.passwordHash) return res.status(401).json({ error: "Invalid credentials" });
  const token = signJwt({ sub: u.id, email: u.email, name: u.name }, process.env.JWT_SECRET || "dev_secret_change_me");
  res.json({ token, user: { id: u.id, name: u.name, email: u.email } });
};
