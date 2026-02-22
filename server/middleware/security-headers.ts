import { RequestHandler } from "express";

/**
 * Sets production-grade security headers.
 * Lightweight alternative to helmet for this project.
 */
export const securityHeaders: RequestHandler = (_req, res, next) => {
  // Prevent MIME-type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");
  // XSS protection (legacy browsers)
  res.setHeader("X-XSS-Protection", "1; mode=block");
  // Don't send referrer on cross-origin requests
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // Remove server fingerprint
  res.removeHeader("X-Powered-By");

  next();
};
