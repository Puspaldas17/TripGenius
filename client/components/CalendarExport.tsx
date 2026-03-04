import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Download, ExternalLink, Check } from "lucide-react";
import {
  generateICS,
  downloadICS,
  buildGoogleCalendarURL,
  type ICalActivity,
} from "@/lib/icalExport";
import { toast } from "sonner";

interface CalendarExportProps {
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  activities?: ICalActivity[];
}

export default function CalendarExport({
  tripName,
  destination,
  startDate,
  endDate,
  activities = [],
}: CalendarExportProps) {
  const [exported, setExported] = useState(false);

  const handleICS = () => {
    const ics = generateICS({ tripName, destination, activities });
    downloadICS(ics, `${destination.replace(/[^a-z0-9]/gi, "_")}_itinerary`);
    setExported(true);
    toast.success(
      "📅 Calendar file downloaded! Open it to import into any calendar app.",
    );
    setTimeout(() => setExported(false), 3000);
  };

  const handleGoogle = () => {
    const url = buildGoogleCalendarURL({
      title: `✈️ ${tripName}`,
      startDate,
      endDate,
      location: destination,
      details: `Trip to ${destination} planned with TripGenius. Check your itinerary for full details.`,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("Opening Google Calendar…");
  };

  return (
    <Card className="glass-card border-primary/20 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="h-5 w-5 text-blue-400" />
          Export to Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Add <span className="font-semibold text-foreground">{tripName}</span>{" "}
          to your calendar app to get trip reminders and stay on schedule.
        </p>

        <div className="rounded-2xl border border-primary/15 bg-background/60 p-3 space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Destination</span>
            <span className="font-semibold text-foreground">{destination}</span>
          </div>
          <div className="flex justify-between">
            <span>Start</span>
            <span className="font-semibold text-foreground">
              {new Date(startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>End</span>
            <span className="font-semibold text-foreground">
              {new Date(endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          {activities.length > 0 && (
            <div className="flex justify-between">
              <span>Activities</span>
              <span className="font-semibold text-foreground">
                {activities.length} events
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleGoogle}
            className="w-full gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 border-0 text-white font-semibold hover:scale-[1.02] transition-transform"
          >
            <ExternalLink className="h-4 w-4" />
            Add to Google Calendar
          </Button>
          <Button
            onClick={handleICS}
            variant="outline"
            className={`w-full gap-2 border-primary/20 hover:bg-primary/10 transition-all ${exported ? "border-green-500/50 text-green-400" : ""}`}
          >
            {exported ? (
              <Check className="h-4 w-4" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {exported
              ? "Downloaded!"
              : "Download .ics (iCal / Outlook / Apple)"}
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground text-center">
          Works with Google Calendar, Apple Calendar, Outlook, and any RFC 5545
          compatible app.
        </p>
      </CardContent>
    </Card>
  );
}
