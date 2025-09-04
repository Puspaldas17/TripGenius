import { RequestHandler } from "express";

async function geocode(q: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}`;
  const http = await import("../utils/http");
  const j = (await http.fetchJsonWithRetry<any[]>(
    url,
    {},
    { retries: 2, timeoutMs: 4000 },
  )) as any[];
  const top = j[0];
  if (!top) return null;
  return { lat: Number(top.lat), lon: Number(top.lon) };
}

export const getPlaces: RequestHandler = async (req, res) => {
  const location = String(req.query.location || "");
  if (!location) return res.status(400).json({ error: "Missing location" });
  try {
    const geo = await geocode(location);
    if (!geo) return res.json({ places: [] });
    const http = await import("../utils/http");
    const gj = await http.fetchJsonWithRetry<any>(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&list=geosearch&gscoord=${geo.lat}%7C${geo.lon}&gsradius=10000&gslimit=30`,
      {},
      { retries: 2, timeoutMs: 5000 },
    );
    const list = (gj?.query?.geosearch || []) as any[];
    const places = list.map((p) => ({
      id: String(p.pageid),
      title: p.title as string,
      lat: Number(p.lat),
      lon: Number(p.lon),
      url: `https://en.wikipedia.org/?curid=${p.pageid}`,
      summary: `${p.title} near ${location}`,
    }));
    res.json({ places });
  } catch (e) {
    res.json({ places: [] });
  }
};
