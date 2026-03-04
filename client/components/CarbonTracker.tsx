import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Plane, Train, Bus, Car } from "lucide-react";

interface CarbonTrackerProps {
  destinationDistance?: number; // km
}

const TRANSPORT_MODES = [
  {
    id: "flight",
    label: "Flight",
    icon: Plane,
    kgPerKm: 0.255,
    color: "text-red-400",
  },
  {
    id: "train",
    label: "Train",
    icon: Train,
    kgPerKm: 0.041,
    color: "text-green-400",
  },
  {
    id: "bus",
    label: "Bus",
    icon: Bus,
    kgPerKm: 0.089,
    color: "text-yellow-400",
  },
  {
    id: "car",
    label: "Car",
    icon: Car,
    kgPerKm: 0.171,
    color: "text-orange-400",
  },
];

const OFFSETS = [
  { label: "Plant a tree (25kg CO₂)", trees: 1, cost: 2 },
  { label: "Carbon credit (1 tonne)", trees: 40, cost: 15 },
  { label: "Gold standard offset", trees: 100, cost: 35 },
];

export default function CarbonTracker({
  destinationDistance = 1500,
}: CarbonTrackerProps) {
  const [mode, setMode] = useState("flight");
  const selected = TRANSPORT_MODES.find((m) => m.id === mode)!;
  const co2 = Math.round(destinationDistance * selected.kgPerKm);
  const flightCo2 = Math.round(destinationDistance * 0.255);

  const level =
    co2 < 50
      ? "🟢 Low Impact"
      : co2 < 200
        ? "🟡 Moderate Impact"
        : "🔴 High Impact";
  const savings = flightCo2 - co2;

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Leaf className="h-5 w-5 text-green-400" />
          Carbon Footprint Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {TRANSPORT_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                mode === m.id
                  ? "border-primary/60 bg-primary/20 text-primary"
                  : "border-primary/20 bg-background/60 text-muted-foreground hover:bg-primary/10"
              }`}
            >
              <m.icon
                className={`h-3.5 w-3.5 ${mode === m.id ? "text-primary" : m.color}`}
              />
              {m.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-primary/20 bg-background/60 p-4 text-center">
          <div className="text-4xl font-extrabold text-foreground">
            {co2}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              kg CO₂
            </span>
          </div>
          <div className="text-sm mt-1 font-medium">{level}</div>
          {savings > 0 && (
            <div className="text-xs text-green-400 mt-2 font-semibold">
              🌱 {savings}kg saved vs. flying!
            </div>
          )}
        </div>

        {/* Progress bar comparing to flight */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Your Impact</span>
            <span>vs. Flight ({flightCo2}kg)</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, (co2 / flightCo2) * 100)}%`,
                background: co2 < flightCo2 ? "hsl(var(--primary))" : "#ef4444",
              }}
            />
          </div>
        </div>

        <div className="pt-1 border-t border-primary/10">
          <p className="text-xs text-muted-foreground font-semibold mb-2">
            💡 Offset your carbon:
          </p>
          <div className="space-y-1.5">
            {OFFSETS.map((o) => (
              <div
                key={o.label}
                className="flex items-center justify-between text-xs rounded-xl border border-primary/10 bg-background/40 px-3 py-2"
              >
                <span>{o.label}</span>
                <span className="font-bold text-green-400">${o.cost}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
