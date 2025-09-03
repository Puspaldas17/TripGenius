/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/** Example response type for /api/demo */
export interface DemoResponse {
  message: string;
}

export type Mood = "foodie" | "adventure" | "relax" | "culture" | "romantic" | "family" | "nightlife" | "spiritual" | "shopping" | "nature" | "photography";

export interface ItineraryRequest {
  destination: string;
  days: number;
  budget: number;
  mood: Mood;
}

export interface ItineraryDay {
  day: number;
  theme: Mood;
  activities: string[];
}

export interface ItineraryResponse {
  destination: string;
  days: ItineraryDay[];
}

export interface WeatherDay {
  date: string; // ISO
  tempMin: number;
  tempMax: number;
  summary: string;
}

export interface WeatherResponse {
  location: string;
  daily: WeatherDay[];
}

export interface CurrencyConvertResponse {
  amount: number;
  from: string;
  to: string;
  rate: number;
  result: number;
}

export interface TravelOption {
  mode: "flight" | "train" | "car" | "bus" | "waterway";
  timeHours: number;
  price: number; // INR
  available: boolean;
}

export interface TravelOptionsResponse {
  km: number;
  coords: { origin: { lat: number; lon: number }; destination: { lat: number; lon: number } };
  options: TravelOption[];
}
