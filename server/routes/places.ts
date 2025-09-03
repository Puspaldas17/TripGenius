import { RequestHandler } from "express";

async function geocode(q: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}`;
  const r = await fetch(url, { headers: { "User-Agent": "TripGenius/1.0 (builder.codes)" } });
  const j = (await r.json()) as any[];
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
    const gs = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=geosearch&gscoord=${geo.lat}%7C${geo.lon}&gsradius=10000&gslimit=30`);
    const gj = (await gs.json()) as any;
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
    res.status(500).json({ error: "Failed to fetch places" });
  }
};
