import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface Activity {
  time: string;
  title: string;
  type: "sight" | "food" | "transport" | "hotel" | "activity";
  duration?: number; // minutes
  icon?: string;
}

interface DayPlan {
  day: number;
  date?: string;
  activities: Activity[];
}

interface TripTimelineProps {
  days: DayPlan[];
}

const TYPE_STYLE: Record<string, { color: string; dot: string }> = {
  sight: {
    color: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    dot: "bg-violet-500",
  },
  food: {
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
  },
  transport: {
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    dot: "bg-blue-500",
  },
  hotel: {
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  activity: {
    color: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    dot: "bg-pink-500",
  },
};

export default function TripTimeline({ days }: TripTimelineProps) {
  if (!days.length) {
    return (
      <Card className="glass-card border-primary/20">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center gap-3">
          <Clock className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">
            Generate an itinerary to see your trip timeline
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-5 w-5 text-primary" />
          Trip Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 overflow-x-auto">
        {days.map((day) => (
          <div key={day.day} className="space-y-2">
            {/* Day header */}
            <div className="flex items-center gap-3 sticky left-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-extrabold shadow-md shrink-0">
                {day.day}
              </div>
              <div>
                <span className="text-sm font-bold text-foreground">
                  Day {day.day}
                </span>
                {day.date && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {day.date}
                  </span>
                )}
              </div>
            </div>

            {/* Activities */}
            <div className="ml-4 border-l-2 border-primary/20 pl-4 space-y-2">
              {day.activities.map((act, i) => {
                const style = TYPE_STYLE[act.type] ?? TYPE_STYLE.activity;
                return (
                  <div
                    key={i}
                    className="relative flex items-start gap-3 rounded-xl border border-primary/10 bg-background/60 p-3 shadow-sm hover:bg-primary/5 transition-colors group"
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-[21px] top-4 h-3 w-3 rounded-full border-2 border-background ${style.dot} shadow-sm`}
                    />

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-base">{act.icon ?? "📍"}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold text-foreground leading-snug">
                          {act.title}
                        </span>
                        <Badge
                          className={`text-[10px] whitespace-nowrap border px-1.5 py-0 h-5 ${style.color}`}
                        >
                          {act.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {act.time}
                        </span>
                        {act.duration && <span>{act.duration} min</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
