import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Building, ExternalLink, Tag } from "lucide-react";
import { toast } from "sonner";

interface BookingOptionsProps {
  destination: string;
}

export function BookingOptions({ destination }: BookingOptionsProps) {
  const handleBooking = (type: "flight" | "hotel") => {
    toast.success(
      `Redirecting to our partner for ${destination} ${type}s... (Mock)`,
    );
  };

  return (
    <Card className="glass-card mt-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary" />
          Bookings & Offers
        </CardTitle>
        <CardDescription>
          Best prices found for {destination || "your destination"}.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {/* Flights Mock */}
        <div className="rounded-lg border bg-card p-4 flex flex-col justify-between h-full hover:border-primary/50 transition-colors">
          <div>
            <div className="flex items-center gap-2 text-primary font-medium mb-2">
              <Plane className="h-5 w-5" />
              Flights to {destination}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Round trip from your nearest major airport. Direct flights
              starting from ₹12,500.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => handleBooking("flight")}
          >
            View Flight Deals <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Hotels Mock */}
        <div className="rounded-lg border bg-card p-4 flex flex-col justify-between h-full hover:border-primary/50 transition-colors">
          <div>
            <div className="flex items-center gap-2 text-primary font-medium mb-2">
              <Building className="h-5 w-5" />
              Top Rated Hotels
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              4-star and 5-star properties in {destination}. Save up to 25% on
              bundle deals.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => handleBooking("hotel")}
          >
            Browse Hotels <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
