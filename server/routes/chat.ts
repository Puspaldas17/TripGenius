import { RequestHandler } from "express";

export const aiChat: RequestHandler = async (req, res) => {
  try {
    const { prompt, destination, context } = (req.body ?? {}) as {
      prompt?: string;
      destination?: string;
      context?: any;
    };
    const p = String(prompt || "").trim();
    if (!p) return res.status(400).json({ error: "Missing prompt" });
    const dest = String(destination || context?.destination || "your trip");
    const canned: Record<string, string> = {
      weather:
        `For ${dest}, check the Weather section. Plan outdoor activities on sunny days; keep indoor options for uncertain forecasts. Bring light rain gear if alerts mention rain/storms.`,
      budget:
        `Estimate costs by transport, stay, food, and activities. Use Budget Overview; set budget to suggested total if shortfalls show.`,
      transport:
        `Compare modes by price/time/eco. Trains and buses are eco‑friendlier; flights save time on long routes.`,
      food:
        `Try popular local spots near attractions to save time. For dietary needs, search ahead and mark options on the plan.`,
    };
    const key = Object.keys(canned).find((k) => p.toLowerCase().includes(k));
    const answer = key
      ? canned[key]
      : `Here are tips for ${dest}: plan a balanced day (morning landmark, afternoon local area, evening food/market). Keep travel buffers (30–45m) and hydrate. Use the Calendar to slot times and keep nearby places handy.`;
    res.json({ reply: answer });
  } catch (e) {
    res.status(500).json({ error: "Chat failed" });
  }
};
