import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ItineraryRequest,
  ItineraryResponse,
  TravelOption,
} from "@shared/api";

type DateRange = { from?: string; to?: string }; // Serialized dates for persistence

export interface TripState {
  // Core Trip Form
  form: ItineraryRequest;
  setForm: (form: Partial<ItineraryRequest>) => void;

  origin: string;
  setOrigin: (origin: string) => void;

  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;

  members: number;
  setMembers: (members: number) => void;

  tripType: "oneway" | "roundtrip" | "multicity";
  setTripType: (type: "oneway" | "roundtrip" | "multicity") => void;

  stops: string[];
  setStops: (stops: string[]) => void;

  // Generated Content
  itinerary: ItineraryResponse | null;
  setItinerary: (itinerary: ItineraryResponse | null) => void;

  calendar: { day: number; activities: { text: string; time: string }[] }[];
  setCalendar: (
    calendar: { day: number; activities: { text: string; time: string }[] }[],
  ) => void;

  mode: TravelOption["mode"] | null;
  setMode: (mode: TravelOption["mode"] | null) => void;

  // Preferences & Options
  transportFilter: "all" | "cheapest" | "fastest" | "eco";
  setTransportFilter: (filter: "all" | "cheapest" | "fastest" | "eco") => void;

  budgetCurrency: string;
  setBudgetCurrency: (currency: string) => void;

  nationality: string;
  setNationality: (nationality: string) => void;

  passportExpiry: string;
  setPassportExpiry: (expiry: string) => void;

  // Actions
  resetPlan: () => void;
}

const initialFormState: ItineraryRequest = {
  destination: "New Delhi, India",
  days: 5,
  budget: 100000,
  mood: "adventure",
};

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      form: initialFormState,
      setForm: (newForm) =>
        set((state) => ({ form: { ...state.form, ...newForm } })),

      origin: "New Delhi, India",
      setOrigin: (origin) => set({ origin }),

      dateRange: {},
      setDateRange: (dateRange) => set({ dateRange }),

      members: 0,
      setMembers: (members) => set({ members }),

      tripType: "oneway",
      setTripType: (tripType) => set({ tripType }),

      stops: [],
      setStops: (stops) => set({ stops }),

      itinerary: null,
      setItinerary: (itinerary) => set({ itinerary }),

      calendar: [],
      setCalendar: (calendar) => set({ calendar }),

      mode: null,
      setMode: (mode) => set({ mode }),

      transportFilter: "all",
      setTransportFilter: (transportFilter) => set({ transportFilter }),

      budgetCurrency: "INR",
      setBudgetCurrency: (budgetCurrency) => set({ budgetCurrency }),

      nationality: "India",
      setNationality: (nationality) => set({ nationality }),

      passportExpiry: "",
      setPassportExpiry: (passportExpiry) => set({ passportExpiry }),

      resetPlan: () =>
        set({
          form: initialFormState,
          origin: "New Delhi, India",
          dateRange: {},
          members: 0,
          tripType: "oneway",
          stops: [],
          itinerary: null,
          calendar: [],
          mode: null,
        }),
    }),
    {
      name: "tg_active_trip_storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
