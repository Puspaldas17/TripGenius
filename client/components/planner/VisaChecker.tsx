import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface VisaRequirement {
  country: string;
  code: string;
  visaRequired: boolean;
  visaType: string;
  processingDays: number;
  cost: number;
  currency: string;
  documents: string[];
}

// Visa database for common countries
const VISA_DATABASE: { [key: string]: VisaRequirement } = {
  "United States": {
    country: "United States",
    code: "US",
    visaRequired: true,
    visaType: "B1/B2 (Tourist)",
    processingDays: 7,
    cost: 160,
    currency: "USD",
    documents: [
      "Valid Passport",
      "DS-160 Form",
      "Photo",
      "Proof of Funds",
      "Travel Itinerary",
    ],
  },
  "United Kingdom": {
    country: "United Kingdom",
    code: "GB",
    visaRequired: true,
    visaType: "Standard Visitor",
    processingDays: 3,
    cost: 100,
    currency: "GBP",
    documents: ["Valid Passport", "Proof of Funds", "Travel Itinerary"],
  },
  France: {
    country: "France",
    code: "FR",
    visaRequired: true,
    visaType: "Schengen",
    processingDays: 15,
    cost: 80,
    currency: "EUR",
    documents: [
      "Valid Passport",
      "Proof of Funds",
      "Accommodation Proof",
      "Travel Insurance",
    ],
  },
  Canada: {
    country: "Canada",
    code: "CA",
    visaRequired: true,
    visaType: "eTA/Visitor Visa",
    processingDays: 5,
    cost: 100,
    currency: "CAD",
    documents: ["Valid Passport", "Proof of Funds", "Return Ticket"],
  },
  Japan: {
    country: "Japan",
    code: "JP",
    visaRequired: false,
    visaType: "Visa Exemption (up to 90 days)",
    processingDays: 0,
    cost: 0,
    currency: "JPY",
    documents: ["Valid Passport"],
  },
  Thailand: {
    country: "Thailand",
    code: "TH",
    visaRequired: false,
    visaType: "Visa on Arrival",
    processingDays: 0,
    cost: 0,
    currency: "THB",
    documents: ["Valid Passport"],
  },
  India: {
    country: "India",
    code: "IN",
    visaRequired: false,
    visaType: "Domestic Travel",
    processingDays: 0,
    cost: 0,
    currency: "INR",
    documents: ["ID Proof"],
  },
};

interface VisaCheckerProps {
  destination: string;
  nationality: string;
  onNationalityChange: (nationality: string) => void;
}

export default function VisaChecker({
  destination,
  nationality,
  onNationalityChange,
}: VisaCheckerProps) {
  const [visaInfo, setVisaInfo] = useState<VisaRequirement | null>(null);

  useEffect(() => {
    // Extract country from destination (e.g., "New Delhi, India" -> "India")
    const destinationCountry = destination.split(",").pop()?.trim() || "";
    if (destinationCountry && VISA_DATABASE[destinationCountry]) {
      setVisaInfo(VISA_DATABASE[destinationCountry]);
    }
  }, [destination]);

  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          Visa & Documentation Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Your Nationality</Label>
          <Input
            value={nationality}
            onChange={(e) => onNationalityChange(e.target.value)}
            placeholder="e.g., India, USA, UK"
          />
        </div>

        {visaInfo && (
          <div className="space-y-3 rounded-lg bg-muted/50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{visaInfo.country}</h3>
                <Badge
                  variant={visaInfo.visaRequired ? "destructive" : "default"}
                  className="mt-2"
                >
                  {visaInfo.visaRequired ? "Visa Required" : "Visa Not Required"}
                </Badge>
              </div>
              {visaInfo.visaRequired ? (
                <AlertCircle className="h-5 w-5 text-destructive" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Visa Type</p>
              <p className="font-medium">{visaInfo.visaType}</p>
            </div>

            {visaInfo.processingDays > 0 && (
              <div className="flex items-center gap-2 rounded-md bg-amber-50 p-2 dark:bg-amber-950/30">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-xs font-medium text-amber-900 dark:text-amber-200">
                    Processing Time: {visaInfo.processingDays} days
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Cost: {visaInfo.currency} {visaInfo.cost}
                  </p>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-2">Required Documents</p>
              <ul className="space-y-1">
                {visaInfo.documents.map((doc, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {visaInfo.visaRequired && (
              <Button className="w-full" size="sm" variant="outline">
                Apply for Visa
              </Button>
            )}
          </div>
        )}

        {!visaInfo && destination && (
          <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
            Visa information for {destination} not available. Please check with
            your embassy.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
