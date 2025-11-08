import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { BasicTripInfo } from "./BasicTripInfo";
import { TripSchedule } from "./TripSchedule";
import { TripPreferences } from "./TripPreferences";

interface PlannerLayoutProps {
  // Form state
  destination: string;
  origin: string;
  tripType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  days: number;
  budget: number;
  members: number;
  mood: string;

  // Handlers
  onDestinationChange: (value: string) => void;
  onOriginChange: (value: string) => void;
  onTripTypeChange: (value: string) => void;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onDaysChange: (days: number) => void;
  onBudgetChange: (budget: number) => void;
  onMembersChange: (members: number) => void;
  onMoodChange: (mood: string) => void;
  onUseCurrentLocation: () => void;
  onUseCurrentOrigin: () => void;
  onGenerateItinerary: () => void;

  // States
  loadingItinerary: boolean;
  children: React.ReactNode;
}

export function PlannerLayout({
  destination,
  origin,
  tripType,
  startDate,
  endDate,
  days,
  budget,
  members,
  mood,
  onDestinationChange,
  onOriginChange,
  onTripTypeChange,
  onStartDateChange,
  onEndDateChange,
  onDaysChange,
  onBudgetChange,
  onMembersChange,
  onMoodChange,
  onUseCurrentLocation,
  onUseCurrentOrigin,
  onGenerateItinerary,
  loadingItinerary,
  children,
}: PlannerLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ animation: "fadeIn 0.5s ease-out" }}>
      {/* LEFT COLUMN: FORM SECTIONS */}
      <div className="lg:col-span-1 space-y-4">
        <div className="sticky top-20 space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              ✈
            </div>
            <h2 className="text-xl font-bold">Plan Your Trip</h2>
          </div>

          {/* Step 1: Basic Info */}
          <BasicTripInfo
            destination={destination}
            origin={origin}
            onDestinationChange={onDestinationChange}
            onOriginChange={onOriginChange}
            onUseCurrentLocation={onUseCurrentLocation}
            onUseCurrentOrigin={onUseCurrentOrigin}
          />

          {/* Step 2: Schedule */}
          <TripSchedule
            tripType={tripType}
            startDate={startDate}
            endDate={endDate}
            days={days}
            onTripTypeChange={onTripTypeChange}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
            onDaysChange={onDaysChange}
          />

          {/* Step 3: Preferences */}
          <TripPreferences
            budget={budget}
            members={members}
            mood={mood}
            onBudgetChange={onBudgetChange}
            onMembersChange={onMembersChange}
            onMoodChange={onMoodChange}
            onSetBudget={() => {}}
          />

          {/* Generate Button */}
          <Button
            onClick={onGenerateItinerary}
            disabled={loadingItinerary}
            size="lg"
            className="w-full gap-2 transition-all duration-300 hover:shadow-lg"
          >
            {loadingItinerary ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Itinerary
              </>
            )}
          </Button>
        </div>
      </div>

      {/* RIGHT COLUMN: RESULTS & DETAILS */}
      <div className="lg:col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
            📊
          </div>
          <h2 className="text-xl font-bold">Trip Details & Insights</h2>
        </div>
        {children}
      </div>
    </div>
  );
}
