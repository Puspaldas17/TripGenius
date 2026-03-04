import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Plane, Bell } from "lucide-react";

interface CountdownWidgetProps {
  destination?: string;
  targetDate?: string; // ISO date string
}

function getTimeLeft(target: Date) {
  const now = Date.now();
  const diff = target.getTime() - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

export default function CountdownWidget({
  destination,
  targetDate,
}: CountdownWidgetProps) {
  const [timeLeft, setTimeLeft] =
    useState<ReturnType<typeof getTimeLeft>>(null);
  const [tripInfo, setTripInfo] = useState<{
    destination: string;
    date: string;
  } | null>(null);

  useEffect(() => {
    // If no date passed, try to get the next upcoming trip from localStorage
    let dest = destination;
    let date = targetDate;

    if (!date) {
      try {
        const raw = localStorage.getItem("tg_saved_trips");
        const trips = raw ? JSON.parse(raw) : [];
        const upcoming = trips
          .filter((t: any) => new Date(t.startDate) > new Date())
          .sort(
            (a: any, b: any) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
          );
        if (upcoming.length > 0) {
          dest = upcoming[0].destination;
          date = upcoming[0].startDate;
        }
      } catch {}
    }

    if (dest && date) {
      setTripInfo({ destination: dest, date });
    }
  }, [destination, targetDate]);

  useEffect(() => {
    if (!tripInfo?.date) return;
    const target = new Date(tripInfo.date);
    const tick = () => setTimeLeft(getTimeLeft(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tripInfo]);

  if (!tripInfo || !timeLeft) {
    return (
      <Card className="glass-card border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-5 w-5 text-primary" /> Trip Countdown
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 space-y-3">
          <div className="text-4xl">✈️</div>
          <p className="text-sm text-muted-foreground">
            No upcoming trips found.
          </p>
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-primary to-accent border-0 text-white"
          >
            <Link to="/planner">Plan a Trip</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <Card className="glass-card border-primary/20 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary animate-shimmer" />
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Plane className="h-5 w-5 text-primary animate-bounce-subtle" /> Next
          Trip Countdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            Heading to
          </p>
          <p className="text-xl font-extrabold gradient-text mt-1">
            {tripInfo.destination}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(tripInfo.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {units.map((u) => (
            <div
              key={u.label}
              className="flex flex-col items-center rounded-2xl bg-gradient-to-b from-primary/10 to-accent/5 border border-primary/15 py-3 px-1"
            >
              <span className="text-2xl font-extrabold text-foreground tabular-nums leading-none">
                {String(u.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold tracking-wide mt-1">
                {u.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/5 px-3 py-2">
          <Bell className="h-4 w-4 text-accent shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              {timeLeft.days} days
            </span>{" "}
            until your adventure begins! 🎒
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
