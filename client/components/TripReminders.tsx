import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, MapPin, Clock, ShieldCheck } from "lucide-react";

interface SavedTrip {
  destination?: string;
  startDate?: string;
  endDate?: string;
  id?: string;
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diff;
}

function getStorage<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export default function TripReminders() {
  const [reminders, setReminders] = useState<
    { trip: SavedTrip; days: number }[]
  >([]);
  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    try {
      const v = localStorage.getItem("tg_dismissed_reminders");
      return new Set(v ? JSON.parse(v) : []);
    } catch {
      return new Set();
    }
  });
  const [notifGranted, setNotifGranted] = useState(false); // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    const savedPlans: SavedTrip[] = getStorage("tg_saved_plans", []);

    const upcoming = savedPlans
      .filter((trip) => trip.startDate)
      .map((trip) => ({ trip, days: getDaysUntil(trip.startDate!) }))
      .filter(({ days }) => days >= 0 && days <= 7)
      .sort((a, b) => a.days - b.days);

    setReminders(upcoming);

    // Request notification permission if trips are imminent
    if (
      upcoming.length > 0 &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          setNotifGranted(true);
          upcoming.forEach(({ trip, days }) => {
            new Notification("✈️ Trip Reminder — TripGenius", {
              body: `Your trip to ${trip.destination ?? "your destination"} is in ${days} day${days !== 1 ? "s" : ""}!`,
              icon: "/favicon.ico",
            });
          });
        }
      });
    }
  }, []);

  const dismiss = (id: string) => {
    const newSet = new Set(dismissed);
    newSet.add(id);
    setDismissed(newSet);
    try {
      localStorage.setItem(
        "tg_dismissed_reminders",
        JSON.stringify([...newSet]),
      );
    } catch {}
  };

  const visibleReminders = reminders.filter(({ trip }) => {
    const key = trip.id ?? trip.destination ?? "";
    return !dismissed.has(key);
  });

  if (!visibleReminders.length) return null;

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {visibleReminders.map(({ trip, days }) => {
          const key = trip.id ?? trip.destination ?? Math.random().toString();
          const urgent = days <= 1;
          const soon = days <= 3;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                  urgent
                    ? "border-red-500/40 bg-red-500/10"
                    : soon
                      ? "border-amber-500/40 bg-amber-500/10"
                      : "border-primary/30 bg-primary/10"
                }`}
              >
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                    urgent
                      ? "bg-red-500/20"
                      : soon
                        ? "bg-amber-500/20"
                        : "bg-primary/20"
                  }`}
                >
                  {urgent ? (
                    <Bell className="h-4 w-4 text-red-400 animate-bounce" />
                  ) : (
                    <Clock
                      className={`h-4 w-4 ${soon ? "text-amber-400" : "text-primary"}`}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-bold ${urgent ? "text-red-400" : soon ? "text-amber-400" : "text-primary"}`}
                    >
                      {days === 0
                        ? "🚀 Trip is TODAY!"
                        : days === 1
                          ? "⏰ Trip is TOMORROW!"
                          : `✈️ Trip in ${days} days`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {trip.destination ?? "Your destination"}
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-green-400" />
                      <a
                        href="/emergency"
                        className="text-green-400 hover:underline"
                      >
                        Check safety info
                      </a>
                    </span>
                    <span>
                      <a
                        href="/planner"
                        className="text-primary hover:underline"
                      >
                        Open planner →
                      </a>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => dismiss(key)}
                  className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
