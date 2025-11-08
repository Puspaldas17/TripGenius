import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface TripScheduleProps {
  tripType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  days: number;
  onTripTypeChange: (value: string) => void;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onDaysChange: (days: number) => void;
}

export function TripSchedule({
  tripType,
  startDate,
  endDate,
  days,
  onTripTypeChange,
  onStartDateChange,
  onEndDateChange,
  onDaysChange,
}: TripScheduleProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  return (
    <Card className="transition-all duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          Trip Schedule
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-2">
          When are you planning to travel?
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="font-medium">Trip Type</Label>
          <Select value={tripType} onValueChange={onTripTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oneway">One Way</SelectItem>
              <SelectItem value="roundtrip">Round Trip</SelectItem>
              <SelectItem value="multicity">Multi-city</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="font-medium">Start Date</Label>
            <Input
              type="date"
              value={formatDate(startDate)}
              onChange={(e) => onStartDateChange(new Date(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label className="font-medium">End Date</Label>
            <Input
              type="date"
              value={formatDate(endDate)}
              onChange={(e) => onEndDateChange(new Date(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-medium">Trip Duration</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max="365"
              value={days}
              onChange={(e) => onDaysChange(parseInt(e.target.value) || 1)}
              className="max-w-xs"
            />
            <span className="text-sm text-muted-foreground">days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
