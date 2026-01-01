import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface PassportTrackerProps {
  expiryDate: string;
  onExpiryDateChange: (date: string) => void;
}

export default function PassportTracker({
  expiryDate,
  onExpiryDateChange,
}: PassportTrackerProps) {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [status, setStatus] = useState<"valid" | "warning" | "expired">(
    "valid",
  );

  useEffect(() => {
    if (!expiryDate) {
      setDaysRemaining(null);
      setStatus("valid");
      return;
    }

    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diff = expiry.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    setDaysRemaining(days);

    if (days < 0) {
      setStatus("expired");
    } else if (days < 180) {
      setStatus("warning");
    } else {
      setStatus("valid");
    }
  }, [expiryDate]);

  const getStatusColor = () => {
    switch (status) {
      case "expired":
        return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
      case "warning":
        return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800";
      default:
        return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case "expired":
        return "text-red-900 dark:text-red-200";
      case "warning":
        return "text-amber-900 dark:text-amber-200";
      default:
        return "text-green-900 dark:text-green-200";
    }
  };

  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Passport Expiry Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label className="text-xs">Passport Expiry Date</Label>
          <Input
            type="date"
            value={expiryDate}
            onChange={(e) => onExpiryDateChange(e.target.value)}
            className="w-full h-8 text-xs"
          />
          <p className="text-[10px] text-muted-foreground">
            Most countries require at least 6 months validity
          </p>
        </div>

        {expiryDate && daysRemaining !== null && (
          <div
            className={`rounded-lg border p-2 space-y-1.5 ${getStatusColor()}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={`text-xs font-medium ${getStatusTextColor()}`}>
                  {status === "expired"
                    ? "Passport Expired"
                    : status === "warning"
                      ? "Renew Soon"
                      : "Passport Valid"}
                </p>
                {daysRemaining >= 0 ? (
                  <p
                    className={`text-lg font-bold mt-0.5 ${getStatusTextColor()}`}
                  >
                    {daysRemaining} days
                  </p>
                ) : (
                  <p
                    className={`text-lg font-bold mt-0.5 ${getStatusTextColor()}`}
                  >
                    Expired
                  </p>
                )}
              </div>
              {status === "expired" ? (
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
              ) : status === "warning" ? (
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              )}
            </div>

            <div>
              <p className={`text-[10px] font-medium ${getStatusTextColor()}`}>
                Expiry: {new Date(expiryDate).toLocaleDateString()}
              </p>
              {status === "warning" && daysRemaining !== null && (
                <p className="text-[9px] mt-0.5 opacity-75">
                  {daysRemaining < 180 && daysRemaining >= 0
                    ? `Expires in ${daysRemaining} days. Renew soon.`
                    : "Approaching expiration."}
                </p>
              )}
              {status === "expired" && (
                <p className="text-[9px] mt-0.5 opacity-75">
                  Expired. Renew before travel.
                </p>
              )}
            </div>

            {status !== "valid" && (
              <div className="pt-1 border-t border-current border-opacity-20">
                <p className="text-[9px] font-medium opacity-75">
                  {status === "expired"
                    ? "🚨 Contact passport office"
                    : "⏱️ Plan renewal soon"}
                </p>
              </div>
            )}
          </div>
        )}

        {!expiryDate && (
          <div className="rounded-lg bg-muted/50 p-2 text-center text-xs text-muted-foreground">
            Enter expiry date to track validity
          </div>
        )}
      </CardContent>
    </Card>
  );
}
