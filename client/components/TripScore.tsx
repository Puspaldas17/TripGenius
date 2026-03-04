import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Star,
  RefreshCw,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Camera,
} from "lucide-react";

interface TripScoreProps {
  destination?: string;
  days?: number;
  budget?: number;
  members?: number;
  mood?: string;
}

interface ScoreDimension {
  key: string;
  label: string;
  icon: React.ElementType;
  score: number;
  color: string;
  tip: string;
}

function computeScores(props: TripScoreProps): ScoreDimension[] {
  const { days = 7, budget = 2000, members = 2, mood = "adventure" } = props;

  const per = budget / Math.max(days, 1);
  const balanceScore = Math.min(
    100,
    days >= 3 && days <= 14 ? 90 : days > 14 ? 70 : 60,
  );
  const budgetScore = Math.min(
    100,
    per >= 80 && per <= 500 ? 92 : per < 80 ? 55 : 85,
  );
  const socialScore =
    members === 2
      ? 95
      : members >= 3 && members <= 5
        ? 88
        : members > 5
          ? 75
          : 70;
  const adventureScore = ["adventure", "explore"].some((k) =>
    mood?.toLowerCase().includes(k),
  )
    ? 96
    : ["relax", "beach"].some((k) => mood?.toLowerCase().includes(k))
      ? 84
      : 80;
  const cultureScore = ["culture", "history", "art"].some((k) =>
    mood?.toLowerCase().includes(k),
  )
    ? 97
    : 78;

  return [
    {
      key: "balance",
      label: "Day Balance",
      icon: Clock,
      score: balanceScore,
      color: "from-violet-500 to-indigo-500",
      tip:
        days < 5
          ? "Consider a longer trip for deeper experiences."
          : "Great trip length for a balanced experience!",
    },
    {
      key: "budget",
      label: "Budget Score",
      icon: DollarSign,
      score: budgetScore,
      color: "from-emerald-500 to-teal-500",
      tip:
        per < 80
          ? "Budget is tight — consider increasing for comfort."
          : "Solid budget allocation per day!",
    },
    {
      key: "social",
      label: "Group Fit",
      icon: Users,
      score: socialScore,
      color: "from-pink-500 to-rose-500",
      tip:
        members > 5
          ? "Large groups need extra coordination — assign roles!"
          : "Great group size for this trip.",
    },
    {
      key: "adventure",
      label: "Adventure Mix",
      icon: TrendingUp,
      score: adventureScore,
      color: "from-amber-500 to-orange-500",
      tip: "AI tip: Mix 60% planned activities with 40% spontaneous exploration.",
    },
    {
      key: "culture",
      label: "Culture Depth",
      icon: Camera,
      score: cultureScore,
      color: "from-cyan-500 to-blue-500",
      tip: "Visit local markets, try street food, skip at least one tourist trap.",
    },
  ];
}

function getGrade(avg: number) {
  if (avg >= 90)
    return { grade: "S", label: "Perfect Trip", color: "text-yellow-400" };
  if (avg >= 80)
    return { grade: "A", label: "Excellent", color: "text-green-400" };
  if (avg >= 70)
    return { grade: "B", label: "Good Trip", color: "text-blue-400" };
  if (avg >= 60) return { grade: "C", label: "Fair", color: "text-orange-400" };
  return { grade: "D", label: "Needs Work", color: "text-red-400" };
}

export default function TripScore({
  destination = "Your Destination",
  days,
  budget,
  members,
  mood,
}: TripScoreProps) {
  const [revealed, setRevealed] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const scores = computeScores({ days, budget, members, mood });
  const avg = Math.round(
    scores.reduce((s, d) => s + d.score, 0) / scores.length,
  );
  const { grade, label, color } = getGrade(avg);

  const handleReveal = () => {
    setRevealed(true);
    setAnimKey((k) => k + 1);
  };

  return (
    <Card className="glass-card border-primary/20 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary animate-shimmer" />
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          <span className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            AI Trip Score
          </span>
          {revealed && (
            <button
              onClick={() => {
                setRevealed(false);
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Reset
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!revealed ? (
          <div className="text-center py-6 space-y-4">
            <div className="text-5xl">🎯</div>
            <div>
              <p className="font-semibold text-foreground">
                Ready to score your trip?
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                AI analyzes balance, budget, social fit, adventure & culture
                depth
              </p>
            </div>
            <Button
              onClick={handleReveal}
              className="gap-2 bg-gradient-to-r from-primary to-accent border-0 text-white font-bold shadow-lg hover:scale-105 transition-transform"
            >
              <Sparkles className="h-4 w-4 animate-pulse" /> Analyze My Trip
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              key={animKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              {/* Overall Grade */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="flex flex-col items-center gap-1 py-4"
              >
                <div
                  className={`text-7xl font-black ${color}`}
                  style={{ textShadow: "0 0 30px currentColor" }}
                >
                  {grade}
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs px-3 py-1">
                  {label}
                </Badge>
                <p className="text-muted-foreground text-xs mt-1">
                  {avg}/100 overall score for{" "}
                  <span className="font-semibold text-foreground">
                    {destination}
                  </span>
                </p>
              </motion.div>

              {/* Dimension bars */}
              <div className="space-y-3">
                {scores.map((dim, i) => (
                  <motion.div
                    key={dim.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-foreground">
                        <dim.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        {dim.label}
                      </span>
                      <span
                        className={`font-bold ${dim.score >= 85 ? "text-green-400" : dim.score >= 70 ? "text-yellow-400" : "text-red-400"}`}
                      >
                        {dim.score}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dim.score}%` }}
                        transition={{
                          delay: 0.2 + i * 0.1,
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                        className={`h-full rounded-full bg-gradient-to-r ${dim.color}`}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {dim.tip}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
}
