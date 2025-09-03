import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { signup, login } from "./routes/auth";
import { generateItinerary } from "./routes/ai";
import { getWeather } from "./routes/weather";
import { listTrips, saveTrip } from "./routes/trips";
import { searchFlights, searchHotels } from "./routes/search";
import { convertCurrency } from "./routes/currency";
import { reverseGeocode } from "./routes/geocode";
import { geocodeSearch, travelOptions } from "./routes/travel";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/login", login);

  // AI + data
  app.post("/api/ai/itinerary", generateItinerary);
  app.get("/api/weather", getWeather);

  // Search
  app.get("/api/search/flights", searchFlights);
  app.get("/api/search/hotels", searchHotels);

  // Trips
  app.get("/api/trips", listTrips);
  app.post("/api/trips", saveTrip);

  // Currency
  app.get("/api/currency/convert", convertCurrency);

  // Geocode
  app.get("/api/geocode/reverse", reverseGeocode);
  app.get("/api/geocode/search", geocodeSearch);

  // Travel options
  app.get("/api/travel/options", travelOptions);

  return app;
}
