import { useQuery, useMutation } from "@tanstack/react-query";
import { ensureServer, getApiBase, safeFetch } from "@/lib/api";
import type {
  WeatherResponse,
  Place,
  TravelOptionsResponse,
  ItineraryRequest,
  ItineraryResponse,
  CurrencyConvertResponse,
} from "@shared/api";

export function useWeatherQuery(destination: string | undefined) {
  return useQuery({
    queryKey: ["weather", destination],
    queryFn: async () => {
      if (!destination || destination.length < 3 || !(await ensureServer()))
        return null;
      const res = await safeFetch(
        `${getApiBase()}/weather?location=${encodeURIComponent(destination)}`,
      );
      if (!res.ok) throw new Error("Weather fetch failed");
      return (await res.json()) as WeatherResponse;
    },
    enabled: !!destination && destination.length >= 3,
    staleTime: 5 * 60 * 1000, // 5 min
    retry: 1,
  });
}

export function usePlacesQuery(destination: string | undefined) {
  return useQuery({
    queryKey: ["places", destination],
    queryFn: async () => {
      if (!destination || destination.length < 3 || !(await ensureServer()))
        return [];
      const res = await safeFetch(
        `${getApiBase()}/places?location=${encodeURIComponent(destination)}`,
      );
      if (!res.ok) return [];
      const data = await res.json();
      return (data.places || []) as Place[];
    },
    enabled: !!destination && destination.length >= 3,
    staleTime: 10 * 60 * 1000, // 10 min
  });
}

export function useTravelOptionsQuery(
  origin: string | undefined,
  destination: string | undefined,
) {
  return useQuery({
    queryKey: ["travel", origin, destination],
    queryFn: async () => {
      if (
        !origin ||
        !destination ||
        origin.length < 3 ||
        destination.length < 3
      )
        return null;
      if (!(await ensureServer())) return null;
      const res = await safeFetch(
        `${getApiBase()}/travel/options?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`,
      );
      if (!res.ok) throw new Error("Travel options fetch failed");
      return (await res.json()) as TravelOptionsResponse;
    },
    enabled:
      !!origin &&
      !!destination &&
      origin.length >= 3 &&
      destination.length >= 3,
    staleTime: 15 * 60 * 1000,
  });
}

export function useGenerateItineraryMutation() {
  return useMutation({
    mutationFn: async (req: ItineraryRequest) => {
      if (!(await ensureServer())) throw new Error("Server not available");
      const res = await safeFetch(`${getApiBase()}/ai/itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      if (!res.ok) throw new Error("Failed to generate itinerary");
      return (await res.json()) as ItineraryResponse;
    },
  });
}

export function useCurrencyConvertQuery(
  amount: number,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: ["currency", amount, from, to],
    queryFn: async () => {
      if (from === to)
        return { rate: 1, result: amount } as CurrencyConvertResponse;
      if (!(await ensureServer())) throw new Error("Server not available");
      const res = await safeFetch(
        `${getApiBase()}/currency/convert?amount=${amount}&from=${from}&to=${to}`,
      );
      if (!res.ok) throw new Error("Currency conversion failed");
      return (await res.json()) as CurrencyConvertResponse;
    },
    enabled: !!from && !!to && amount >= 0,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
