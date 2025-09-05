import { RequestHandler } from "express";

export const getEvents: RequestHandler = (req, res) => {
  const location = String(req.query.location || "").trim();
  if (!location) return res.status(400).json({ error: "Missing location" });
  const now = Date.now();
  const base = location.split(",")[0];
  const items = [
    {
      id: "e1",
      title: `${base} Street Food Crawl`,
      when: new Date(now + 86400000).toISOString(),
      kind: "food",
      where: base,
      url: `https://www.google.com/search?q=${encodeURIComponent(base + " food crawl")}`,
    },
    {
      id: "e2",
      title: `${base} Weekend Market`,
      when: new Date(now + 2 * 86400000).toISOString(),
      kind: "market",
      where: base,
      url: `https://www.google.com/search?q=${encodeURIComponent(base + " weekend market")}`,
    },
    {
      id: "e3",
      title: `${base} Live Music Night`,
      when: new Date(now + 3 * 86400000).toISOString(),
      kind: "music",
      where: base,
      url: `https://www.google.com/search?q=${encodeURIComponent(base + " live music")}`,
    },
  ];
  res.json({ location, results: items });
};
