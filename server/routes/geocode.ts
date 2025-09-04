import { RequestHandler } from "express";

export const reverseGeocode: RequestHandler = async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  if (!isFinite(lat) || !isFinite(lon))
    return res.status(400).json({ error: "Invalid lat/lon" });
  try {
    const http = await import("../utils/http");
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const j = await http.fetchJsonWithRetry<any>(
      url,
      {},
      { retries: 2, timeoutMs: 4000 },
    );
    const a = j.address || {};
    const city = a.city || a.town || a.village || a.hamlet || a.suburb || "";
    const state = a.state || "";
    const country = a.country || "";
    const label = [city, state, country].filter(Boolean).join(", ");
    res.json({ label, address: a });
  } catch (e) {
    res.status(500).json({ error: "Reverse geocoding failed" });
  }
};
