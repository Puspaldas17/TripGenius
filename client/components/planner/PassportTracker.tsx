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
            className={`rounded-lg border p-4 space-y-3 ${getStatusColor()}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={`text-sm font-medium ${getStatusTextColor()}`}>
                  {status === "expired"
                    ? "Passport Expired"
                    : status === "warning"
                      ? "Renew Soon"
                      : "Passport Valid"}
                </p>
                {daysRemaining >= 0 ? (
                  <p
                    className={`text-2xl font-bold mt-1 ${getStatusTextColor()}`}
                  >
                    {daysRemaining} days
                  </p>
                ) : (
                  <p
                    className={`text-2xl font-bold mt-1 ${getStatusTextColor()}`}
                  >
                    Expired
                  </p>
                )}
              </div>
              {status === "expired" ? (
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400 flex-shrink-0" />
              ) : status === "warning" ? (
                <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              ) : (
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
              )}
            </div>

            <div>
              <p className={`text-xs font-medium ${getStatusTextColor()}`}>
                Expiry Date: {new Date(expiryDate).toLocaleDateString()}
              </p>
              {status === "warning" && daysRemaining !== null && (
                <p className="text-xs mt-2 opacity-75">
                  {daysRemaining < 180 && daysRemaining >= 0
                    ? `Your passport expires in ${daysRemaining} days. Consider renewing before travel.`
                    : "Your passport is approaching expiration."}
                </p>
              )}
              {status === "expired" && (
                <p className="text-xs mt-2 opacity-75">
                  Your passport has expired. You must renew it before
                  international travel.
                </p>
              )}
            </div>

            {status !== "valid" && (
              <div className="pt-2 border-t border-current border-opacity-20">
                <p className="text-xs font-medium opacity-75">
                  {status === "expired"
                    ? "🚨 Contact your passport office immediately"
                    : "⏱️ Plan your passport renewal soon"}
                </p>
              </div>
            )}
          </div>
        )}

        {!expiryDate && (
          <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
            Enter your passport expiry date to track validity
          </div>
        )}
      </CardContent>
    </Card>
  );
}
