import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin as _MapPin,
  Calendar,
  DollarSign,
  Users,
  Plane,
  ArrowLeft,
  Download,
  Share2,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface SharedTripData {
  destination: string;
  origin: string;
  startDate: string;
  endDate: string;
  days: number;
  budget: number;
  members: number;
  mood: string;
  itinerary: any;
  sharedAt: string;
  ownerName?: string;
}

export default function SharedTrip() {
  const { token } = useParams<{ token: string }>();
  const [trip, setTrip] = useState<SharedTripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    try {
      const raw = localStorage.getItem(`tg_share_${token}`);
      if (!raw) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setTrip(JSON.parse(raw));
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  }, [token]);

  const handlePrint = () => {
    window.print();
    toast.success("Opening print dialog…");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Share link copied!");
    } catch {
      // Clipboard blocked (HTTP context) — show prompt fallback
      prompt("Copy this link:", window.location.href);
      toast.success("Link shown — copy it from the dialog.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="text-6xl">🔍</div>
        <h1 className="text-3xl font-extrabold">Trip not found</h1>
        <p className="text-muted-foreground max-w-sm">
          This shared link may have expired or is invalid. Ask the trip owner to
          share it again.
        </p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to TripGenius
          </Link>
        </Button>
      </div>
    );
  }

  const days = trip.itinerary?.days ?? [];
  const startDate = new Date(trip.startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const endDate = new Date(trip.endDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { font-size: 12px; }
        }
      `}</style>

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-background py-16 px-4 text-center print:py-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.15)_0%,transparent_70%)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-3xl mx-auto"
        >
          <Badge
            variant="outline"
            className="mb-4 border-primary/30 bg-primary/10 text-primary gap-1.5 px-4 py-1.5 rounded-full"
          >
            <Share2 className="h-3.5 w-3.5" /> Shared Itinerary
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight gradient-text mb-2">
            {trip.destination}
          </h1>
          {trip.ownerName && (
            <p className="text-muted-foreground text-sm mt-2">
              Shared by{" "}
              <span className="font-semibold text-foreground">
                {trip.ownerName}
              </span>
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              {startDate} → {endDate}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4 text-accent" />
              {trip.days} days
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="h-4 w-4 text-green-400" />$
              {trip.budget.toLocaleString()} budget
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4 text-pink-400" />
              {trip.members} {trip.members === 1 ? "person" : "people"}
            </span>
          </div>
          <div className="flex justify-center gap-3 mt-6 no-print">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="gap-2 border-primary/30 hover:bg-primary/10"
            >
              <Share2 className="h-4 w-4" /> Copy Link
            </Button>
            <Button
              onClick={handlePrint}
              className="gap-2 bg-gradient-to-r from-primary to-accent border-0 text-white"
            >
              <Download className="h-4 w-4" /> Download PDF
            </Button>
            <Button asChild variant="ghost" className="gap-2 no-print">
              <Link to="/planner">
                <Plane className="h-4 w-4" /> Plan My Own
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Itinerary Days */}
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {days.length === 0 && (
          <Card className="glass-card border-primary/20 text-center py-16">
            <CardContent>
              <p className="text-muted-foreground">
                No itinerary details were shared for this trip.
              </p>
            </CardContent>
          </Card>
        )}

        {days.map((day: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-extrabold shadow-md shrink-0">
                {i + 1}
              </div>
              <div>
                <h2 className="text-lg font-bold">Day {i + 1}</h2>
                {day.date && (
                  <p className="text-xs text-muted-foreground">{day.date}</p>
                )}
              </div>
            </div>
            <div className="ml-5 border-l-2 border-primary/20 pl-5 space-y-3">
              {(day.activities ?? []).map((act: any, j: number) => (
                <div
                  key={j}
                  className="relative flex items-start gap-3 glass-card border border-primary/10 rounded-xl p-4"
                >
                  <div className="absolute -left-[22px] top-4 h-3 w-3 rounded-full bg-primary border-2 border-background shadow-sm" />
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">
                      {act.title ?? act.time ?? act}
                    </p>
                    {act.desc && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {act.desc}
                      </p>
                    )}
                    {act.time && act.title && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {act.time}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Footer CTA */}
        <div className="no-print text-center py-8 border-t border-primary/10">
          <p className="text-muted-foreground mb-4">
            Want to plan your own trip?
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-accent border-0 text-white font-bold shadow-lg gap-2"
          >
            <Link to="/planner">
              <Plane className="h-5 w-5" /> Plan with TripGenius
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
