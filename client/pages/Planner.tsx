import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plane, CloudSun, Wallet, Users, Sparkles, Hotel, PlaneTakeoff, DollarSign, Map as MapIcon, FileDown, Calendar as CalIcon } from "lucide-react";
import type { ItineraryRequest, ItineraryResponse, WeatherResponse, CurrencyConvertResponse, TravelOptionsResponse, TravelOption } from "@shared/api";
import { useEffect, useMemo, useRef, useState } from "react";

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
function formatINR(n: number) { return inr.format(Math.round(n)); }

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
  const [fx, setFx] = useState<{amount:number;from:string;to:string;result:number;rate:number}>({amount:1000,from:"INR",to:"USD",result:0,rate:0});
  const [travel, setTravel] = useState<TravelOptionsResponse | null>(null);
  const [mode, setMode] = useState<TravelOption["mode"] | null>(null);

  const perDay = useMemo(() => (form.budget || 0) / (form.days || 1), [form.budget, form.days]);
  const [calendar, setCalendar] = useState<{ day: number; activities: string[] }[]>([]);

  const exportPdf = () => {
    if (!itinerary) return;
    const w = window.open("", "_blank");
    if (!w) return;
    const html = `<!doctype html><html><head><meta charset='utf-8'><title>TripGenius Itinerary</title>
      <style>body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial;padding:24px;color:#0f172a}
      h1{margin:0 0 8px} h2{margin:16px 0 8px} .box{border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin:10px 0}
      ul{margin:8px 0 0 18px}
      </style></head><body>
      <h1>TripGenius Itinerary — ${itinerary.destination}</h1>
      ${calendar.length ? calendar : itinerary.days}
      ${ (calendar.length ? calendar : itinerary.days).map((d:any)=>`<div class='box'><h2>Day ${d.day}</h2><ul>${d.activities.map((a:string)=>`<li>${a}</li>`).join("")}</ul></div>`).join("") }
      </body></html>`;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  const fetchTravel = async () => {
    try {
      const tRes = await fetch(`/api/travel/options?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(form.destination)}`);
      const tr = (await tRes.json()) as TravelOptionsResponse;
      setTravel(tr);
      const firstAvailable = tr.options.find(o=>o.available) || tr.options[0];
      setMode((m)=> m ?? firstAvailable?.mode ?? null);
    } catch (e) {
      console.error(e);
    }
  };

  const generate = async () => {
    if (!origin || !form.destination) return;
    if (dateRange.from && dateRange.to && dateRange.to < dateRange.from) return;
    setLoading(true);
    try {
      const newDays = dateRange.from && dateRange.to ? Math.max(1, Math.round((+dateRange.to - +dateRange.from) / (1000*60*60*24)) + 1) : form.days;
      const req = { ...form, days: newDays };
      const [aiRes, wRes] = await Promise.all([
        fetch("/api/ai/itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req),
        }),
        fetch(`/api/weather?location=${encodeURIComponent(form.destination)}`),
      ]);
      const ai = (await aiRes.json()) as ItineraryResponse;
      const w = (await wRes.json()) as WeatherResponse;
      setItinerary(ai);
      setCalendar(ai.days.map((d)=>({ day: d.day, activities: [...d.activities] })));
      setWeather(w);
      await fetchTravel();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const doFlightSearch = async () => {
    const res = await fetch(`/api/search/flights?q=${encodeURIComponent(flightQuery || form.destination)}`);
    const json = await res.json();
    setFlights(json.results || []);
  };

  const doHotelSearch = async () => {
    const res = await fetch(`/api/search/hotels?q=${encodeURIComponent(hotelQuery || form.destination)}`);
    const json = await res.json();
    const items = (json.results || []) as any[];
    items.sort((a,b)=> a.pricePerNight - b.pricePerNight || b.rating - a.rating);
    setHotels(items);
  };

  const convert = async () => {
    const res = await fetch(`/api/currency/convert?amount=${fx.amount}&from=${fx.from}&to=${fx.to}`);
    const data = (await res.json()) as CurrencyConvertResponse;
    setFx({ ...fx, rate: data.rate, result: data.result });
  };

  useEffect(()=>{
    if (!form.destination) return;
    const id = setInterval(async ()=>{
      try {
        const r = await fetch(`/api/weather?location=${encodeURIComponent(form.destination)}`);
        const w = (await r.json()) as WeatherResponse;
        setWeather(w);
      } catch {}
    }, 600000);
    return ()=> clearInterval(id);
  }, [form.destination]);

  useEffect(()=>{
    const t = setTimeout(()=>{ fetchTravel(); }, 400);
    return ()=> clearTimeout(t);
  }, [origin, form.destination]);

  const useCurrentOrigin = async () => {
    try {
      const coords = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
      });
      const { latitude, longitude } = coords.coords;
      const resp = await fetch(`/api/geocode/reverse?lat=${latitude}&lon=${longitude}`);
      const data = await resp.json();
      if (data?.label) setOrigin(data.label);
    } catch (e) {
      console.error(e);
    }
  };

  const useCurrentLocation = async () => {
    try {
      const coords = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
      });
      const { latitude, longitude } = coords.coords;
      const resp = await fetch(`/api/geocode/reverse?lat=${latitude}&lon=${longitude}`);
      const data = await resp.json();
      if (data?.label) setForm((f) => ({ ...f, destination: data.label }));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-8 xs:px-4 md:px-6 md:py-10">
      <div className="grid grid-cols-1 gap-4 xs:gap-6 xs:grid-cols-2 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent"/> AI Itinerary Planner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Destination</Label>
              <div className="flex gap-2">
                <Input
                  value={form.destination}
                  onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                  placeholder="City, State (e.g., Mumbai, Maharashtra)"
                />
                <Button variant="outline" onClick={useCurrentLocation} className="shrink-0">Use current</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Origin</Label>
              <div className="flex gap-2">
                <Input value={origin} onChange={(e)=>setOrigin(e.target.value)} placeholder="City, State (e.g., Kolkata, West Bengal)" />
                <Button variant="outline" onClick={useCurrentOrigin} className="shrink-0">Use current</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Travel Dates</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? `${dateRange.from.toLocaleDateString()}${dateRange.to ? ` - ${dateRange.to.toLocaleDateString()}` : ""}` : "Pick dates"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3">
                      <Calendar
                        mode="range"
                        selected={dateRange as any}
                        onSelect={(r: any)=> setDateRange(r || {})}
                        numberOfMonths={1}
                      />
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <Button variant="outline" onClick={()=>{
                          const now = new Date();
                          const end = new Date(now); end.setDate(now.getDate()+1);
                          setDateRange({ from: now, to: end });
                        }}>Weekend</Button>
                        <Button variant="outline" onClick={()=>{
                          const now = new Date();
                          const end = new Date(now); end.setDate(now.getDate()+6);
                          setDateRange({ from: now, to: end });
                        }}>1 Week</Button>
                        <Button variant="outline" onClick={()=> setDateRange({})}>Clear</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Budget (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.budget}
                  onChange={(e) => setForm((f) => ({ ...f, budget: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mood</Label>
              <Select value={form.mood} onValueChange={(m) => setForm((f) => ({ ...f, mood: m as ItineraryRequest["mood"] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Pick a vibe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foodie">Foodie</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="relax">Relax</SelectItem>
                  <SelectItem value="culture">Culture</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generate} disabled={loading} className="w-full">
              {loading ? "Generating..." : "Generate Itinerary"}
            </Button>
            <div className="rounded-md bg-secondary p-3 text-sm text-muted-foreground">
              Daily budget estimate: <span className="font-semibold text-foreground">{formatINR(perDay)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CloudSun className="h-5 w-5 text-primary"/> Weather Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {weather ? (
                <div className="grid grid-cols-2 gap-3 text-sm xs:grid-cols-3 md:grid-cols-4">
                  {weather.daily.map((d) => (
                    <div key={d.date} className="rounded-lg border p-3">
                      <div className="font-medium">{new Date(d.date).toLocaleDateString()}</div>
                      <div className="mt-1 text-muted-foreground">{d.summary}</div>
                      <div className="mt-1">{Math.round(d.tempMin)}° / {Math.round(d.tempMax)}°C</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground">Generate an itinerary to see upcoming weather.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Plane className="h-5 w-5 text-primary"/> Suggested Plan</CardTitle>
                <Button onClick={exportPdf} variant="outline" className="gap-2"><FileDown className="h-4 w-4"/> Export PDF</Button>
              </div>
            </CardHeader>
            <CardContent>
              {itinerary ? (
                <div className="space-y-5">
                  {itinerary.days.map((day) => (
                    <div key={day.day} className="rounded-xl border p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">Day {day.day}</div>
                        <div className="text-sm text-muted-foreground">Focus: {day.theme}</div>
                      </div>
                      <Separator className="my-3" />
                      <ul className="list-disc space-y-2 pl-5 text-sm">
                        {day.activities.map((a, idx) => (
                          <li key={idx}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground">Your AI plan will appear here.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><MapIcon className="h-5 w-5 text-primary"/> Route & Modes</CardTitle>
                {travel?.options?.length ? (
                  <Select value={mode ?? undefined} onValueChange={(v)=> setMode(v as any)}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Mode" /></SelectTrigger>
                    <SelectContent>
                      {travel.options.filter(o=>o.available).map((o)=> (
                        <SelectItem key={o.mode} value={o.mode}>{o.mode} • {o.timeHours}h • {formatINR(o.price)}</SelectItem>
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
                <div className="mt-3 text-sm text-muted-foreground">Approx distance: {travel.km} km • Selected: {mode || "-"}</div>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">Generate to see route and modes.</p>
              )}

              {travel?.options?.length ? (
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                  {travel.options.filter(o=>o.available).map((o)=> (
                    <button key={o.mode} onClick={()=> setMode(o.mode)} className={`rounded-lg border p-3 text-left text-sm transition ${mode===o.mode? 'border-primary ring-2 ring-primary/30' : ''}`}>
                      <div className="font-medium capitalize">{o.mode}</div>
                      <div className="text-muted-foreground">{o.timeHours}h • {formatINR(o.price)}</div>
                    </button>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalIcon className="h-5 w-5 text-primary"/> Drag-and-Drop Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              {calendar?.length ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {calendar.map((d, di) => (
                    <div key={d.day} className="rounded-xl border p-3">
                      <div className="mb-2 font-semibold">Day {d.day}</div>
                      <ul className="space-y-2">
                        {d.activities.map((a, ai) => (
                          <li
                            key={ai}
                            className="cursor-move rounded-md border bg-card p-2 text-sm"
                            draggable
                            onDragStart={(e)=>{
                              e.dataTransfer.setData("text/plain", JSON.stringify({ di, ai }));
                            }}
                          >
                            {a}
                          </li>
                        ))}
                        <li
                          className="rounded-md border border-dashed p-2 text-center text-xs text-muted-foreground"
                          onDragOver={(e)=>e.preventDefault()}
                          onDrop={(e)=>{
                            e.preventDefault();
                            const data = JSON.parse(e.dataTransfer.getData("text/plain"));
                            if (data && typeof data.di === "number" && typeof data.ai === "number") {
                              setCalendar((prev)=>{
                                const next = prev.map((x)=>({ day: x.day, activities: [...x.activities] }));
                                const [moved] = next[data.di].activities.splice(data.ai,1);
                                next[di].activities.push(moved);
                                return next;
                              });
                            }
                          }}
                        >
                          Drop here to add
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground">Generate an itinerary, then drag items between days.</div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-primary"/> Budget Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-secondary p-3">
                    Total Budget
                    <div className="text-2xl font-bold">{formatINR(form.budget)}</div>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    Per Day
                    <div className="text-2xl font-bold">{formatINR(perDay)}</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                  <div className="rounded-md border p-3">Transport
                    <div className="font-semibold">{formatINR(mode && travel ? (travel.options.find(o=>o.mode===mode)?.price || 0) : 0)}</div>
                  </div>
                  <div className="rounded-md border p-3">Stay
                    <div className="font-semibold">{formatINR((form.days || 1) * 3000)}</div>
                  </div>
                  <div className="rounded-md border p-3">Food
                    <div className="font-semibold">{formatINR((form.days || 1) * 1000)}</div>
                  </div>
                  <div className="rounded-md border p-3">Activities
                    <div className="font-semibold">{formatINR((form.days || 1) * 800)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary"/> Group Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Share your plan with friends using your trip code.
                </p>
                <ShareTrip />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PlaneTakeoff className="h-5 w-5 text-primary"/> Flight Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col gap-2 xs:flex-row">
                  <Input placeholder="Destination or airport" value={flightQuery} onChange={(e)=>setFlightQuery(e.target.value)} />
                  <Button className="w-full xs:w-auto" onClick={doFlightSearch}>Search</Button>
                </div>
                <div className="space-y-2 text-sm">
                  {flights.map((f)=> (
                    <div key={f.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{f.from} → {f.to}</span>
                        <span className="text-muted-foreground">{f.airline} • {f.departure}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">₹{new Intl.NumberFormat('en-IN').format(f.price)}</div>
                        <a className="text-xs text-primary underline" href="#" rel="noreferrer">Book (affiliate)</a>
                      </div>
                    </div>
                  ))}
                  {flights.length === 0 && <div className="text-muted-foreground">Search to see flight options.</div>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Hotel className="h-5 w-5 text-primary"/> Hotel Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col gap-2 xs:flex-row">
                  <Input placeholder="City or hotel name" value={hotelQuery} onChange={(e)=>setHotelQuery(e.target.value)} />
                  <Button className="w-full xs:w-auto" onClick={doHotelSearch}>Search</Button>
                </div>
                <div className="space-y-2 text-sm">
                  {hotels.map((h)=> (
                    <div key={h.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{h.name}</span>
                        <span className="text-muted-foreground">⭐ {h.rating}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">₹{new Intl.NumberFormat('en-IN').format(h.pricePerNight)}/night</div>
                        <a className="text-xs text-primary underline" href={h.url} target="_blank" rel="noreferrer">View</a>
                      </div>
                    </div>
                  ))}
                  {hotels.length === 0 && <div className="text-muted-foreground">Search to see hotel options.</div>}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary"/> Currency Converter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 md:grid-cols-4">
                <div className="md:col-span-1">
                  <Label>Amount</Label>
                  <Input type="number" value={fx.amount} onChange={(e)=>setFx({ ...fx, amount: Number(e.target.value) })} />
                </div>
                <div className="md:col-span-1">
                  <Label>From</Label>
                  <Input value={fx.from} onChange={(e)=>setFx({ ...fx, from: e.target.value.toUpperCase() })} />
                </div>
                <div className="md:col-span-1">
                  <Label>To</Label>
                  <Input value={fx.to} onChange={(e)=>setFx({ ...fx, to: e.target.value.toUpperCase() })} />
                </div>
                <div className="flex items-end md:col-span-1">
                  <Button onClick={convert} className="w-full">Convert</Button>
                </div>
              </div>
              {fx.result ? (
                <div className="rounded-md bg-secondary p-3 text-sm">
                  {fx.amount} {fx.from} = <span className="font-semibold">{fx.result.toFixed(2)} {fx.to}</span> (rate {fx.rate.toFixed(4)})
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Enter values and convert.</div>
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
      <Button onClick={copy} variant="outline">Copy</Button>
    </div>
  );
}

function cryptoRandom(length: number) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
