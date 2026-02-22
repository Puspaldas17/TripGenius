import "dotenv/config";
import express from "express";
import cors from "cors";
import { validateEnv } from "./utils/env";
import { logger } from "./utils/logger";
import { requestLogger } from "./middleware/request-logger";
import { securityHeaders } from "./middleware/security-headers";
import { rateLimit } from "./middleware/rate-limit";
import { handleDemo } from "./routes/demo";
import {
  handleSignup,
  handleLogin,
  handleVerifyEmail,
  handleGetMe,
} from "./routes/auth-endpoints";
import {
  handleCreateTrip,
  handleGetUserTrips,
  handleGetTrip,
  handleUpdateTrip,
  handleToggleFavorite,
  handleDeleteTrip,
} from "./routes/trips";
import { authMiddleware } from "./middleware/auth-middleware";
import { generateItinerary } from "./routes/ai";
import { getWeather } from "./routes/weather";
import { searchFlights, searchHotels } from "./routes/search";
import { convertCurrency } from "./routes/currency";
import { reverseGeocode } from "./routes/geocode";
import { geocodeSearch, travelOptions } from "./routes/travel";
import { getPlaces } from "./routes/places";
import { aiChat } from "./routes/chat";
import { visaCheck } from "./routes/visa";
import { getEvents } from "./routes/events";
import { collabPublish, collabSubscribe } from "./routes/collab";

export function createServer() {
  // Validate environment variables on startup
  const config = validateEnv();

  const app = express();

  // ─── Global Middleware ──────────────────────────────────────────────────────
  app.use(securityHeaders);
  app.use(
    cors({
      origin:
        config.NODE_ENV === "production"
          ? [/\.tripgenius\.com$/, /\.netlify\.app$/, /\.vercel\.app$/]
          : true,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // ─── Health & Status ────────────────────────────────────────────────────────
  app.get("/health", (_req, res) =>
    res.json({
      status: "ok",
      env: config.NODE_ENV,
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    }),
  );

  app.get("/api/ping", (_req, res) => {
    res.json({ message: config.PING_MESSAGE });
  });

  app.get("/api/demo", handleDemo);

  // ─── Auth (rate-limited to prevent brute force) ─────────────────────────────
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 20 });
  app.post("/api/auth/signup", authLimiter, handleSignup);
  app.post("/api/auth/login", authLimiter, handleLogin);
  app.post("/api/auth/verify-email", handleVerifyEmail);
  app.get("/api/auth/me", handleGetMe);

  // ─── AI + Data (rate-limited) ────────────────────────────────────────────────
  const aiLimiter = rateLimit({ windowMs: 60 * 1000, maxRequests: 10 });
  app.post("/api/ai/itinerary", aiLimiter, generateItinerary);
  app.post("/api/ai/chat", aiLimiter, aiChat);
  app.get("/api/weather", getWeather);

  // Search
  app.get("/api/search/flights", searchFlights);
  app.get("/api/search/hotels", searchHotels);

  // Trips (protected routes)
  app.get("/api/trips", authMiddleware, handleGetUserTrips);
  app.post("/api/trips", authMiddleware, handleCreateTrip);
  app.get("/api/trips/:tripId", authMiddleware, handleGetTrip);
  app.put("/api/trips/:tripId", authMiddleware, handleUpdateTrip);
  app.patch(
    "/api/trips/:tripId/favorite",
    authMiddleware,
    handleToggleFavorite,
  );
  app.delete("/api/trips/:tripId", authMiddleware, handleDeleteTrip);

  // Currency
  app.get("/api/currency/convert", convertCurrency);

  // Geocode
  app.get("/api/geocode/reverse", reverseGeocode);
  app.get("/api/geocode/search", geocodeSearch);

  // Travel options
  app.get("/api/travel/options", travelOptions);

  // Places
  app.get("/api/places", getPlaces);

  // Visa & events
  app.get("/api/visa", visaCheck);
  app.get("/api/events", getEvents);

  // Collaboration (SSE)
  app.get("/api/collab/subscribe", collabSubscribe);
  app.post("/api/collab/publish", collabPublish);

  // ─── 404 handler ─────────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  // ─── Global error handler ───────────────────────────────────────────────────

  app.use((err: any, req: any, res: any, _next: any) => {
    const requestId = req.requestId || "unknown";
    logger.error("express", "Unhandled error", err, { requestId });

    const status = err.status || err.statusCode || 500;
    const message =
      config.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message || "Internal Server Error";

    res.status(status).json({ error: message, requestId });
  });

  return app;
}
