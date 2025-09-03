import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plane, CloudSun, Wallet, Users, Sparkles } from "lucide-react";
import type { ItineraryRequest, ItineraryResponse, WeatherResponse } from "@shared/api";

export default function Planner() {
  const [form, setForm] = useState<ItineraryRequest>({
    destination: "Tokyo, Japan",
    days: 5,
    budget: 1500,
    mood: "adventure",
  });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);

  const perDay = useMemo(() => (form.budget || 0) / (form.days || 1), [form.budget, form.days]);

  const generate = async () => {
    setLoading(true);
    try {
      const [aiRes, wRes] = await Promise.all([
        fetch("/api/ai/itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }),
        fetch(`/api/weather?location=${encodeURIComponent(form.destination)}`),
      ]);
      const ai = (await aiRes.json()) as ItineraryResponse;
      const w = (await wRes.json()) as WeatherResponse;
      setItinerary(ai);
      setWeather(w);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent"/> AI Itinerary Planner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Destination</Label>
              <Input
                value={form.destination}
                onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                placeholder="City, Country"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Days</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.days}
                  onChange={(e) => setForm((f) => ({ ...f, days: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Budget ($)</Label>
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
              Daily budget estimate: <span className="font-semibold text-foreground">${perDay.toFixed(0)}</span>
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
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
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
              <CardTitle className="flex items-center gap-2"><Plane className="h-5 w-5 text-primary"/> Suggested Plan</CardTitle>
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-primary"/> Budget Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-secondary p-3">
                    Total Budget
                    <div className="text-2xl font-bold">${form.budget.toLocaleString()}</div>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    Per Day
                    <div className="text-2xl font-bold">${perDay.toFixed(0)}</div>
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
