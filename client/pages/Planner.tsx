import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plane,
  CloudSun,
  Wallet,
  Users,
  Sparkles,
  Hotel,
  PlaneTakeoff,
  DollarSign,
  Map as MapIcon,
  FileDown,
  Calendar as CalIcon,
  ChevronDown,
} from "lucide-react";
import VisaChecker from "@/components/planner/VisaChecker";
import PassportTracker from "@/components/planner/PassportTracker";
import TripTimeline from "@/components/planner/TripTimeline";
import LocalGuides from "@/components/planner/LocalGuides";
import PackingList from "@/components/planner/PackingList";
import { PlannerLayout } from "@/components/planner/PlannerLayout";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
} from "recharts";
import type {
  ItineraryRequest,
  ItineraryResponse,
  WeatherResponse,
  CurrencyConvertResponse,
  TravelOptionsResponse,
  TravelOption,
  Place,
} from "@shared/api";
import { useEffect, useMemo, useRef, useState } from "react";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
function formatINR(n: number) {
  return inr.format(Math.round(n));
}

async function safeFetch(input: RequestInfo | URL, init?: RequestInit) {
  try {
    return await fetch(input, init);
  } catch {
    return new Response(null, { status: 0 });
  }
}

export default function Planner() {
  const [form, setForm] = useState<ItineraryRequest>({
    destination: "New Delhi, India",
    days: 5,
    budget: 100000,
    mood: "adventure",
  });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [origin, setOrigin] = useState<string>("New Delhi, India");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [flightQuery, setFlightQuery] = useState("");
  const [hotelQuery, setHotelQuery] = useState("");
  const [flights, setFlights] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [fx, setFx] = useState<{
    amount: number;
    from: string;
    to: string;
    result: number;
    rate: number;
  }>({ amount: 1000, from: "INR", to: "USD", result: 0, rate: 0 });
  const [travel, setTravel] = useState<TravelOptionsResponse | null>(null);
  const [mode, setMode] = useState<TravelOption["mode"] | null>(null);
  const [members, setMembers] = useState<number>(0);
  const [places, setPlaces] = useState<Place[]>([]);
  const [tripType, setTripType] = useState<
    "oneway" | "roundtrip" | "multicity"
  >("oneway");
  const [stops, setStops] = useState<string[]>([]);
  const [legsTravel, setLegsTravel] = useState<TravelOptionsResponse[]>([]);
  const [serverOk, setServerOk] = useState<boolean>(false);
  const [apiBase, setApiBase] = useState<string>("/api");

  const perDay = useMemo(
    () => (form.budget || 0) / (form.days || 1),
    [form.budget, form.days],
  );
  const [calendar, setCalendar] = useState<
    { day: number; activities: { text: string; time: string }[] }[]
  >([]);
  const [openNearby, setOpenNearby] = useState(true);
  const [openWeather, setOpenWeather] = useState(true);
  const [openRoute, setOpenRoute] = useState(true);
  const [openTransport, setOpenTransport] = useState(true);
  const [openCalendar, setOpenCalendar] = useState(true);
  const [openBudget, setOpenBudget] = useState(true);
  const [openGroup, setOpenGroup] = useState(true);
  const [openHotels, setOpenHotels] = useState(true);
  const [openCurrency, setOpenCurrency] = useState(true);
  const [showHourly, setShowHourly] = useState(false);
  const [transportFilter, setTransportFilter] = useState<
    "all" | "cheapest" | "fastest" | "eco"
  >("all");
  const [budgetCurrency, setBudgetCurrency] = useState<string>("INR");
  const [budgetRate, setBudgetRate] = useState<number>(1);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { id: string; text: string; at: number }[]
  >([]);
  const [nationality, setNationality] = useState<string>("India");
  const [passportExpiry, setPassportExpiry] = useState<string>("");

  const exportPdf = () => {
    if (!itinerary && !calendar.length) return;
    const days = calendar.length
      ? calendar
      : itinerary!.days.map((d) => ({
          day: d.day,
          activities: d.activities.map((text, i) => ({
            text,
            time: defaultSlot(i),
          })),
        }));
    const w = window.open("", "_blank");
    if (!w) return;
    const items = days
      .map(
        (d) =>
          `<div class='box'><h2>Day ${d.day}</h2><ul>${d.activities
            .map((a) => `<li>${a.time ? a.time + " • " : ""}${a.text}</li>`)
            .join("")}</ul></div>`,
      )
      .join("");
    const html = `<!doctype html><html><head><meta charset='utf-8'><title>TripGenius Itinerary</title>
      <style>body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial;padding:24px;color:#0f172a}
      h1{margin:0 0 8px} h2{margin:16px 0 8px} .box{border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin:10px 0}
      ul{margin:8px 0 0 18px}
      </style></head><body>
      <h1>TripGenius Itinerary — ${itinerary ? itinerary.destination : "Your Trip"}</h1>
      ${items}
      </body></html>`;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  const travelAbort = useRef<AbortController | null>(null);
  const placesAbort = useRef<AbortController | null>(null);
  const weatherAbort = useRef<AbortController | null>(null);

  const fetchPlaces = async (destination: string) => {
    try {
      if (!destination || destination.length < 3 || !(await ensureServer()))
        return;
      placesAbort.current?.abort();
      const ac = new AbortController();
      placesAbort.current = ac;
      const pr = await safeFetch(
        `${apiBase}/places?location=${encodeURIComponent(destination)}`,
        { signal: ac.signal },
      );
      if (placesAbort.current !== ac) return;
      if (!pr.ok) {
        setPlaces([]);
        return;
      }
      const pj = await pr.json();
      setPlaces(pj.places || []);
    } catch (e) {
      if ((e as any)?.name === "AbortError") return;
      setPlaces([]);
    }
  };

  const fetchWeather = async (destination: string) => {
    try {
      if (!destination || destination.length < 3 || !(await ensureServer()))
        return;
      weatherAbort.current?.abort();
      const ac = new AbortController();
      weatherAbort.current = ac;
      const wRes = await safeFetch(
        `${apiBase}/weather?location=${encodeURIComponent(destination)}`,
        { signal: ac.signal },
      );
      if (weatherAbort.current !== ac) return;
      if (!wRes.ok) {
        setWeather(null);
        return;
      }
      const w = (await wRes.json()) as WeatherResponse;
      setWeather(w);
    } catch (e) {
      if ((e as any)?.name === "AbortError") return;
      setWeather(null);
    }
  };

  const fetchTravel = async () => {
    try {
      const o = origin.trim();
      const d = form.destination.trim();
      if (!o || !d) return;
      if (o.length < 3 || d.length < 3) return;
      travelAbort.current?.abort();
      const ac = new AbortController();
      travelAbort.current = ac;
      const tRes = await safeFetch(
        `${apiBase}/travel/options?origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(d)}`,
        { signal: ac.signal },
      );
      if (travelAbort.current !== ac) return; // superseded
      if (!tRes.ok) {
        setTravel({
          km: 0,
          coords: {
            origin: { lat: 0, lon: 0 },
            destination: { lat: 0, lon: 0 },
          },
          options: [],
        });
        setMode(null);
        return;
      }
      const tr = (await tRes.json()) as TravelOptionsResponse;
      setTravel(tr);
      const firstAvailable =
        tr.options.find((o) => o.available) || tr.options[0];
      setMode((m) => m ?? firstAvailable?.mode ?? null);
    } catch (e) {
      if ((e as any)?.name === "AbortError") return;
      setTravel({
        km: 0,
        coords: { origin: { lat: 0, lon: 0 }, destination: { lat: 0, lon: 0 } },
        options: [],
      });
      setMode(null);
    }
  };

  const generate = async () => {
    if (!(await ensureServer())) return;
    if (!origin || !form.destination) return;
    if (dateRange.from && dateRange.to && dateRange.to < dateRange.from) return;
    setLoading(true);
    try {
      const newDays =
        dateRange.from && dateRange.to
          ? Math.max(
              1,
              Math.round(
                (+dateRange.to - +dateRange.from) / (1000 * 60 * 60 * 24),
              ) + 1,
            )
          : form.days;
      const req = { ...form, days: newDays };
      const [aiRes, wRes] = await Promise.all([
        safeFetch(`${apiBase}/ai/itinerary`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req),
        }),
        safeFetch(
          `${apiBase}/weather?location=${encodeURIComponent(form.destination)}`,
        ),
      ]);
      if (!aiRes.ok || !wRes.ok) throw new Error("network");
      const ai = (await aiRes.json()) as ItineraryResponse;
      const w = (await wRes.json()) as WeatherResponse;
      setItinerary(ai);
      setCalendar(
        ai.days.map((d) => ({
          day: d.day,
          activities: d.activities.map((text, idx) => ({
            text,
            time: defaultSlot(idx),
          })),
        })),
      );
      setWeather(w);
      // Places and weather are already fetched via auto-fetch effect
    } catch (e) {
      // swallow
    } finally {
      setLoading(false);
    }
  };

  const doFlightSearch = async () => {
    if (!(await ensureServer())) return;
    try {
      const res = await safeFetch(
        `${apiBase}/search/flights?q=${encodeURIComponent(flightQuery || form.destination)}`,
      );
      if (!res.ok) {
        setFlights([]);
        return;
      }
      const json = await res.json();
      setFlights(json.results || []);
    } catch {
      setFlights([]);
    }
  };

  const doHotelSearch = async () => {
    if (!(await ensureServer())) return;
    try {
      const res = await safeFetch(
        `${apiBase}/search/hotels?q=${encodeURIComponent(hotelQuery || form.destination)}`,
      );
      if (!res.ok) {
        setHotels([]);
        return;
      }
      const json = await res.json();
      const items = (json.results || []) as any[];
      items.sort(
        (a, b) => a.pricePerNight - b.pricePerNight || b.rating - a.rating,
      );
      setHotels(items);
    } catch {
      setHotels([]);
    }
  };

  const convert = async () => {
    if (!(await ensureServer())) return;
    try {
      const res = await safeFetch(
        `${apiBase}/currency/convert?amount=${fx.amount}&from=${fx.from}&to=${fx.to}`,
      );
      if (!res.ok) return;
      const data = (await res.json()) as CurrencyConvertResponse;
      setFx({ ...fx, rate: data.rate, result: data.result });
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!form.destination || !serverOk) return;
    const id = setInterval(async () => {
      try {
        const r = await safeFetch(
          `${apiBase}/weather?location=${encodeURIComponent(form.destination)}`,
        );
        const w = (await r.json()) as WeatherResponse;
        setWeather(w);
      } catch {}
    }, 600000);
    return () => clearInterval(id);
  }, [form.destination, serverOk]);

  // Auto-fetch nearby places and weather based on destination changes
  useEffect(() => {
    if (!form.destination) {
      setPlaces([]);
      return;
    }
    const timer = setTimeout(() => {
      fetchPlaces(form.destination);
      fetchWeather(form.destination);
    }, 500); // Debounce for 500ms to avoid excessive API calls while typing
    return () => clearTimeout(timer);
  }, [form.destination]);

  // Action-time server detection to avoid fetch errors on mount
  const ensureServer = async () => {
    if (serverOk) return true;
    const timeout = (ms: number) =>
      new Promise<never>((_, rej) =>
        setTimeout(() => rej(new Error("timeout")), ms),
      );
    const probe = async (base: string) => {
      try {
        const res = await Promise.race([
          safeFetch(`${base}/ping`),
          timeout(1500),
        ]);
        if (!res.ok) return false;
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) return false;
        const j = await res.json().catch(() => null as any);
        return !!j && typeof j === "object" && "message" in j;
      } catch {
        return false;
      }
    };
    if (await probe("/api")) {
      setApiBase("/api");
      setServerOk(true);
      return true;
    }
    if (await probe("/.netlify/functions/api")) {
      setApiBase("/.netlify/functions/api");
      setServerOk(true);
      return true;
    }
    setServerOk(false);
    return false;
  };

  // Removed auto-probe to prevent failing network calls on load

  // Load a saved plan selected from Dashboard
  useEffect(() => {
    try {
      const sel = localStorage.getItem("tg_open_trip");
      if (!sel) return;
      const raw = localStorage.getItem("tg_trip_" + sel);
      localStorage.removeItem("tg_open_trip");
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data?.itinerary) setItinerary(data.itinerary);
      if (Array.isArray(data?.calendar)) setCalendar(data.calendar);
      if (typeof data?.origin === "string") setOrigin(data.origin);
      if (typeof data?.destination === "string")
        setForm((f) => ({ ...f, destination: data.destination }));
      if (data?.dateRange) setDateRange(data.dateRange);
      if (typeof data?.members === "number") setMembers(data.members);
      if (typeof data?.budget === "number")
        setForm((f) => ({ ...f, budget: data.budget }));
      if (data?.mode) setMode(data.mode);
    } catch {}
  }, []);

  // Fetch main travel options for current origin/destination when plan exists
  useEffect(() => {
    if (!itinerary) return;
    (async () => {
      if (!(await ensureServer())) return;
      await fetchTravel();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin, form.destination, itinerary, serverOk]);

  // Fetch per-leg travel depending on trip type
  const legsRequestId = useRef(0);
  useEffect(() => {
    const id = ++legsRequestId.current;
    if (!itinerary) return; // avoid background calls until plan exists
    const run = async () => {
      if (!serverOk) return setLegsTravel([]);
      const o = origin.trim();
      const d = form.destination.trim();
      if (!o || !d) return setLegsTravel([]);
      const legs: Array<[string, string]> = [];
      if (tripType === "oneway") legs.push([o, d]);
      if (tripType === "roundtrip") legs.push([o, d], [d, o]);
      if (tripType === "multicity") {
        const pts = [o, ...stops.filter(Boolean), d];
        for (let i = 0; i < pts.length - 1; i++)
          legs.push([pts[i], pts[i + 1]]);
      }
      const results: TravelOptionsResponse[] = [];
      for (const [lo, ld] of legs) {
        try {
          const r = await safeFetch(
            `${apiBase}/travel/options?origin=${encodeURIComponent(lo)}&destination=${encodeURIComponent(ld)}`,
          );
          if (!r.ok) {
            results.push({
              km: 0,
              coords: {
                origin: { lat: 0, lon: 0 },
                destination: { lat: 0, lon: 0 },
              },
              options: [],
            });
            continue;
          }
          const j = await r.json();
          results.push(j);
        } catch {
          results.push({
            km: 0,
            coords: {
              origin: { lat: 0, lon: 0 },
              destination: { lat: 0, lon: 0 },
            },
            options: [],
          });
        }
      }
      if (id === legsRequestId.current) setLegsTravel(results);
    };
    const t = setTimeout(() => {
      run();
    }, 400);
    return () => clearTimeout(t);
  }, [origin, form.destination, tripType, JSON.stringify(stops), serverOk]);

  // Derived budget suggestions
  const daysCalc =
    dateRange.from && dateRange.to
      ? Math.max(
          1,
          Math.round(
            (+dateRange.to - +dateRange.from) / (1000 * 60 * 60 * 24),
          ) + 1,
        )
      : form.days;
  const rooms = members > 0 ? Math.ceil(members / 2) : 0;

  // chat storage by trip code
  useEffect(() => {
    try {
      const code = localStorage.getItem("tg_trip_code");
      const raw = code ? localStorage.getItem("tg_chat_" + code) : null;
      setChatMessages(raw ? JSON.parse(raw) : []);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      const code = localStorage.getItem("tg_trip_code");
      if (!code) return;
      localStorage.setItem("tg_chat_" + code, JSON.stringify(chatMessages));
    } catch {}
  }, [chatMessages]);
  const sendChat = () => {
    const t = chatInput.trim();
    if (!t) return;
    setChatMessages((m) => [
      ...m,
      { id: String(Date.now()), text: t, at: Date.now() },
    ]);
    setChatInput("");
  };

  // budget currency INR -> target
  useEffect(() => {
    (async () => {
      if (budgetCurrency === "INR") {
        setBudgetRate(1);
        return;
      }
      if (!(await ensureServer())) return;
      try {
        const r = await safeFetch(
          `${apiBase}/currency/convert?amount=1&from=INR&to=${budgetCurrency}`,
        );
        if (!r.ok) return;
        const j = await r.json();
        setBudgetRate(Number(j.result) || 1);
      } catch {}
    })();
  }, [budgetCurrency]);

  function formatMoney(n: number) {
    if (budgetCurrency === "INR") return formatINR(n);
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: budgetCurrency,
      }).format(n * budgetRate);
    } catch {
      return `${budgetCurrency} ${(n * budgetRate).toFixed(2)}`;
    }
  }

  function pickEco(options: TravelOptionsResponse["options"]) {
    const order: Record<string, number> = {
      train: 1,
      bus: 2,
      car: 3,
      waterway: 4,
      flight: 5,
    } as any;
    return [...options]
      .filter((o) => o.available)
      .sort((a, b) => order[a.mode] - order[b.mode])[0];
  }
  const stayPerNight = 3000;
  const foodPerDayPerPerson = 1000;
  const actPerDayPerPerson = 800;
  const travelPrice =
    mode && travel
      ? travel.options.find((o) => o.mode === mode)?.price || 0
      : 0;
  const transportPerPerson =
    mode === "car" ? (members > 0 ? travelPrice / members : 0) : travelPrice;
  const transportTotal = Math.round(transportPerPerson * Math.max(0, members));
  const stayTotal = rooms * stayPerNight * daysCalc;
  const foodTotal = members * foodPerDayPerPerson * daysCalc;
  const actTotal = members * actPerDayPerPerson * daysCalc;
  const suggestedTotal = transportTotal + stayTotal + foodTotal + actTotal;
  const perPersonPerDay =
    members > 0 ? Math.round(form.budget / members / Math.max(1, daysCalc)) : 0;

  const useCurrentOrigin = async () => {
    if (!(await ensureServer())) return;
    try {
      const coords = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          if (!navigator.geolocation)
            return reject(new Error("Geolocation not supported"));
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        },
      );
      const { latitude, longitude } = coords.coords;
      const resp = await safeFetch(
        `${apiBase}/geocode/reverse?lat=${latitude}&lon=${longitude}`,
      );
      const data = await resp.json();
      if (data?.label) setOrigin(data.label);
    } catch (e) {
      // swallow
    }
  };

  const useCurrentLocation = async () => {
    if (!(await ensureServer())) return;
    try {
      const coords = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          if (!navigator.geolocation)
            return reject(new Error("Geolocation not supported"));
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        },
      );
      const { latitude, longitude } = coords.coords;
      const resp = await safeFetch(
        `${apiBase}/geocode/reverse?lat=${latitude}&lon=${longitude}`,
      );
      const data = await resp.json();
      if (data?.label) setForm((f) => ({ ...f, destination: data.label }));
    } catch (e) {
      // swallow
    }
  };

  const saveTrip = async () => {
    if (!itinerary) return;
    const entry = {
      id: String(Date.now()),
      name: itinerary.destination,
      destination: itinerary.destination,
      days: itinerary.days.length,
      createdAt: Date.now(),
    };
    try {
      const raw = localStorage.getItem("tg_saved_trips");
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(entry);
      localStorage.setItem("tg_saved_trips", JSON.stringify(list));
      const payload = {
        itinerary,
        calendar,
        origin,
        destination: form.destination,
        dateRange,
        mode,
        members,
        budget: form.budget,
      };
      localStorage.setItem("tg_trip_" + entry.id, JSON.stringify(payload));
    } catch {}
    try {
      const token = localStorage.getItem("tg_token");
      if (token && (await ensureServer())) {
        await safeFetch(`${apiBase}/trips`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: entry.name, itinerary }),
        });
      }
    } catch {}
    try {
      const raw = localStorage.getItem("tg_activity");
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({
        id: String(Date.now()),
        at: Date.now(),
        message: `Saved trip: ${entry.name}`,
      });
      localStorage.setItem("tg_activity", JSON.stringify(list));
    } catch {}
  };

  const { isGuest } = useAuth();

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-4 md:px-6 lg:py-8">
      {isGuest && (
        <div className="mb-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
          <div className="flex items-start gap-2">
            <div className="text-xl">👤</div>
            <div className="flex-1">
              <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                Guest Mode
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                You're exploring as a guest. Your trips will be cleared when you
                logout.{" "}
                <a
                  href="/signup"
                  className="underline font-medium hover:text-amber-900 dark:hover:text-amber-100"
                >
                  Create an account
                </a>{" "}
                to save permanently.
              </p>
            </div>
          </div>
        </div>
      )}
      <div
        className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3"
        style={{ animation: "fadeIn 0.5s ease-out" }}
      >
        <Card
          className="lg:col-span-3 transition-all duration-500 ease-out"
          style={{ animation: "slideInUp 0.5s ease-out 0.1s backwards" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" /> AI Itinerary Planner
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Enter trip details, choose dates or trip length, and generate a
              day-by-day plan.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Destination</Label>
              <div className="flex flex-col xs:flex-row gap-2">
                <Input
                  value={form.destination}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, destination: e.target.value }))
                  }
                  placeholder="City, State"
                  className="h-8 text-sm"
                />
                <Button
                  variant="outline"
                  onClick={useCurrentLocation}
                  className="shrink-0 h-8 text-xs px-2"
                  size="sm"
                >
                  Use current
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Origin</Label>
              <div className="flex flex-col xs:flex-row gap-2">
                <Input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="City, State"
                  className="h-8 text-sm"
                />
                <Button
                  variant="outline"
                  onClick={useCurrentOrigin}
                  className="shrink-0 h-8 text-xs px-2"
                  size="sm"
                >
                  Use current
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-sm">Trip Type</Label>
                <Select
                  value={tripType}
                  onValueChange={(v) => setTripType(v as any)}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oneway">One Way</SelectItem>
                    <SelectItem value="roundtrip">Round Trip</SelectItem>
                    <SelectItem value="multicity">Multi-city</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Start Date</Label>
                <Input
                  type="date"
                  value={
                    dateRange.from
                      ? new Date(dateRange.from).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setDateRange((r) => ({
                      ...r,
                      from: e.target.value
                        ? new Date(e.target.value)
                        : undefined,
                    }))
                  }
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">End Date</Label>
                <Input
                  type="date"
                  value={
                    dateRange.to
                      ? new Date(dateRange.to).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setDateRange((r) => ({
                      ...r,
                      to: e.target.value ? new Date(e.target.value) : undefined,
                    }))
                  }
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Budget (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.budget}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, budget: Number(e.target.value) }))
                  }
                  className="h-8 text-sm"
                />
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span>Suggested: {formatINR(suggestedTotal)}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 px-1 text-xs"
                    onClick={() =>
                      setForm((f) => ({ ...f, budget: suggestedTotal }))
                    }
                  >
                    Set
                  </Button>
                </div>
                {tripType === "multicity" && (
                  <div className="pt-1 col-span-full space-y-1.5">
                    <Label className="text-sm">Stops (optional)</Label>
                    <div className="space-y-1">
                      {stops.map((s, i) => (
                        <div key={i} className="flex gap-1">
                          <Input
                            value={s}
                            onChange={(e) =>
                              setStops((prev) =>
                                prev.map((v, idx) =>
                                  idx === i ? e.target.value : v,
                                ),
                              )
                            }
                            placeholder="City, State"
                            className="h-7 text-xs"
                          />
                          <Button
                            variant="outline"
                            onClick={() =>
                              setStops((prev) =>
                                prev.filter((_, idx) => idx !== i),
                              )
                            }
                            size="sm"
                            className="h-7 text-xs px-2"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => setStops((prev) => [...prev, ""])}
                        size="sm"
                        className="h-7 text-xs w-full"
                      >
                        Add stop
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Members</Label>
                <Input
                  type="number"
                  min={0}
                  value={members}
                  onChange={(e) =>
                    setMembers(Math.max(0, Number(e.target.value)))
                  }
                  className="h-8 text-sm"
                />
                <div className="text-xs text-muted-foreground">
                  {members > 0 ? (
                    <>Per day: {formatINR(perPersonPerDay)} per person</>
                  ) : (
                    <>Set members for per-person estimates</>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Mood</Label>
              <Select
                value={form.mood}
                onValueChange={(m) =>
                  setForm((f) => ({
                    ...f,
                    mood: m as ItineraryRequest["mood"],
                  }))
                }
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Pick a vibe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foodie">Foodie</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="relax">Relax</SelectItem>
                  <SelectItem value="culture">Culture</SelectItem>
                  <SelectItem value="romantic">Romantic</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="nightlife">Nightlife</SelectItem>
                  <SelectItem value="spiritual">Spiritual</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={generate}
              disabled={loading}
              className="w-full h-8 text-xs"
            >
              {loading ? "Generating..." : "Generate Itinerary"}
            </Button>
            <div className="rounded-md bg-secondary p-2 text-xs text-muted-foreground">
              {members > 0 ? (
                <>
                  Daily:{" "}
                  <span className="font-semibold text-foreground">
                    {formatINR(perPersonPerDay)}
                  </span>{" "}
                  per person
                </>
              ) : (
                <>
                  Daily:{" "}
                  <span className="font-semibold text-foreground">
                    {formatINR(form.budget / Math.max(1, daysCalc))}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 flex flex-col">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapIcon className="h-5 w-5 text-primary" /> Nearby Places 🗺️
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Discover POI around your destination
                </p>
              </div>
              <button
                onClick={() => setOpenNearby((v) => !v)}
                aria-expanded={openNearby}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground shrink-0"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openNearby ? "rotate-180" : "rotate-0"}`}
                />
              </button>
            </CardHeader>
            <CardContent className={openNearby ? "" : "hidden"}>
              {places.length ? (
                <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 md:grid-cols-3 auto-rows-fr">
                  {places.slice(0, 9).map((p) => (
                    <a
                      key={p.id}
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded border p-2 hover:shadow-sm h-full flex flex-col text-xs hover:bg-accent/20 transition-colors"
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData(
                          "text/plain",
                          JSON.stringify({ place: p.title }),
                        )
                      }
                    >
                      <div className="font-medium text-sm">{p.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {p.summary}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  {form.destination
                    ? "Loading nearby places..."
                    : "Enter a destination to see nearby places."}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CloudSun className="h-5 w-5 text-primary" /> Weather Preview
                  ☀️
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  5-day outlook to plan activities
                </p>
              </div>
              <button
                onClick={() => setOpenWeather((v) => !v)}
                aria-expanded={openWeather}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground shrink-0"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openWeather ? "rotate-180" : "rotate-0"}`}
                />
              </button>
            </CardHeader>
            <CardContent className={openWeather ? "" : "hidden"}>
              {weather ? (
                <>
                  {weather.alerts?.length ? (
                    <div className="mb-3 rounded-md border bg-amber-50 p-3 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                      ⚠��� Alerts:{" "}
                      {weather.alerts.map((a) => a.description).join(", ")}
                    </div>
                  ) : null}
                  <div className="mb-2 flex items-center gap-1 text-xs">
                    <span className="text-muted-foreground">View:</span>
                    <button
                      className={`rounded border px-2 py-0.5 text-xs ${!showHourly ? "border-primary text-primary" : ""}`}
                      onClick={() => setShowHourly(false)}
                    >
                      Daily
                    </button>
                    <button
                      className={`rounded border px-2 py-0.5 text-xs ${showHourly ? "border-primary text-primary" : ""}`}
                      onClick={() => setShowHourly(true)}
                    >
                      Hourly
                    </button>
                  </div>
                  {!showHourly ? (
                    <div className="grid grid-cols-2 gap-2 text-sm xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 auto-rows-fr">
                      {weather.daily.map((d) => (
                        <div
                          key={d.date}
                          className="rounded border p-2 h-full flex flex-col"
                        >
                          <div className="font-medium text-sm">
                            {new Date(d.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground truncate">
                            {d.summary}
                          </div>
                          <div className="mt-1 text-sm">
                            {Math.round(d.tempMin)}° / {Math.round(d.tempMax)}°
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-sm xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6">
                      {(weather.hourly || []).map((h) => (
                        <div
                          key={h.timeISO}
                          className="rounded border p-2 text-xs"
                        >
                          <div className="font-medium">
                            {new Date(h.timeISO).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground truncate">
                            {h.desc}
                          </div>
                          <div className="mt-1 text-sm">
                            {Math.round(h.temp)}°C
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground text-sm">
                  {form.destination
                    ? "Loading weather..."
                    : "Enter a destination to see weather."}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-primary" /> Suggested Plan
                </CardTitle>
                <Button onClick={exportPdf} variant="outline" className="gap-2">
                  <FileDown className="h-4 w-4" /> Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {calendar?.length ? (
                <div className="space-y-5">
                  {calendar.map((day) => (
                    <div key={day.day} className="rounded-xl border p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">Day {day.day}</div>
                        <div className="text-sm text-muted-foreground">
                          Focus:{" "}
                          {
                            itinerary?.days.find((d) => d.day === day.day)
                              ?.theme
                          }
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <ul className="space-y-2 text-sm">
                        {day.activities.map((a, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <input
                              type="time"
                              value={a.time}
                              onChange={(e) => {
                                setCalendar((prev) =>
                                  prev.map((d2) =>
                                    d2.day === day.day
                                      ? {
                                          ...d2,
                                          activities: d2.activities.map(
                                            (x, j) =>
                                              j === idx
                                                ? { ...x, time: e.target.value }
                                                : x,
                                          ),
                                        }
                                      : d2,
                                  ),
                                );
                              }}
                              className="h-8 rounded border px-2 text-xs"
                            />
                            <span className="font-medium">
                              {a.time || "--:--"}
                            </span>
                            <span>• {a.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Your AI plan will appear here.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MapIcon className="h-5 w-5 text-primary" /> Route & Modes
                    🧭
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Preview route and choose travel mode
                  </p>
                </div>
                <button
                  onClick={() => setOpenRoute((v) => !v)}
                  aria-expanded={openRoute}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground shrink-0"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${openRoute ? "rotate-180" : "rotate-0"}`}
                  />
                </button>
              </div>
              {travel?.options?.length ? (
                <Select
                  value={mode ?? undefined}
                  onValueChange={(v) => setMode(v as any)}
                >
                  <SelectTrigger className="w-full sm:w-48 text-xs">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {travel.options
                      .filter((o) => o.available)
                      .map((o) => (
                        <SelectItem key={o.mode} value={o.mode}>
                          {o.mode} • {o.timeHours}h • {formatINR(o.price)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : null}
            </CardHeader>
            <CardContent className={openRoute ? "" : "hidden"}>
              <div className="aspect-video w-full overflow-hidden rounded border">
                <iframe
                  title="map"
                  className="h-full w-full"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(origin + " to " + form.destination)}&output=embed`}
                  loading="lazy"
                />
              </div>
              {travel ? (
                <div className="mt-3 text-sm text-muted-foreground">
                  Approx distance: {travel.km} km • Selected: {mode || "-"}
                </div>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  Generate to see route and modes.
                </p>
              )}

              {travel?.options?.length ? (
                <>
                  <div className="mt-2 rounded border p-2 text-xs">
                    {(() => {
                      const opts = travel.options.filter((o) => o.available);
                      const cheapest = opts.reduce(
                        (a, b) => (a && a.price <= b.price ? a : b),
                        opts[0],
                      );
                      const fastest = opts.reduce(
                        (a, b) => (a && a.timeHours <= b.timeHours ? a : b),
                        opts[0],
                      );
                      const eco = pickEco(travel.options);
                      return (
                        <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 text-xs">
                          <div>
                            <span className="text-muted-foreground">
                              Cheapest:
                            </span>{" "}
                            <span className="font-medium capitalize">
                              {cheapest?.mode}
                            </span>{" "}
                            • {formatINR(cheapest?.price || 0)}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Fastest:
                            </span>{" "}
                            <span className="font-medium capitalize">
                              {fastest?.mode}
                            </span>{" "}
                            • {fastest?.timeHours}h
                          </div>
                          <div>
                            <span className="text-muted-foreground">Eco:</span>{" "}
                            <span className="font-medium capitalize">
                              {eco?.mode || "-"}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </>
              ) : null}

              {travel?.options?.length ? (
                <div className="mt-2 grid grid-cols-1 gap-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                  {(function () {
                    const opts = travel.options.filter((o) => o.available);
                    if (transportFilter === "cheapest")
                      opts.sort((a, b) => a.price - b.price);
                    if (transportFilter === "fastest")
                      opts.sort((a, b) => a.timeHours - b.timeHours);
                    if (transportFilter === "eco") {
                      const rank: Record<string, number> = {
                        train: 1,
                        bus: 2,
                        car: 3,
                        waterway: 4,
                        flight: 5,
                      } as any;
                      opts.sort((a, b) => rank[a.mode] - rank[b.mode]);
                    }
                    return opts;
                  })().map((o) => (
                    <button
                      key={o.mode}
                      onClick={() => setMode(o.mode)}
                      className={`rounded border p-2 text-left text-xs transition hover:bg-accent/20 ${mode === o.mode ? "border-primary ring-1 ring-primary/50" : ""}`}
                    >
                      <div className="font-medium capitalize text-xs">
                        {o.mode}
                      </div>
                      <div className="text-muted-foreground text-xs mt-1">
                        {o.timeHours}h • {formatINR(o.price)}
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}

              {legsTravel?.length && mode ? (
                <div className="mt-2 rounded border p-2 text-xs">
                  {(() => {
                    const totalKm = legsTravel.reduce(
                      (s, l) => s + (l?.km || 0),
                      0,
                    );
                    const totals = legsTravel.reduce(
                      (acc, l) => {
                        const opt = l.options.find((o) => o.mode === mode);
                        return {
                          hours: acc.hours + (opt?.timeHours || 0),
                          price: acc.price + (opt?.price || 0),
                        };
                      },
                      { hours: 0, price: 0 },
                    );
                    return (
                      <div className="grid grid-cols-1 gap-1 md:grid-cols-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">
                            Distance:
                          </span>{" "}
                          <span className="font-medium">{totalKm} km</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>{" "}
                          <span className="font-medium">
                            {totals.hours.toFixed(1)} h
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cost:</span>{" "}
                          <span className="font-medium">
                            {formatINR(totals.price)}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <PlaneTakeoff className="h-5 w-5 text-primary" /> Transport
                  Options ✈️🚆🚌🚗⛴️
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Quick links for each leg of your journey
                </p>
              </div>
              <button
                onClick={() => setOpenTransport((v) => !v)}
                aria-expanded={openTransport}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground shrink-0"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openTransport ? "rotate-180" : "rotate-0"}`}
                />
              </button>
            </CardHeader>
            <CardContent className={openTransport ? "" : "hidden"}>
              {travel?.options?.length ? (
                <div className="mb-2 flex flex-wrap items-center gap-1 text-xs">
                  <span className="text-muted-foreground">Filter:</span>
                  {(["all", "cheapest", "fastest", "eco"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setTransportFilter(f)}
                      className={`rounded border px-2 py-0.5 text-xs capitalize ${transportFilter === f ? "border-primary text-primary" : ""}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              ) : null}
              <Tabs
                value={mode ?? undefined}
                onValueChange={(v) => setMode(v as any)}
              >
                <TabsList className="grid grid-cols-5 rounded-md bg-muted/20 p-0.5 overflow-x-auto h-8">
                  <TabsTrigger value="flight" className="text-sm">
                    Flight
                  </TabsTrigger>
                  <TabsTrigger value="train" className="text-sm">
                    Train
                  </TabsTrigger>
                  <TabsTrigger value="bus" className="text-sm">
                    Bus
                  </TabsTrigger>
                  <TabsTrigger value="car" className="text-sm">
                    Car
                  </TabsTrigger>
                  <TabsTrigger value="waterway" className="text-sm">
                    Waterway
                  </TabsTrigger>
                </TabsList>
                {(["flight", "train", "bus", "car", "waterway"] as const).map(
                  (t) => (
                    <TabsContent key={t} value={t} className="mt-2">
                      <div className="grid grid-cols-1 gap-2">
                        {getLegs(tripType, origin, form.destination, stops).map(
                          ([lo, ld], i) => (
                            <div
                              key={i}
                              className="space-y-1 rounded border p-2"
                            >
                              <div className="text-sm text-muted-foreground">
                                Leg {i + 1}: {lo} → {ld}
                              </div>
                              <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                                {buildTransportLinks(
                                  t,
                                  lo,
                                  ld,
                                  dateRange.from,
                                )?.map((l) => (
                                  <Button
                                    asChild
                                    key={l.href}
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs"
                                  >
                                    <a
                                      href={l.href}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {l.label}
                                    </a>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </TabsContent>
                  ),
                )}
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex-1 min-w-0">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CalIcon className="h-5 w-5 text-primary" /> Plan & Calendar
                    📅
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Drag items between days, export as PDF
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={saveTrip}
                    variant="default"
                    size="sm"
                    disabled={!itinerary}
                    className="text-xs"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={exportPdf}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    <FileDown className="h-3 w-3" />
                  </Button>
                  <button
                    onClick={() => setOpenCalendar((v) => !v)}
                    aria-expanded={openCalendar}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${openCalendar ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className={openCalendar ? "" : "hidden"}>
              {calendar?.length ? (
                <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {calendar.map((d, di) => (
                    <div
                      key={d.day}
                      className="rounded-lg border p-2 min-h-[160px] overflow-auto text-xs"
                    >
                      <div className="mb-1 flex items-center justify-between gap-1">
                        <div className="font-semibold text-xs">Day {d.day}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {itinerary?.days.find((x) => x.day === d.day)?.theme}
                        </div>
                      </div>
                      <ul className="space-y-1">
                        {d.activities.map((a, ai) => (
                          <li
                            key={ai}
                            className="cursor-move rounded border bg-card p-1 text-xs hover:bg-accent/20"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData(
                                "text/plain",
                                JSON.stringify({ di, ai }),
                              );
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <input
                                type="time"
                                value={a.time}
                                onChange={(e) => {
                                  setCalendar((prev) => {
                                    const next = prev.map((x) => ({
                                      day: x.day,
                                      activities: [...x.activities],
                                    }));
                                    next[di].activities[ai] = {
                                      ...next[di].activities[ai],
                                      time: e.target.value,
                                    };
                                    return next;
                                  });
                                }}
                                className="h-6 rounded border px-1 text-xs"
                              />
                              <span className="text-xs truncate">{a.text}</span>
                            </div>
                          </li>
                        ))}
                        <li
                          className="rounded border border-dashed p-1 text-center text-xs text-muted-foreground"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const raw = e.dataTransfer.getData("text/plain");
                            try {
                              const data = JSON.parse(raw);
                              if (
                                data &&
                                typeof data.di === "number" &&
                                typeof data.ai === "number"
                              ) {
                                setCalendar((prev) => {
                                  const next = prev.map((x) => ({
                                    day: x.day,
                                    activities: [...x.activities],
                                  }));
                                  const [moved] = next[
                                    data.di
                                  ].activities.splice(data.ai, 1);
                                  next[di].activities.push(moved);
                                  return next;
                                });
                                return;
                              }
                              if (data && data.place) {
                                setCalendar((prev) => {
                                  const next = prev.map((x) => ({
                                    day: x.day,
                                    activities: [...x.activities],
                                  }));
                                  const cnt = next[di].activities.length;
                                  next[di].activities.push({
                                    text: String(data.place),
                                    time: defaultSlot(cnt),
                                  });
                                  return next;
                                });
                                return;
                              }
                            } catch {}
                          }}
                        >
                          Drop here to add
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Generate an itinerary, then drag items between days.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Wallet className="h-5 w-5 text-primary" /> Budget Overview
                    💰
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Cost breakdowns by category
                  </p>
                </div>
                <button
                  onClick={() => setOpenBudget((v) => !v)}
                  aria-expanded={openBudget}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground shrink-0"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${openBudget ? "rotate-180" : "rotate-0"}`}
                  />
                </button>
              </CardHeader>
              <CardContent className={openBudget ? "" : "hidden"}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-secondary p-2">
                    <div className="text-muted-foreground">Total Budget</div>
                    <div className="text-lg font-bold mt-1">
                      {formatINR(form.budget)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary p-2">
                    <div className="text-muted-foreground">Per Day</div>
                    <div className="text-lg font-bold mt-1">
                      {formatINR(form.budget / Math.max(1, daysCalc))}
                    </div>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="rounded-md border p-2">
                    <div className="text-muted-foreground text-xs">
                      Transport
                    </div>
                    <div className="font-semibold text-sm mt-1">
                      {formatINR(transportTotal)}
                    </div>
                  </div>
                  <div className="rounded-md border p-2">
                    <div className="text-muted-foreground text-xs">Stay</div>
                    <div className="font-semibold text-sm mt-1">
                      {formatINR(stayTotal)}{" "}
                      <span className="text-xs text-muted-foreground">
                        ({rooms}rm)
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md border p-2">
                    <div className="text-muted-foreground text-xs">Food</div>
                    <div className="font-semibold text-sm mt-1">
                      {formatINR(foodTotal)}
                    </div>
                  </div>
                  <div className="rounded-md border p-2">
                    <div className="text-muted-foreground text-xs">
                      Activities
                    </div>
                    <div className="font-semibold text-sm mt-1">
                      {formatINR(actTotal)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">
                    Display currency:
                  </span>
                  <Input
                    value={budgetCurrency}
                    onChange={(e) =>
                      setBudgetCurrency(e.target.value.toUpperCase())
                    }
                    className="h-8 w-24"
                  />
                </div>
                {openBudget && (
                  <div
                    className="mt-2 h-40 w-full"
                    style={{ contain: "layout size" }}
                  >
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          dataKey="value"
                          data={[
                            { name: "Transport", value: transportTotal },
                            { name: "Stay", value: stayTotal },
                            { name: "Food", value: foodTotal },
                            { name: "Activities", value: actTotal },
                          ]}
                          innerRadius={25}
                          outerRadius={50}
                          paddingAngle={1}
                        >
                          {["#60a5fa", "#a78bfa", "#34d399", "#f59e0b"].map(
                            (c, i) => (
                              <Cell key={i} fill={c} />
                            ),
                          )}
                        </Pie>
                        <ReTooltip
                          formatter={(v: any, n: any) => [
                            formatMoney(Number(v)),
                            n,
                          ]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="mt-2 rounded-md border p-2 text-xs">
                  <div className="font-semibold text-foreground">
                    Suggested: {formatINR(suggestedTotal)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ({members > 0 ? `${members}×, ` : ""}
                    {daysCalc}d)
                  </div>
                  <div className="mt-1 text-xs">
                    {form.budget >= suggestedTotal ? (
                      <span className="text-green-600">
                        +{formatINR(form.budget - suggestedTotal)}
                      </span>
                    ) : (
                      <span className="text-red-600">
                        -{formatINR(suggestedTotal - form.budget)}
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-1 h-5 px-1 text-xs"
                      onClick={() =>
                        setForm((f) => ({ ...f, budget: suggestedTotal }))
                      }
                    >
                      Use
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-5 w-5 text-primary" /> Group Collab 👥
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Share plan with friends
                  </p>
                </div>
                <button
                  onClick={() => setOpenGroup((v) => !v)}
                  aria-expanded={openGroup}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground shrink-0"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${openGroup ? "rotate-180" : "rotate-0"}`}
                  />
                </button>
              </CardHeader>
              <CardContent className={openGroup ? "" : "hidden"}>
                <p className="text-sm text-muted-foreground">
                  Share trip code with friends to plan together
                </p>
                <ShareTrip />
                <div className="mt-2">
                  <div className="mb-1 text-xs text-muted-foreground">
                    Trip Comments
                  </div>
                  <div className="max-h-32 overflow-auto rounded border p-2 text-xs space-y-1">
                    {chatMessages.length ? (
                      chatMessages.map((m) => (
                        <div key={m.id} className="flex items-start gap-1">
                          <div className="mt-1 h-1 w-1 rounded-full bg-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm break-words">{m.text}</div>
                            <div className="text-[9px] text-muted-foreground">
                              {new Date(m.at).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-2">
                        No comments yet
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <Input
                      placeholder="Comment"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") sendChat();
                      }}
                      className="h-7 text-xs"
                    />
                    <Button
                      onClick={sendChat}
                      size="sm"
                      className="h-7 text-xs px-2"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="space-y-2 pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Hotel className="h-5 w-5 text-primary" /> Hotel Search 🏨
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Compare by rating and price
              </p>
              <div className="flex flex-col gap-1 xs:flex-row pt-1">
                <Input
                  placeholder="City or hotel name"
                  value={hotelQuery}
                  onChange={(e) => setHotelQuery(e.target.value)}
                  className="h-8 text-sm"
                />
                <Button
                  className="h-8 text-xs px-3 shrink-0"
                  onClick={doHotelSearch}
                >
                  Search
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-xs">
              <div className="space-y-1">
                {hotels.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-xs">{h.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground text-xs">
                          ⭐ {h.rating}
                        </span>
                        <Badge
                          variant={
                            h.rating >= 4.5
                              ? "default"
                              : h.rating >= 4.0
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs py-0"
                        >
                          {h.rating >= 4.5
                            ? "Excellent"
                            : h.rating >= 4.0
                              ? "Very good"
                              : "Good"}
                        </Badge>
                      </div>
                      {h.reviews?.length ? (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          “{h.reviews[0]}”
                        </div>
                      ) : null}
                    </div>
                    <div className="text-right pl-2 shrink-0">
                      <div className="text-sm font-bold">
                        ₹
                        {new Intl.NumberFormat("en-IN").format(h.pricePerNight)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        /night
                      </div>
                      <a
                        className="text-xs text-primary underline hover:no-underline"
                        href={h.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
                {hotels.length === 0 && (
                  <div className="text-muted-foreground text-xs text-center py-2">
                    Search to see hotel options.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-2 pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-5 w-5 text-primary" /> Currency
                Converter 💱
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Convert with live rates
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <Input
                    type="number"
                    value={fx.amount}
                    onChange={(e) =>
                      setFx({ ...fx, amount: Number(e.target.value) })
                    }
                    className="h-9 text-base mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">From (Currency)</Label>
                  <Input
                    value={fx.from}
                    onChange={(e) =>
                      setFx({ ...fx, from: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g., INR"
                    className="h-9 text-base mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">To (Currency)</Label>
                  <Input
                    value={fx.to}
                    onChange={(e) =>
                      setFx({ ...fx, to: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g., USD"
                    className="h-9 text-base mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={convert}
                    className="w-full h-9 text-sm font-medium"
                  >
                    Convert
                  </Button>
                </div>
              </div>
              {fx.result ? (
                <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 space-y-2 mt-2">
                  <div className="text-lg font-semibold text-foreground">
                    {fx.amount}{" "}
                    <span className="text-muted-foreground">{fx.from}</span> ={" "}
                    <span className="text-primary">{fx.result.toFixed(2)}</span>{" "}
                    <span className="text-muted-foreground">{fx.to}</span>
                  </div>
                  <div className="text-sm text-muted-foreground border-t pt-2">
                    <span className="font-medium">Exchange Rate:</span> 1{" "}
                    {fx.from} = {fx.rate.toFixed(4)} {fx.to}
                  </div>
                </div>
              ) : (
                <div className="text-base text-muted-foreground text-center py-4 rounded-lg bg-muted/30">
                  Enter values and click Convert
                </div>
              )}
            </CardContent>
          </Card>

          <VisaChecker
            destination={form.destination}
            nationality={nationality}
            onNationalityChange={setNationality}
          />

          <PassportTracker
            expiryDate={passportExpiry}
            onExpiryDateChange={setPassportExpiry}
          />

          <TripTimeline
            itinerary={itinerary}
            startDate={dateRange.from}
            days={form.days}
          />

          <LocalGuides destination={form.destination} />
        </div>
      </div>

      <PackingList
        weather={weather}
        destination={form.destination}
        days={form.days}
      />
    </div>
  );
}

function ShareTrip() {
  const [code, setCode] = useState<string>(() => {
    const existing = localStorage.getItem("tg_trip_code");
    if (existing) return existing;
    const c = cryptoRandom(8);
    localStorage.setItem("tg_trip_code", c);
    return c;
  });

  const copy = async () => {
    await navigator.clipboard.writeText(code);
  };

  return (
    <div className="mt-1 flex items-center gap-1">
      <Input readOnly value={code} className="font-mono h-7 text-xs" />
      <Button
        onClick={copy}
        variant="outline"
        size="sm"
        className="h-7 text-xs px-2"
      >
        Copy
      </Button>
    </div>
  );
}

function getLegs(
  tripType: "oneway" | "roundtrip" | "multicity",
  origin: string,
  destination: string,
  stops: string[],
) {
  const o = origin.trim();
  const d = destination.trim();
  const legs: Array<[string, string]> = [];
  if (!o || !d) return legs;
  if (tripType === "oneway") legs.push([o, d]);
  if (tripType === "roundtrip") legs.push([o, d], [d, o]);
  if (tripType === "multicity") {
    const pts = [o, ...stops.filter(Boolean), d];
    for (let i = 0; i < pts.length - 1; i++) legs.push([pts[i], pts[i + 1]]);
  }
  return legs;
}

function defaultSlot(index: number) {
  const slots = ["09:00", "13:00", "18:00", "20:00"];
  return slots[index % slots.length];
}

function buildTransportLinks(
  mode: string | null,
  origin: string,
  destination: string,
  from?: Date,
) {
  if (!mode) return [] as { label: string; href: string }[];
  const o = encodeURIComponent(origin.trim());
  const d = encodeURIComponent(destination.trim());
  const dateISO = from ? from.toISOString().slice(0, 10) : "";
  const dateCompact = from
    ? `${from.getFullYear()}${String(from.getMonth() + 1).padStart(2, "0")}${String(from.getDate()).padStart(2, "0")}`
    : "";
  switch (mode) {
    case "train":
      return [
        {
          label: "Google: Trains (live)",
          href: `https://www.google.com/search?q=trains+from+${o}+to+${d}+on+${dateISO}`,
        },
        { label: "IRCTC", href: `https://www.irctc.co.in/nget/train-search` },
      ];
    case "flight":
      return [
        {
          label: "Google Flights",
          href: `https://www.google.com/travel/flights?q=flights%20from%20${o}%20to%20${d}%20on%20${dateISO}`,
        },
        {
          label: "MakeMyTrip Flights",
          href: `https://www.makemytrip.com/flights/`,
        },
      ];
    case "bus":
      return [
        {
          label: "redBus",
          href: `https://www.redbus.in/search?fromCityName=${o}&toCityName=${d}&onward=${dateISO}`,
        },
        {
          label: "Google: Buses",
          href: `https://www.google.com/search?q=buses+from+${o}+to+${d}+on+${dateISO}`,
        },
      ];
    case "car":
      return [
        {
          label: "Google Maps Driving",
          href: `https://www.google.com/maps/dir/?api=1&origin=${o}&destination=${d}&travelmode=driving`,
        },
        {
          label: "Fuel/Costs Tips",
          href: `https://www.google.com/search?q=road+trip+${o}+to+${d}+costs`,
        },
      ];
    case "waterway":
      return [
        {
          label: "Google: Ferry/Boat",
          href: `https://www.google.com/search?q=ferry+boat+from+${o}+to+${d}+on+${dateISO}`,
        },
      ];
    default:
      return [];
  }
}

function cryptoRandom(length: number) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
