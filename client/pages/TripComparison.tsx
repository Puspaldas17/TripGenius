import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Scale,
  MapPin,
  DollarSign,
  Thermometer,
  Clock,
  Star,
  Plane,
  Wifi,
  Utensils,
  Camera,
  Trophy,
  Info,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface DestinationData {
  name: string;
  country: string;
  flag: string;
  avgCost: number; // per day USD
  bestSeason: string;
  avgTemp: string;
  flightHours: number;
  safetyScore: number; // /10
  foodScore: number; // /10
  attractionScore: number; // /10
  internetSpeed: string;
  visa: string;
  currency: string;
  language: string;
  highlights: string[];
}

const DESTINATIONS: DestinationData[] = [
  {
    name: "Paris",
    country: "France",
    flag: "🇫🇷",
    avgCost: 180,
    bestSeason: "Apr – Jun",
    avgTemp: "15°C",
    flightHours: 9,
    safetyScore: 7,
    foodScore: 10,
    attractionScore: 10,
    internetSpeed: "Fast",
    visa: "Schengen",
    currency: "EUR",
    language: "French",
    highlights: ["Eiffel Tower", "Louvre Museum", "Montmartre", "Versailles"],
  },
  {
    name: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    avgCost: 150,
    bestSeason: "Mar – May",
    avgTemp: "18°C",
    flightHours: 9.5,
    safetyScore: 9,
    foodScore: 10,
    attractionScore: 9,
    internetSpeed: "Very Fast",
    visa: "Visa-free (30 days)",
    currency: "JPY",
    language: "Japanese",
    highlights: ["Shibuya Crossing", "Mount Fuji", "Senso-ji", "Akihabara"],
  },
  {
    name: "Bali",
    country: "Indonesia",
    flag: "🇮🇩",
    avgCost: 65,
    bestSeason: "May – Sep",
    avgTemp: "27°C",
    flightHours: 6.5,
    safetyScore: 7,
    foodScore: 8,
    attractionScore: 9,
    internetSpeed: "Moderate",
    visa: "Visa on arrival",
    currency: "IDR",
    language: "Balinese / Indonesian",
    highlights: [
      "Ubud Rice Terraces",
      "Tanah Lot",
      "Seminyak Beach",
      "Mount Agung",
    ],
  },
  {
    name: "New York",
    country: "USA",
    flag: "🇺🇸",
    avgCost: 250,
    bestSeason: "Sep – Nov",
    avgTemp: "20°C",
    flightHours: 14.5,
    safetyScore: 7,
    foodScore: 9,
    attractionScore: 10,
    internetSpeed: "Very Fast",
    visa: "ESTA / B1-B2",
    currency: "USD",
    language: "English",
    highlights: [
      "Times Square",
      "Central Park",
      "Statue of Liberty",
      "Brooklyn Bridge",
    ],
  },
  {
    name: "Rome",
    country: "Italy",
    flag: "🇮🇹",
    avgCost: 140,
    bestSeason: "Mar – May",
    avgTemp: "20°C",
    flightHours: 8,
    safetyScore: 7,
    foodScore: 10,
    attractionScore: 10,
    internetSpeed: "Fast",
    visa: "Schengen",
    currency: "EUR",
    language: "Italian",
    highlights: [
      "Colosseum",
      "Vatican City",
      "Trevi Fountain",
      "Spanish Steps",
    ],
  },
  {
    name: "Bangkok",
    country: "Thailand",
    flag: "🇹🇭",
    avgCost: 55,
    bestSeason: "Nov – Mar",
    avgTemp: "30°C",
    flightHours: 4.5,
    safetyScore: 7,
    foodScore: 9,
    attractionScore: 8,
    internetSpeed: "Fast",
    visa: "Visa on arrival",
    currency: "THB",
    language: "Thai",
    highlights: [
      "Grand Palace",
      "Wat Pho",
      "Chatuchak Market",
      "Chao Phraya River",
    ],
  },
  {
    name: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    avgCost: 200,
    bestSeason: "Nov – Apr",
    avgTemp: "28°C",
    flightHours: 3.5,
    safetyScore: 9,
    foodScore: 8,
    attractionScore: 9,
    internetSpeed: "Very Fast",
    visa: "Visa on arrival",
    currency: "AED",
    language: "Arabic / English",
    highlights: [
      "Burj Khalifa",
      "Palm Jumeirah",
      "Dubai Mall",
      "Desert Safari",
    ],
  },
  {
    name: "Sydney",
    country: "Australia",
    flag: "🇦🇺",
    avgCost: 170,
    bestSeason: "Sep – Nov",
    avgTemp: "22°C",
    flightHours: 11.5,
    safetyScore: 9,
    foodScore: 8,
    attractionScore: 9,
    internetSpeed: "Fast",
    visa: "eVisitor / ETA",
    currency: "AUD",
    language: "English",
    highlights: [
      "Sydney Opera House",
      "Bondi Beach",
      "Harbour Bridge",
      "Blue Mountains",
    ],
  },
];

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{score}/10</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  );
}

export default function TripComparison() {
  const [selected, setSelected] = useState<string[]>(["Tokyo", "Bali"]);
  const [search, setSearch] = useState("");

  const filtered = DESTINATIONS.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedData = DESTINATIONS.filter((d) => selected.includes(d.name));

  const toggleDestination = (name: string) => {
    if (selected.includes(name)) {
      if (selected.length <= 1) {
        toast.error("Keep at least one destination selected");
        return;
      }
      setSelected((prev) => prev.filter((s) => s !== name));
    } else {
      if (selected.length >= 3) {
        toast.error("Compare up to 3 destinations at a time");
        return;
      }
      setSelected((prev) => [...prev, name]);
    }
  };

  const getBest = (key: keyof DestinationData) => {
    let best = selectedData[0];
    for (const d of selectedData) {
      if (typeof d[key] === "number" && typeof best[key] === "number") {
        if (key === "avgCost" || key === "flightHours") {
          if ((d[key] as number) < (best[key] as number)) best = d;
        } else {
          if ((d[key] as number) > (best[key] as number)) best = d;
        }
      }
    }
    return best.name;
  };

  const bestBudget = getBest("avgCost");
  const bestSafety = getBest("safetyScore");
  const bestFood = getBest("foodScore");
  const bestAttractions = getBest("attractionScore");

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-primary">
            <Scale className="h-4 w-4" />
            Destination Comparison
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Compare Your{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dream Destinations
            </span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Side-by-side comparison of costs, safety, food, attractions, and
            more. Pick up to 3 destinations.
          </p>
        </motion.div>

        {/* Destination Picker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-primary" />
                Choose Destinations ({selected.length}/3 selected)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Search destination..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl border-primary/20 h-9 text-sm"
              />
              <div className="flex flex-wrap gap-2">
                {filtered.map((d) => {
                  const isSelected = selected.includes(d.name);
                  return (
                    <button
                      key={d.name}
                      onClick={() => toggleDestination(d.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold transition-all ${
                        isSelected
                          ? "border-primary/60 bg-primary/15 text-primary"
                          : "border-primary/20 bg-background/40 text-muted-foreground hover:bg-primary/5"
                      }`}
                    >
                      <span>{d.flag}</span>
                      {d.name}
                      {isSelected ? (
                        <X className="h-3 w-3 ml-0.5 text-primary/70" />
                      ) : (
                        <Plus className="h-3 w-3 ml-0.5 opacity-40" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comparison Grid */}
        {selectedData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${selectedData.length}, 1fr)`,
              }}
            >
              {selectedData.map((dest, _idx) => (
                <Card
                  key={dest.name}
                  className="glass-card border-primary/20 overflow-hidden"
                >
                  {/* Destination Header */}
                  <div className="bg-gradient-to-br from-primary/15 to-accent/10 p-4 text-center space-y-2">
                    <div className="text-4xl">{dest.flag}</div>
                    <div>
                      <h3 className="text-lg font-extrabold">{dest.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {dest.country}
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1">
                      {dest.name === bestBudget && (
                        <Badge className="text-[10px] bg-green-500/15 text-green-400 border border-green-500/30">
                          💰 Best Budget
                        </Badge>
                      )}
                      {dest.name === bestSafety && (
                        <Badge className="text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/30">
                          🛡️ Safest
                        </Badge>
                      )}
                      {dest.name === bestFood && (
                        <Badge className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          🍜 Best Food
                        </Badge>
                      )}
                      {dest.name === bestAttractions && (
                        <Badge className="text-[10px] bg-violet-500/15 text-violet-400 border border-violet-500/30">
                          📸 Top Sights
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-4">
                    {/* Quick Stats */}
                    <div className="space-y-2">
                      {[
                        {
                          icon: DollarSign,
                          label: "Avg Daily Cost",
                          value: `~$${dest.avgCost}/day`,
                          highlight: dest.name === bestBudget,
                        },
                        {
                          icon: Thermometer,
                          label: "Avg Temperature",
                          value: dest.avgTemp,
                        },
                        {
                          icon: Clock,
                          label: "Flight Time",
                          value: `~${dest.flightHours}h from India`,
                        },
                        { icon: Plane, label: "Visa", value: dest.visa },
                        {
                          icon: Wifi,
                          label: "Internet",
                          value: dest.internetSpeed,
                        },
                        {
                          icon: Utensils,
                          label: "Cuisine",
                          value: dest.language,
                        },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.label}
                            className={`flex items-center justify-between text-xs rounded-xl px-2.5 py-2 border ${
                              item.highlight
                                ? "border-green-500/30 bg-green-500/5"
                                : "border-primary/10 bg-background/40"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Icon className="h-3 w-3" />
                              {item.label}
                            </div>
                            <span
                              className={`font-semibold ${item.highlight ? "text-green-400" : ""}`}
                            >
                              {item.value}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-1 border-t border-primary/10 space-y-2">
                      <ScoreBar label="Safety" score={dest.safetyScore} />
                      <ScoreBar
                        label="Food & Nightlife"
                        score={dest.foodScore}
                      />
                      <ScoreBar
                        label="Attractions"
                        score={dest.attractionScore}
                      />
                    </div>

                    {/* Season */}
                    <div className="rounded-xl border border-primary/10 bg-background/40 px-3 py-2 text-xs">
                      <span className="text-muted-foreground">
                        Best season:{" "}
                      </span>
                      <span className="font-bold">{dest.bestSeason}</span>
                    </div>

                    {/* Highlights */}
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-1.5 flex items-center gap-1">
                        <Camera className="h-3 w-3" /> Top Highlights
                      </p>
                      <div className="space-y-1">
                        {dest.highlights.map((h) => (
                          <div
                            key={h}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground"
                          >
                            <Star className="h-2.5 w-2.5 text-amber-400 shrink-0" />
                            {h}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full rounded-xl border-primary/20 text-xs hover:bg-primary/10 hover:border-primary/40"
                      onClick={() => {
                        window.location.href = `/planner?destination=${encodeURIComponent(dest.name + ", " + dest.country)}`;
                      }}
                    >
                      Plan Trip to {dest.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Winner Summary */}
        {selectedData.length >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  Comparison Winners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Best Budget",
                      winner: bestBudget,
                      emoji: "💰",
                      color:
                        "text-green-400 border-green-500/30 bg-green-500/5",
                    },
                    {
                      label: "Safest Destination",
                      winner: bestSafety,
                      emoji: "🛡️",
                      color: "text-blue-400 border-blue-500/30 bg-blue-500/5",
                    },
                    {
                      label: "Best Food Scene",
                      winner: bestFood,
                      emoji: "🍜",
                      color:
                        "text-amber-400 border-amber-500/30 bg-amber-500/5",
                    },
                    {
                      label: "Most Attractions",
                      winner: bestAttractions,
                      emoji: "📸",
                      color:
                        "text-violet-400 border-violet-500/30 bg-violet-500/5",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-2xl border p-3 text-center ${item.color}`}
                    >
                      <div className="text-2xl mb-1">{item.emoji}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.label}
                      </div>
                      <div className="font-bold mt-0.5">{item.winner}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary/10 bg-background/40 px-3 py-2.5">
                  <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Scores are based on tourism industry data and traveler
                    surveys. Costs are approximate averages for mid-range
                    travelers including accommodation, food, and local transport
                    — not flights.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
