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
  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.pexels.com https://*.tile.openstreetmap.org",
      "connect-src 'self' https://api.openweathermap.org https://open.er-api.com https://nominatim.openstreetmap.org",
      "frame-ancestors 'none'",
    ].join("; "),
  );
  // Remove server fingerprint
  res.removeHeader("X-Powered-By");

  next();
};
