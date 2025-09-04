import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
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
    if (!serverOk) return;
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
        safeFetch(`${apiBase}/weather?location=${encodeURIComponent(form.destination)}`),
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
    if (!serverOk) return;
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
    if (!serverOk) return;
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
    if (!serverOk) return;
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

  // Detect API base and availability; supports Netlify Functions and direct /api
  useEffect(() => {
    const ac = new AbortController();
    const timeout = (ms: number) =>
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), ms));
    const probe = async (base: string) => {
      try {
        const res = await Promise.race([
          safeFetch(`${base}/ping`, { signal: ac.signal }),
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
    (async () => {
      if (await probe("/api")) {
        setApiBase("/api");
        setServerOk(true);
        return;
      }
      if (await probe("/.netlify/functions/api")) {
        setApiBase("/.netlify/functions/api");
        setServerOk(true);
        return;
      }
      setServerOk(false);
    })();
    return () => ac.abort();
  }, []);

  // Fetch per-leg travel depending on trip type
  const legsRequestId = useRef(0);
  useEffect(() => {
    const id = ++legsRequestId.current;
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
    if (!serverOk) return;
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
    if (!serverOk) return;
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
    <div className="mx-auto w-full max-w-7xl px-3 py-8 xs:px-4 md:px-6 md:py-10">
      <div className="grid grid-cols-1 gap-4 xs:gap-6 xs:grid-cols-2 md:grid-cols-3">
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
                  Per person per day at current budget:{" "}
                  <span className="font-medium">
                    {formatINR(perPersonPerDay)}
                  </span>
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
            <Button onClick={generate} disabled={!serverOk || loading} className="w-full">
              {loading ? "Generating..." : "Generate Itinerary"}
            </Button>
            {!serverOk && (
              <div className="mt-2 rounded-md border border-dashed p-2 text-xs text-muted-foreground">
                Backend unavailable. Live features are temporarily disabled.
              </div>
            )}
            <div className="rounded-md bg-secondary p-3 text-sm text-muted-foreground">
              Daily budget per person:{" "}
              <span className="font-semibold text-foreground">
                {formatINR(perPersonPerDay)}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6 flex flex-col">
          <Card className="order-10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="h-5 w-5 text-primary" /> Nearby Places
              </CardTitle>
            </CardHeader>
            <CardContent>
              {places.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {places.slice(0, 12).map((p) => (
                    <a
                      key={p.id}
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border p-3 hover:shadow-sm"
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
                <CloudSun className="h-5 w-5 text-primary" /> Weather Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weather ? (
                <div className="grid grid-cols-2 gap-3 text-sm xs:grid-cols-3 md:grid-cols-4">
                  {weather.daily.map((d) => (
                    <div key={d.date} className="rounded-lg border p-3">
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
                  <MapIcon className="h-5 w-5 text-primary" /> Route & Modes
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
            </CardHeader>
            <CardContent>
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
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                  {travel.options
                    .filter((o) => o.available)
                    .map((o) => (
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlaneTakeoff className="h-5 w-5 text-primary" /> Transport
                Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={mode ?? undefined}
                onValueChange={(v) => setMode(v as any)}
              >
                <TabsList className="grid grid-cols-5">
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
                </CardTitle>
                <Button onClick={exportPdf} variant="outline" className="gap-2">
                  <FileDown className="h-4 w-4" /> Export PDF
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Drag to arrange your day. Shows what to do, where, and at what time for each day.</p>
            </CardHeader>
            <CardContent>
              {calendar?.length ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {calendar.map((d, di) => (
                    <div key={d.day} className="rounded-xl border p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-semibold">Day {d.day}</div>
                        <div className="text-xs text-muted-foreground">
                          Focus: {itinerary?.days.find((x) => x.day === d.day)?.theme}
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
                  <Wallet className="h-5 w-5 text-primary" /> Budget Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                      {formatINR(perDay)}
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
                <div className="mt-3 rounded-md border p-3 text-sm">
                  Suggested trip total:{" "}
                  <span className="font-semibold">
                    {formatINR(suggestedTotal)}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({members} members, {daysCalc} days)
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
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Share your plan with friends using your trip code.
                </p>
                <ShareTrip />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="h-5 w-5 text-primary" /> Hotel Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-2 xs:flex-row">
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
                    <div className="flex flex-col">
                      <span className="font-medium">{h.name}</span>
                      <span className="text-muted-foreground">
                        ⭐ {h.rating}
                      </span>
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
                Converter
              </CardTitle>
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
