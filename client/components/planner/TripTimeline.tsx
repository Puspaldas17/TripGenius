import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Plane,
  Hotel,
  MapIcon,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import type { ItineraryResponse } from "@shared/api";

interface TripTimelineProps {
  itinerary: ItineraryResponse | null;
  startDate?: Date;
  days: number;
}

export default function TripTimeline({
  itinerary,
  startDate,
  days,
}: TripTimelineProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(
    itinerary ? 1 : null,
  );

  const generateDates = () => {
    if (!startDate) return [];
    const dates = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return (
      <Card className="hover:shadow-lg transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5 text-primary" />
            Trip Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/50 p-2 text-center text-xs text-muted-foreground">
            Generate an itinerary to see your trip timeline
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-5 w-5 text-primary" />
          Trip Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {itinerary.days.map((day, idx) => {
            const dayDate = dates[idx];
            const isExpanded = expandedDay === day.day;

            return (
              <div key={day.day} className="relative">
                {/* Timeline dot and connector */}
                <div className="absolute left-4 top-0 -ml-2 h-4 w-4 rounded-full border-2 border-primary bg-white dark:bg-background z-10" />

                {idx < itinerary.days.length - 1 && (
                  <div className="absolute left-6 top-6 bottom-0 w-0.5 bg-border" />
                )}

                {/* Timeline content */}
                <div className="ml-12">
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Day {day.day}</Badge>
                          {dayDate && (
                            <span className="text-xs text-muted-foreground">
                              {dayDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                        {!isExpanded && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {day.activities[0] || "No activities"}
                          </p>
                        )}
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-2 ml-0 space-y-2 animate-in fade-in slide-in-from-top-2">
                      {day.activities.map((activity, actIdx) => (
                        <div
                          key={actIdx}
                          className="rounded-md border-l-2 border-primary/50 bg-muted/30 p-3 text-sm"
                        >
                          <div className="flex gap-2">
                            <MapIcon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">
                              {activity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 rounded-lg bg-primary/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Plane className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {itinerary.days.length} day trip
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapIcon className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              {itinerary.days.reduce(
                (sum, day) => sum + day.activities.length,
                0,
              )}{" "}
              activities planned
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
