import path from "path";
import { createServer } from "./index";
import * as express from "express";
import mongoose from "mongoose";
import { connectDB } from "./db";
import { logger } from "./utils/logger";

const app = createServer();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files with caching
app.use(
  express.static(distPath, {
    maxAge: "1y",
    immutable: true,
    index: false, // Don't serve index.html for directory requests via static
  }),
);

// Handle React Router - serve index.html for all non-API routes
app.get(/.*/, (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  // index.html should not be cached (so new deploys take effect)
  res.set("Cache-Control", "no-cache");
  res.sendFile(path.join(distPath, "index.html"));
});

const server = app.listen(port, () => {
  logger.info(`TripGenius server running on port ${port}`, "startup");
  logger.info(`Frontend: http://localhost:${port}`, "startup");
  logger.info(`API: http://localhost:${port}/api`, "startup");
});

// --- Process error handlers ---
process.on("unhandledRejection", (reason) => {
  logger.error("process", "Unhandled rejection", reason);
});

process.on("uncaughtException", (err) => {
  logger.error("process", "Uncaught exception", err);
  // Give time for logs to flush, then exit
  setTimeout(() => process.exit(1), 500);
});

// --- Graceful shutdown ---
let isShuttingDown = false;

async function shutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`Received ${signal}, shutting down gracefully...`, "shutdown");

  // Stop accepting new connections
  server.close(() => {
    logger.info("HTTP server closed", "shutdown");
  });

  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed", "shutdown");
  } catch (err) {
    logger.error("shutdown", "Failed to close MongoDB connection", err);
  }

  // Allow time for in-flight requests to complete
  setTimeout(() => {
    logger.warn("Forcing shutdown after timeout", "shutdown");
    process.exit(1);
  }, 10_000);

  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
