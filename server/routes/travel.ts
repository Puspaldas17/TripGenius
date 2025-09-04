import { RequestHandler } from "express";

export const geocodeSearch: RequestHandler = async (req, res) => {
  const q = String(req.query.q || "");
  if (!q) return res.status(400).json({ error: "Missing q" });
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}`;
    const r = await fetch(url, {
      headers: { "User-Agent": "TripGenius/1.0 (builder.codes)" },
    });
    const j = (await r.json()) as any[];
    const results = j.slice(0, 5).map((i) => ({
      label: i.display_name,
      lat: Number(i.lat),
      lon: Number(i.lon),
    }));
    res.json({ results });
  } catch (e) {
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

export const travelOptions: RequestHandler = async (req, res) => {
  const origin = String(req.query.origin || "");
  const destination = String(req.query.destination || "");
  if (!origin || !destination)
    return res.status(400).json({ error: "Missing origin/destination" });
  try {
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
    if (!o || !d) return res.status(404).json({ error: "Could not geocode" });
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
    res.json({
      km: Math.round(km),
      coords: {
        origin: { lat: lat1, lon: lon1 },
        destination: { lat: lat2, lon: lon2 },
      },
      options,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to compute travel options" });
  }
};
