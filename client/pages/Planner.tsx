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
      // travel options will refresh via effect
      try {
        const pr = await safeFetch(
          `${apiBase}/places?location=${encodeURIComponent(form.destination)}`,
        );
        const pj = await pr.json();
        setPlaces(pj.places || []);
      } catch {}
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

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-8 sm:px-4 md:px-6 md:py-10">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" /> AI Itinerary Planner
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Enter trip details, choose dates or trip length, and generate a
              day-by-day plan.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Destination</Label>
              <div className="flex gap-2">
                <Input
                  value={form.destination}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, destination: e.target.value }))
                  }
                  placeholder="City, State (e.g., Mumbai, Maharashtra)"
                />
                <Button
                  variant="outline"
                  onClick={useCurrentLocation}
                  className="shrink-0"
                >
                  Use current
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Origin</Label>
              <div className="flex gap-2">
                <Input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="City, State (e.g., Kolkata, West Bengal)"
                />
                <Button
                  variant="outline"
                  onClick={useCurrentOrigin}
                  className="shrink-0"
                >
                  Use current
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Trip Type</Label>
                <Select
                  value={tripType}
                  onValueChange={(v) => setTripType(v as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oneway">One Way</SelectItem>
                    <SelectItem value="roundtrip">Round Trip</SelectItem>
                    <SelectItem value="multicity">Multi-city</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
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
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
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
                />
              </div>
              <div className="space-y-2">
                <Label>Budget (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.budget}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, budget: Number(e.target.value) }))
                  }
                />
                <div className="text-xs text-muted-foreground">
                  Suggested for your trip:{" "}
                  <span className="font-medium">
                    {formatINR(suggestedTotal)}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-2 h-7 px-2"
                    onClick={() =>
                      setForm((f) => ({ ...f, budget: suggestedTotal }))
                    }
                  >
                    Set budget
                  </Button>
                </div>
                {tripType === "multicity" && (
                  <div className="pt-2">
                    <Label>Stops (optional)</Label>
                    <div className="mt-1 space-y-2">
                      {stops.map((s, i) => (
                        <div key={i} className="flex gap-2">
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
                          />
                          <Button
                            variant="outline"
                            onClick={() =>
                              setStops((prev) =>
                                prev.filter((_, idx) => idx !== i),
                              )
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => setStops((prev) => [...prev, ""])}
                      >
                        Add stop
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Members</Label>
                <Input
                  type="number"
                  min={0}
                  value={members}
                  onChange={(e) =>
                    setMembers(Math.max(0, Number(e.target.value)))
                  }
                />
                <div className="text-xs text-muted-foreground">
                  {members > 0 ? (
                    <>
                      Per person per day at current budget:{" "}
                      <span className="font-medium">
                        {formatINR(perPersonPerDay)}
                      </span>
                    </>
                  ) : (
                    <>Set Members to see per-person estimates</>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mood</Label>
              <Select
                value={form.mood}
                onValueChange={(m) =>
                  setForm((f) => ({
                    ...f,
                    mood: m as ItineraryRequest["mood"],
                  }))
                }
              >
                <SelectTrigger>
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
            <Button onClick={generate} disabled={loading} className="w-full">
              {loading ? "Generating..." : "Generate Itinerary"}
            </Button>
            <div className="rounded-md bg-secondary p-3 text-sm text-muted-foreground">
              {members > 0 ? (
                <>
                  Daily budget per person:{" "}
                  <span className="font-semibold text-foreground">
                    {formatINR(perPersonPerDay)}
                  </span>
                </>
              ) : (
                <>
                  Daily budget:{" "}
                  <span className="font-semibold text-foreground">
                    {formatINR(form.budget / Math.max(1, daysCalc))}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6 flex flex-col">
          <Card className="order-10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="h-5 w-5 text-primary" /> Nearby Places 🗺️
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Discover points of interest around your destination. Drag any
                place into your plan.
              </p>
            </CardHeader>
            <div className="flex items-center justify-end px-6 -mt-2">
              <button
                onClick={() => setOpenNearby((v) => !v)}
                aria-expanded={openNearby}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {openNearby ? "Collapse" : "Expand"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openNearby ? "rotate-180" : "rotate-0"}`}
                />
              </button>
            </div>
            <CardContent className={openNearby ? "" : "hidden"}>
              {places.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                  {places.slice(0, 12).map((p) => (
                    <a
                      key={p.id}
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border p-3 hover:shadow-sm h-full flex flex-col"
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData(
                          "text/plain",
                          JSON.stringify({ place: p.title }),
                        )
                      }
                    >
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.summary}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Generate to load nearby places for your destination.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudSun className="h-5 w-5 text-primary" /> Weather Preview ☀️
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                5-day daily outlook so you can plan activities with confidence.
              </p>
            </CardHeader>
            <div className="flex items-center justify-end px-6 -mt-2">
              <button
                onClick={() => setOpenWeather((v) => !v)}
                aria-expanded={openWeather}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {openWeather ? "Collapse" : "Expand"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openWeather ? "rotate-180" : "rotate-0"}`}
                />
              </button>
            </div>
            <CardContent className={openWeather ? "" : "hidden"}>
              {weather ? (
                <>
                  {weather.alerts?.length ? (
                    <div className="mb-3 rounded-md border bg-amber-50 p-3 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                      ⚠️ Alerts:{" "}
                      {weather.alerts.map((a) => a.description).join(", ")}
                    </div>
                  ) : null}
                  <div className="mb-3 flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">View:</span>
                    <button
                      className={`rounded border px-2 py-1 ${!showHourly ? "border-primary text-primary" : ""}`}
                      onClick={() => setShowHourly(false)}
                    >
                      Daily
                    </button>
                    <button
                      className={`rounded border px-2 py-1 ${showHourly ? "border-primary text-primary" : ""}`}
                      onClick={() => setShowHourly(true)}
                    >
                      Hourly
                    </button>
                  </div>
                  {!showHourly ? (
                    <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-fr">
                      {weather.daily.map((d) => (
                        <div
                          key={d.date}
                          className="rounded-lg border p-3 h-full"
                        >
                          <div className="font-medium">
                            {new Date(d.date).toLocaleDateString()}
                          </div>
                          <div className="mt-1 text-muted-foreground">
                            {d.summary}
                          </div>
                          <div className="mt-1">
                            {Math.round(d.tempMin)}° / {Math.round(d.tempMax)}°C
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                      {(weather.hourly || []).map((h) => (
                        <div key={h.timeISO} className="rounded-lg border p-3">
                          <div className="font-medium">
                            {new Date(h.timeISO).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="mt-1 text-muted-foreground">
                            {h.desc}
                          </div>
                          <div className="mt-1">{Math.round(h.temp)}°C</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground">
                  Generate an itinerary to see upcoming weather.
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
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapIcon className="h-5 w-5 text-primary" /> Route & Modes 🧭
                </CardTitle>
                {travel?.options?.length ? (
                  <Select
                    value={mode ?? undefined}
                    onValueChange={(v) => setMode(v as any)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Mode" />
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
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Preview your route and choose a travel mode.
              </p>
            </CardHeader>
            <div className="flex items-center justify-end px-6 -mt-2">
              <button
                onClick={() => setOpenRoute((v) => !v)}
                aria-expanded={openRoute}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {openRoute ? "Collapse" : "Expand"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openRoute ? "rotate-180" : "rotate-0"}`}
                />
              </button>
            </div>
            <CardContent className={openRoute ? "" : "hidden"}>
              <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border">
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
                  <div className="mt-3 rounded-md border p-3 text-xs">
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
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          <div>
                            Cheapest:{" "}
                            <span className="font-medium capitalize">
                              {cheapest?.mode}
                            </span>{" "}
                            • {formatINR(cheapest?.price || 0)}
                          </div>
                          <div>
                            Fastest:{" "}
                            <span className="font-medium capitalize">
                              {fastest?.mode}
                            </span>{" "}
                            • {fastest?.timeHours}h
                          </div>
                          <div>
                            Eco‑friendly:{" "}
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
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
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
                      className={`rounded-lg border p-3 text-left text-sm transition ${mode === o.mode ? "border-primary ring-2 ring-primary/30" : ""}`}
                    >
                      <div className="font-medium capitalize">{o.mode}</div>
                      <div className="text-muted-foreground">
                        {o.timeHours}h • {formatINR(o.price)}
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}

              {legsTravel?.length && mode ? (
                <div className="mt-4 rounded-md border p-3 text-sm">
                  {(() => {
                    const totalKm = legsTravel.reduce((s, l) => s + (l?.km || 0), 0);
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
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                        <div>Total distance: <span className="font-medium">{totalKm} km</span></div>
                        <div>Estimated travel time: <span className="font-medium">{totals.hours.toFixed(1)} h</span></div>
                        <div>Total transport cost: <span className="font-medium">{formatINR(totals.price)}</span></div>
                      </div>
                    );
                  })()}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlaneTakeoff className="h-5 w-5 text-primary" /> Transport
                Options ✈️🚆🚌🚗⛴️
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Quick links and tools for each leg of your journey.
              </p>
            </CardHeader>
            <div className="flex items-center justify-end px-6 -mt-2">
              <button
                onClick={() => setOpenTransport((v) => !v)}
                aria-expanded={openTransport}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {openTransport ? "Collapse" : "Expand"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openTransport ? "rotate-180" : "rotate-0"}`}
                />
              </button>
            </div>
            <CardContent className={openTransport ? "" : "hidden"}>
              {travel?.options?.length ? (
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Filter:</span>
                  {(["all", "cheapest", "fastest", "eco"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setTransportFilter(f)}
                      className={`rounded border px-2 py-1 capitalize ${transportFilter === f ? "border-primary text-primary" : ""}`}
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
                <TabsList className="grid grid-cols-5 rounded-md bg-muted/20 p-1 overflow-x-auto">
                  <TabsTrigger value="flight">Flight</TabsTrigger>
                  <TabsTrigger value="train">Train</TabsTrigger>
                  <TabsTrigger value="bus">Bus</TabsTrigger>
                  <TabsTrigger value="car">Car</TabsTrigger>
                  <TabsTrigger value="waterway">Waterway</TabsTrigger>
                </TabsList>
                {(["flight", "train", "bus", "car", "waterway"] as const).map(
                  (t) => (
                    <TabsContent key={t} value={t} className="mt-4">
                      <div className="grid grid-cols-1 gap-3">
                        {getLegs(tripType, origin, form.destination, stops).map(
                          ([lo, ld], i) => (
                            <div
                              key={i}
                              className="space-y-2 rounded-md border p-3"
                            >
                              <div className="text-xs text-muted-foreground">
                                Leg {i + 1}: {lo} → {ld}
                              </div>
                              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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

          <Card className="order-10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalIcon className="h-5 w-5 text-primary" /> Plan & Calendar
                  📅
                </CardTitle>
                <Button onClick={exportPdf} variant="outline" className="gap-2">
                  <FileDown className="h-4 w-4" /> Export PDF
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Drag to arrange your day. Shows what to do, where, and at what
                time for each day.
              </p>
            </CardHeader>
            <div className="flex items-center justify-end px-6 -mt-2">
              <button
                onClick={() => setOpenCalendar((v) => !v)}
                aria-expanded={openCalendar}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {openCalendar ? "Collapse" : "Expand"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openCalendar ? "rotate-180" : "rotate-0"}`}
                />
              </button>
            </div>
            <CardContent className={openCalendar ? "" : "hidden"}>
              {calendar?.length ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
                  {calendar.map((d, di) => (
                    <div
                      key={d.day}
                      className="rounded-xl border p-3 min-h-[240px] overflow-auto"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-semibold">Day {d.day}</div>
                        <div className="text-xs text-muted-foreground">
                          Focus:{" "}
                          {itinerary?.days.find((x) => x.day === d.day)?.theme}
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {d.activities.map((a, ai) => (
                          <li
                            key={ai}
                            className="cursor-move rounded-md border bg-card p-2 text-sm"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData(
                                "text/plain",
                                JSON.stringify({ di, ai }),
                              );
                            }}
                          >
                            <div className="flex items-center gap-3">
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
                                className="h-8 rounded border px-2 text-xs"
                              />
                              <span className="font-medium">
                                {a.time || "--:--"}
                              </span>
                              <span>• {a.text}</span>
                            </div>
                          </li>
                        ))}
                        <li
                          className="rounded-md border border-dashed p-2 text-center text-xs text-muted-foreground"
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" /> Budget Overview 💰
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Smart cost breakdowns that adapt to members, days, and mode.
                </p>
              </CardHeader>
              <div className="flex items-center justify-end px-6 -mt-2">
                <button
                  onClick={() => setOpenBudget((v) => !v)}
                  aria-expanded={openBudget}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {openBudget ? "Collapse" : "Expand"}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${openBudget ? "rotate-180" : "rotate-0"}`}
                  />
                </button>
              </div>
              <CardContent className={openBudget ? "" : "hidden"}>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-secondary p-3">
                    Total Budget
                    <div className="text-2xl font-bold">
                      {formatINR(form.budget)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    Per Day
                    <div className="text-2xl font-bold">
                      {formatINR(form.budget / Math.max(1, daysCalc))}
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                  <div className="rounded-md border p-3">
                    Transport
                    <div className="font-semibold">
                      {formatINR(transportTotal)}
                    </div>
                  </div>
                  <div className="rounded-md border p-3">
                    Stay
                    <div className="font-semibold">
                      {formatINR(stayTotal)}{" "}
                      <span className="text-xs text-muted-foreground">
                        ({rooms} rooms)
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md border p-3">
                    Food
                    <div className="font-semibold">{formatINR(foodTotal)}</div>
                  </div>
                  <div className="rounded-md border p-3">
                    Activities
                    <div className="font-semibold">{formatINR(actTotal)}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Display currency:</span>
                  <Input
                    value={budgetCurrency}
                    onChange={(e) => setBudgetCurrency(e.target.value.toUpperCase())}
                    className="h-8 w-24"
                  />
                </div>
                {openBudget && (
                  <div className="mt-3 h-56 w-full">
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
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                        >
                          {["#60a5fa", "#a78bfa", "#34d399", "#f59e0b"].map((c, i) => (
                            <Cell key={i} fill={c} />
                          ))}
                        </Pie>
                        <ReTooltip formatter={(v: any, n: any) => [formatMoney(Number(v)), n]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="mt-3 rounded-md border p-3 text-sm">
                  Suggested trip total:{" "}
                  <span className="font-semibold">
                    {formatINR(suggestedTotal)}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({members > 0 ? `${members} members, ` : ""}
                    {daysCalc} days)
                  </span>
                  <div className="mt-1 text-xs">
                    {form.budget >= suggestedTotal ? (
                      <span className="text-green-600">
                        Within budget by{" "}
                        {formatINR(form.budget - suggestedTotal)}
                      </span>
                    ) : (
                      <span className="text-red-600">
                        Short by {formatINR(suggestedTotal - form.budget)}
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2 h-7 px-2"
                      onClick={() =>
                        setForm((f) => ({ ...f, budget: suggestedTotal }))
                      }
                    >
                      Set as budget
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Group Collaboration
                  👥
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Share a code so friends can view and plan together.
                </p>
              </CardHeader>
              <div className="flex items-center justify-end px-6 -mt-2">
                <button
                  onClick={() => setOpenGroup((v) => !v)}
                  aria-expanded={openGroup}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {openGroup ? "Collapse" : "Expand"}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${openGroup ? "rotate-180" : "rotate-0"}`}
                  />
                </button>
              </div>
              <CardContent className={openGroup ? "" : "hidden"}>
                <p className="text-sm text-muted-foreground">
                  Share your plan with friends using your trip code.
                </p>
                <ShareTrip />
                <div className="mt-4">
                  <div className="mb-2 text-xs text-muted-foreground">Trip comments</div>
                  <div className="max-h-48 overflow-auto rounded-md border p-2 text-sm space-y-2">
                    {chatMessages.length ? (
                      chatMessages.map((m) => (
                        <div key={m.id} className="flex items-start gap-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          <div>
                            <div>{m.text}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {new Date(m.at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground">No messages yet. Start the conversation!</div>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      placeholder="Write a message"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") sendChat();
                      }}
                    />
                    <Button onClick={sendChat}>Send</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="h-5 w-5 text-primary" /> Hotel Search 🏨
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Compare stays by rating and price; open results on your
                preferred site.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  placeholder="City or hotel name"
                  value={hotelQuery}
                  onChange={(e) => setHotelQuery(e.target.value)}
                />
                <Button className="w-full xs:w-auto" onClick={doHotelSearch}>
                  Search
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                {hotels.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{h.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">⭐ {h.rating}</span>
                        <Badge variant={h.rating >= 4.5 ? "default" : h.rating >= 4.0 ? "secondary" : "outline"}>
                          {h.rating >= 4.5 ? "Excellent" : h.rating >= 4.0 ? "Very good" : "Good"}
                        </Badge>
                      </div>
                      {h.reviews?.length ? (
                        <div className="text-xs text-muted-foreground">
                          “{h.reviews[0]}”
                        </div>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        ₹
                        {new Intl.NumberFormat("en-IN").format(h.pricePerNight)}
                        /night
                      </div>
                      <a
                        className="text-xs text-primary underline"
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
                  <div className="text-muted-foreground">
                    Search to see hotel options.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" /> Currency
                Converter 💱
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Convert costs instantly with live rates and offline fallbacks.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 md:grid-cols-4">
                <div className="md:col-span-1">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={fx.amount}
                    onChange={(e) =>
                      setFx({ ...fx, amount: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="md:col-span-1">
                  <Label>From</Label>
                  <Input
                    value={fx.from}
                    onChange={(e) =>
                      setFx({ ...fx, from: e.target.value.toUpperCase() })
                    }
                  />
                </div>
                <div className="md:col-span-1">
                  <Label>To</Label>
                  <Input
                    value={fx.to}
                    onChange={(e) =>
                      setFx({ ...fx, to: e.target.value.toUpperCase() })
                    }
                  />
                </div>
                <div className="flex items-end md:col-span-1">
                  <Button onClick={convert} className="w-full">
                    Convert
                  </Button>
                </div>
              </div>
              {fx.result ? (
                <div className="rounded-md bg-secondary p-3 text-sm">
                  {fx.amount} {fx.from} ={" "}
                  <span className="font-semibold">
                    {fx.result.toFixed(2)} {fx.to}
                  </span>{" "}
                  (rate {fx.rate.toFixed(4)})
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Enter values and convert.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
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
    <div className="mt-2 flex items-center gap-2">
      <Input readOnly value={code} className="font-mono" />
      <Button onClick={copy} variant="outline">
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
