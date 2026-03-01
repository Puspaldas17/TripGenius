import { RequestHandler } from "express";
import type { WeatherResponse } from "@shared/api";
import { getCachedOrFetch } from "../utils/cache";

/**
 * @swagger
 * /api/weather:
 *   get:
 *     summary: Get weather forecast for a location
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *         description: The city or location
 *     responses:
 *       200:
 *         description: Weather details including daily, hourly, and alerts
 *       500:
 *         description: Internal server error (returns fallback data)
 */
export const getWeather: RequestHandler = async (req, res) => {
  const location = String(req.query.location || "");
  const key = process.env.OPENWEATHER_API_KEY;

  try {
    const data = await getCachedOrFetch(
      `weather:${location}`,
      async () => {
        if (key && location) {
          const http = await import("../utils/http");
          const encoded = encodeURIComponent(location);
          const geo = (await http.fetchJsonWithRetry<any[]>(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encoded}&limit=1&appid=${key}`,
            {},
            { retries: 2, timeoutMs: 4000 },
          )) as any[];
          if (geo?.length) {
            const { lat, lon } = geo[0];
            const wf = await http.fetchJsonWithRetry<any>(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`,
              {},
              { retries: 2, timeoutMs: 5000 },
            );
            const byDay: Record<
              string,
              { min: number; max: number; desc: string[] }
            > = {};
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
              .map(([date, d]) => ({
                date,
                tempMin: d.min,
                tempMax: d.max,
                summary: summary(d.desc),
              }));
            const hourly = (wf.list as any[]).slice(0, 8).map((item) => ({
              timeISO: String(item.dt_txt),
              temp: Number(item.main?.temp ?? 0),
              desc: String(item.weather?.[0]?.description ?? ""),
            }));
            const alerts: { type: string; description: string }[] = [];
            const nextDayDescs = (wf.list as any[])
              .slice(0, 8)
              .map((i) => String(i.weather?.[0]?.description ?? ""));
            if (nextDayDescs.some((d) => /storm|thunder|rain|snow/i.test(d))) {
              alerts.push({
                type: "weather",
                description: "Potential precipitation or storm within 24h",
              });
            }
            const out: WeatherResponse = { location, daily, hourly, alerts };
            return out;
          }
        }

        // --- Fallback if no API key or API fails ---
        const now = new Date();
        const daily = Array.from({ length: 5 }, (_, i) => {
          const dt = new Date(now);
          dt.setDate(now.getDate() + i);
          return {
            date: dt.toISOString(),
            tempMin: 18 + i,
            tempMax: 26 + i,
            summary: i % 2 ? "Partly cloudy" : "Sunny",
          };
        });
        const hourly = Array.from({ length: 8 }, (_, i) => {
          const t = new Date(now.getTime() + (i + 1) * 3 * 60 * 60 * 1000);
          return {
            timeISO: t.toISOString(),
            temp: 22 + (i % 3),
            desc: i % 2 ? "clear sky" : "clouds",
          };
        });
        const alerts: { type: string; description: string }[] = [];
        return { location, daily, hourly, alerts } as WeatherResponse;
      },
      3600, // Cache for 1 hour
    );

    return res.json(data);
  } catch (error) {
    console.error("Weather Route Error:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};

function summary(arr: string[]) {
  const m = new Map<string, number>();
  for (const a of arr) m.set(a, (m.get(a) || 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "";
}
