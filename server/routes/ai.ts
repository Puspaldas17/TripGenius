import { RequestHandler } from "express";
import type { ItineraryRequest, ItineraryResponse } from "@shared/api";

export const generateItinerary: RequestHandler = async (req, res) => {
  const body = req.body as ItineraryRequest;
  const days = Math.max(1, Math.min(14, Number(body.days || 3)));
  const mood = (body.mood || "adventure") as ItineraryRequest["mood"];
  const destination = body.destination || "Your Destination";

  const response: ItineraryResponse = {
    destination,
    days: Array.from({ length: days }, (_, i) => i + 1).map((d) => ({
      day: d,
      theme: mood,
      activities: suggestActivities(destination, mood, d),
    })),
  };

  res.json(response);
};

function suggestActivities(dest: string, mood: ItineraryRequest["mood"], day: number) {
  const base = {
    foodie: [
      `Breakfast at a local cafe in ${dest}`,
      `Visit a street food market`,
      `Take a cooking class featuring regional cuisine`,
      `Dinner at a top-rated restaurant`,
    ],
    adventure: [
      `Morning hike near ${dest}`,
      `Try an adrenaline activity (e.g., zipline, rafting)`,
      `Explore offbeat neighborhoods by bike`,
      `Sunset viewpoint and night market`,
    ],
    relax: [
      `Spa or hot spring session`,
      `Leisurely park walk and picnic`,
      `Scenic train or boat ride`,
      `Evening jazz bar or quiet dinner`,
    ],
    culture: [
      `Museum or heritage site tour in ${dest}`,
      `Historic neighborhood walking tour`,
      `Local craft workshop or tea ceremony`,
      `Theater, gallery, or live performance`,
    ],
  } as const;
  const plan = base[mood];
  return plan.map((p) => `${p}${day % 2 === 0 ? "" : ""}`);
}
