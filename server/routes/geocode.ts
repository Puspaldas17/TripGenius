import { RequestHandler } from "express";

export const reverseGeocode: RequestHandler = async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  if (!isFinite(lat) || !isFinite(lon)) return res.status(400).json({ error: "Invalid lat/lon" });
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const r = await fetch(url, { headers: { "User-Agent": "TripGenius/1.0 (builder.codes)" } });
    const j = await r.json();
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
