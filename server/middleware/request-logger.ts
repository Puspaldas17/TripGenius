import { RequestHandler } from "express";
import crypto from "crypto";
import { logger } from "../utils/logger";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

/**
 * Attaches a unique request ID and logs request/response timing.
 */
export const requestLogger: RequestHandler = (req, res, next) => {
  const requestId = crypto.randomUUID().slice(0, 8);
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  const start = performance.now();

  res.on("finish", () => {
    const duration = (performance.now() - start).toFixed(1);
    const level =
      res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";

    logger[level === "error" ? "error" : level === "warn" ? "warn" : "info"](
      "http",
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
      { requestId, ip: req.ip },
    );
  });

  next();
};
