import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BudgetEntry {
  day: number;
  label: string;
  spent: number;
  planned: number;
}

interface BudgetForecastProps {
  totalBudget?: number;
  days?: number;
  destination?: string;
}

function generateForecast(budget: number, days: number): BudgetEntry[] {
  const daily = budget / days;
  let cumulative = 0;
  return Array.from({ length: days }, (_, i) => {
    // Realistic spending pattern: higher on day 1 (transport), dips mid-trip, spikes at end
    const factor =
      i === 0
        ? 1.9
        : i === days - 1
          ? 1.5
          : i < 3
            ? 1.2
            : i > days - 3
              ? 1.3
              : 0.7 + Math.random() * 0.4;
    const spent = Math.round(daily * factor);
    cumulative += spent;
    return {
      day: i + 1,
      label: `Day ${i + 1}`,
      spent: cumulative,
      planned: Math.round(daily * (i + 1)),
    };
  });
}

function getStatus(forecast: BudgetEntry[], budget: number) {
  const lastSpent = forecast[forecast.length - 1]?.spent ?? 0;
  const pct = (lastSpent / budget) * 100;
  if (pct > 110)
    return {
      label: "Over Budget",
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
      icon: AlertCircle,
    };
  if (pct > 90)
    return {
      label: "On Track",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/20",
      icon: TrendingUp,
    };
  return {
    label: "Under Budget",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    icon: CheckCircle2,
  };
}

export default function BudgetForecast({
  totalBudget = 2000,
  days = 7,
  destination = "your trip",
}: BudgetForecastProps) {
  const [forecast, setForecast] = useState<BudgetEntry[]>([]);

  useEffect(() => {
    setForecast(generateForecast(totalBudget, days));
  }, [totalBudget, days]);

  if (!forecast.length) return null;

  const lastEntry = forecast[forecast.length - 1];
  const projectedTotal = lastEntry.spent;
  const remaining = totalBudget - projectedTotal;
  const status = getStatus(forecast, totalBudget);
  const StatusIcon = status.icon;

  const savingTips = [
    "🏠 Book accommodation 3+ weeks ahead for up to 40% savings",
    "🍜 Eat where locals eat — avoid tourist-adjacent restaurants",
    "🚌 Use public transport instead of taxis for city travel",
    "🎟️ Buy attraction combo passes and city cards",
    "💳 Use a no-foreign-fee debit card to avoid conversion charges",
  ].slice(0, 3);

  return (
    <Card className="glass-card border-primary/20 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          <span className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" /> Budget Forecast
          </span>
          <Badge
            className={`text-xs gap-1 border ${status.bg} ${status.color}`}
          >
            <StatusIcon className="h-3 w-3" /> {status.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Numbers row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            {
              label: "Total Budget",
              value: `$${totalBudget.toLocaleString()}`,
              color: "text-foreground",
            },
            {
              label: "Projected Spend",
              value: `$${projectedTotal.toLocaleString()}`,
              color:
                projectedTotal > totalBudget
                  ? "text-red-400"
                  : "text-yellow-400",
            },
            {
              label: remaining >= 0 ? "Remaining" : "Over by",
              value: `$${Math.abs(remaining).toLocaleString()}`,
              color: remaining >= 0 ? "text-green-400" : "text-red-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-primary/15 bg-background/60 py-3 px-1"
            >
              <div className={`text-lg font-extrabold ${s.color}`}>
                {s.value}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Area Chart */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            Cumulative spend projection for{" "}
            <span className="text-foreground">{destination}</span>
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart
              data={forecast}
              margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
            >
              <defs>
                <linearGradient id="spentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="planGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--accent))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--accent))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                formatter={(v: any, name: string) => [
                  `$${Number(v).toLocaleString()}`,
                  name === "spent" ? "Projected Spent" : "Planned",
                ]}
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "11px",
                }}
              />
              <Area
                type="monotone"
                dataKey="planned"
                stroke="hsl(var(--accent))"
                strokeWidth={1.5}
                fill="url(#planGrad)"
                strokeDasharray="4 2"
                dot={false}
                name="planned"
              />
              <Area
                type="monotone"
                dataKey="spent"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#spentGrad)"
                dot={false}
                name="spent"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center mt-1">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="h-2 w-5 rounded-full bg-primary inline-block" />{" "}
              Projected
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="h-2 w-5 rounded-full bg-accent inline-block opacity-60" />{" "}
              Planned
            </span>
          </div>
        </div>

        {/* Saving Tips */}
        <div className="pt-1 border-t border-primary/10 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-green-400" /> Money-saving
            tips
          </p>
          {savingTips.map((tip, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-[11px] text-muted-foreground border border-primary/10 rounded-xl px-3 py-2 bg-background/40"
            >
              {tip}
            </motion.p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
