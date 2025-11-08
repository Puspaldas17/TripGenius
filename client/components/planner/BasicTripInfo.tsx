import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface BasicTripInfoProps {
  destination: string;
  origin: string;
  onDestinationChange: (value: string) => void;
  onOriginChange: (value: string) => void;
  onUseCurrentLocation: () => void;
  onUseCurrentOrigin: () => void;
}

export function BasicTripInfo({
  destination,
  origin,
  onDestinationChange,
  onOriginChange,
  onUseCurrentLocation,
  onUseCurrentOrigin,
}: BasicTripInfoProps) {
  return (
    <Card className="transition-all duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Destination & Origin
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-2">
          Where are you traveling from and to?
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="font-medium">Destination</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={destination}
              onChange={(e) => onDestinationChange(e.target.value)}
              placeholder="e.g., Paris, France"
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={onUseCurrentLocation}
              className="w-full sm:w-auto"
            >
              Use current
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-medium">Origin</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={origin}
              onChange={(e) => onOriginChange(e.target.value)}
              placeholder="e.g., New York, USA"
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={onUseCurrentOrigin}
              className="w-full sm:w-auto"
            >
              Use current
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
