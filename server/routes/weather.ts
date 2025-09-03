import { RequestHandler } from "express";
import type { WeatherResponse } from "@shared/api";

export const getWeather: RequestHandler = async (req, res) => {
  const location = String(req.query.location || "");
  const key = process.env.OPENWEATHER_API_KEY;
  if (key && location) {
    try {
      const encoded = encodeURIComponent(location);
      const geores = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encoded}&limit=1&appid=${key}`);
      const geo = (await geores.json()) as any[];
      if (geo?.length) {
        const { lat, lon } = geo[0];
        const wres = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`);
        const wf = await wres.json();
        const byDay: Record<string, { min: number; max: number; desc: string[] }> = {};
        for (const item of wf.list as any[]) {
          const date = (item.dt_txt as string).split(" ")[0];
          const min = item.main.temp_min as number;
          const max = item.main.temp_max as number;
          const desc = item.weather?.[0]?.description as string;
          const day = (byDay[date] ||= { min: min, max: max, desc: [] });
          day.min = Math.min(day.min, min);
          day.max = Math.max(day.max, max);
          if (desc) day.desc.push(desc);
        }
        const daily = Object.entries(byDay)
          .slice(0, 5)
          .map(([date, d]) => ({ date, tempMin: d.min, tempMax: d.max, summary: summary(d.desc) }));
        const out: WeatherResponse = { location, daily };
        return res.json(out);
      }
    } catch {}
  }
  const now = new Date();
  const daily = Array.from({ length: 5 }, (_, i) => {
    const dt = new Date(now);
    dt.setDate(now.getDate() + i);
    return { date: dt.toISOString(), tempMin: 18 + i, tempMax: 26 + i, summary: i % 2 ? "Partly cloudy" : "Sunny" };
  });
  res.json({ location, daily } satisfies WeatherResponse);
};

function summary(arr: string[]) {
  const m = new Map<string, number>();
  for (const a of arr) m.set(a, (m.get(a) || 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "";
}
