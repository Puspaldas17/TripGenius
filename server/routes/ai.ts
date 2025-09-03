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
    romantic: [
      `Sunrise/sunset viewpoint with photos in ${dest}`,
      `Couple spa and candlelight dinner`,
      `Boat cruise or lakeside walk`,
      `Night stroll through charming lanes`,
    ],
    family: [
      `Kid-friendly science museum or zoo in ${dest}`,
      `Picnic in a large park with playground`,
      `Interactive workshop (pottery/art)`,
      `Family movie or game night`,
    ],
    nightlife: [
      `Rooftop bar or live music in ${dest}`,
      `Popular club or pub crawl`,
      `Late-night street food tour`,
      `After-hours dessert spot`,
    ],
    spiritual: [
      `Visit a landmark temple/gurudwara/ashram in ${dest}`,
      `Attend morning aarti or meditation session`,
      `Walk around spiritual neighborhood bazaar`,
      `Evening satsang or cultural recital`,
    ],
    shopping: [
      `Explore traditional bazaar for handicrafts in ${dest}`,
      `Visit modern mall for brands and cinema`,
      `Antique market or flea market hunt`,
      `Local designer boutiques`,
    ],
    nature: [
      `Nature trail or botanical garden near ${dest}`,
      `Bird watching or lakeside picnic`,
      `Scenic drive to viewpoint`,
      `Stargazing in low-light area`,
    ],
    photography: [
      `Golden hour photo walk in ${dest}`,
      `Iconic landmark shots and street portraits`,
      `Rooftop skyline photography`,
      `Night long-exposure session`,
    ],
  } as const;
  const plan = base[mood];
  return plan.map((p) => `${p}${day % 2 === 0 ? "" : ""}`);
}
