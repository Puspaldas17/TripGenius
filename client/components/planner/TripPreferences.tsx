import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Lightbulb } from "lucide-react";

interface TripPreferencesProps {
  budget: number;
  members: number;
  mood: string;
  onBudgetChange: (budget: number) => void;
  onMembersChange: (members: number) => void;
  onMoodChange: (mood: string) => void;
  onSetBudget: () => void;
}

const moods = [
  "Adventure",
  "Relaxation",
  "Culture",
  "Food",
  "Luxury",
  "Budget",
  "Nature",
  "Beach",
];

export function TripPreferences({
  budget,
  members,
  mood,
  onBudgetChange,
  onMembersChange,
  onMoodChange,
  onSetBudget,
}: TripPreferencesProps) {
  return (
    <Card className="transition-all duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-primary" />
          Trip Preferences
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-2">
          Customize your travel experience
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Budget
          </Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">₹</span>
              <Input
                type="number"
                value={budget}
                onChange={(e) => onBudgetChange(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="flex-1"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onSetBudget}
              className="w-full sm:w-auto"
            >
              Calculate
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Travelers
          </Label>
          <Input
            type="number"
            min="1"
            value={members}
            onChange={(e) => onMembersChange(parseInt(e.target.value) || 1)}
            placeholder="1"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-medium">Trip Vibe</Label>
          <Select value={mood} onValueChange={onMoodChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {moods.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
