import { RequestHandler } from "express";
import { getCachedOrFetch } from "../utils/cache";

/**
 * @swagger
 * /api/geocode/search:
 *   get:
 *     summary: Search for a location using geolocation
 *     tags: [Travel & Maps]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Query string (e.g., 'Paris')
 *     responses:
 *       200:
 *         description: List of matched geographic locations
 *       400:
 *         description: Missing query parameter
 *       500:
 *         description: Geocoding failed
 */
export const geocodeSearch: RequestHandler = async (req, res) => {
  const q = String(req.query.q || "");
  if (!q) return res.status(400).json({ error: "Missing q" });

  try {
    const results = await getCachedOrFetch(
      `geocode:${q}`,
      async () => {
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}`;
        const r = await fetch(url, {
          headers: { "User-Agent": "TripGenius/1.0 (builder.codes)" },
        });
        const j = (await r.json()) as any[];
        return j.slice(0, 5).map((i) => ({
          label: i.display_name,
          lat: Number(i.lat),
          lon: Number(i.lon),
        }));
      },
      86400, // Cache geocoding for 24 hours
    );

    res.json({ results });
  } catch (_e) {
    res.status(500).json({ error: "Geocoding failed" });
  }
};

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * @swagger
 * /api/travel/options:
 *   get:
 *     summary: Calculate travel options between an origin and destination
 *     tags: [Travel & Maps]
 *     parameters:
 *       - in: query
 *         name: origin
 *         required: true
 *         schema:
 *           type: string
 *         description: Origin location
 *       - in: query
 *         name: destination
 *         required: true
 *         schema:
 *           type: string
 *         description: Destination location
 *     responses:
 *       200:
 *         description: Estimated distance, geocoordinates, and multiple mode options
 *       400:
 *         description: Missing origin or destination
 *       404:
 *         description: Could not geocode one of the points
 *       500:
 *         description: Failed to compute options
 */
export const travelOptions: RequestHandler = async (req, res) => {
  const origin = String(req.query.origin || "");
  const destination = String(req.query.destination || "");
  if (!origin || !destination)
    return res.status(400).json({ error: "Missing origin/destination" });

  try {
    const data = await getCachedOrFetch(
      `travel:${origin}->${destination}`,
      async () => {
        const http = await import("../utils/http");
        const [oJson, dJson] = await Promise.all([
          http.fetchJsonWithRetry<any[]>(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(origin)}`,
            {},
            { retries: 2, timeoutMs: 4000 },
          ),
          http.fetchJsonWithRetry<any[]>(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(destination)}`,
            {},
            { retries: 2, timeoutMs: 4000 },
          ),
        ]);
        const o = oJson[0];
        const d = dJson[0];
        if (!o || !d) throw new Error("Could not geocode");

        const lat1 = Number(o.lat),
          lon1 = Number(o.lon),
          lat2 = Number(d.lat),
          lon2 = Number(d.lon);
        const km = haversine(lat1, lon1, lat2, lon2);
        const options = [
          // rough estimates; prices in INR
          {
            mode: "flight",
            timeHours: +(km / 700).toFixed(1),
            price: Math.round(3.5 * km + 1500),
            available: km > 300,
          },
          {
            mode: "train",
            timeHours: +(km / 80).toFixed(1),
            price: Math.round(0.9 * km + 200),
            available: km > 50,
          },
          {
            mode: "car",
            timeHours: +(km / 60).toFixed(1),
            price: Math.round(12 * km),
            available: true,
          },
          {
            mode: "bus",
            timeHours: +(km / 50).toFixed(1),
            price: Math.round(1.2 * km + 150),
            available: true,
          },
          {
            mode: "waterway",
            timeHours: +(km / 30).toFixed(1),
            price: Math.round(0.8 * km + 300),
            available: km > 200 && (o.class === "place" || d.class === "place"),
          },
        ];

        return {
          km: Math.round(km),
          coords: {
            origin: { lat: lat1, lon: lon1 },
            destination: { lat: lat2, lon: lon2 },
          },
          options,
        };
      },
      86400, // Cache for 24 hours
    );

    res.json(data);
  } catch (error: any) {
    if (error.message === "Could not geocode") {
      return res.status(404).json({ error: "Could not geocode" });
    }
    res.status(500).json({ error: "Failed to compute travel options" });
  }
};
