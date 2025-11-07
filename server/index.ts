import "dotenv/config";
import express from "express";
import cors from "cors";
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
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health
  app.get("/health", (_req, res) => res.json({ ok: true }));
  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth
  app.post("/api/auth/signup", handleSignup);
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/verify-email", handleVerifyEmail);
  app.get("/api/auth/me", handleGetMe);

  // AI + data
  app.post("/api/ai/itinerary", generateItinerary);
  app.post("/api/ai/chat", aiChat);
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

  // Global error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: any, res: any, _next: any) => {
    const ts = new Date().toISOString();
    console.error(
      `[${ts}] [express]`,
      err?.stack || err?.message || String(err),
    );
    res.status(500).json({ error: "Internal Server Error" });
  });

  return app;
}
