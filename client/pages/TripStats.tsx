import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Globe2,
  Plane,
  CalendarDays,
  DollarSign,
  Trophy,
  TrendingUp,
  MapPin,
  Clock,
  BarChart3,
  Star,
} from "lucide-react";

interface SavedTrip {
  destination?: string;
  origin?: string;
  days?: number;
  budget?: number;
  mood?: string;
  createdAt?: number;
  members?: number;
}

const MOOD_COLORS: Record<string, string> = {
  adventure: "#f59e0b",
  relaxation: "#22c55e",
  culture: "#8b5cf6",
  food: "#ef4444",
  business: "#3b82f6",
  romantic: "#ec4899",
  family: "#0ea5e9",
  budget: "#84cc16",
};

const MOOD_LABELS: Record<string, string> = {
  adventure: "🏔️ Adventure",
  relaxation: "🏖️ Relaxation",
  culture: "🏛️ Culture",
  food: "🍜 Foodie",
  business: "💼 Business",
  romantic: "💑 Romantic",
  family: "👨‍👩‍👧 Family",
  budget: "💰 Budget",
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

const SAMPLE_TRIPS: SavedTrip[] = [
  {
    destination: "Paris, France",
    origin: "New Delhi",
    days: 7,
    budget: 120000,
    mood: "culture",
    createdAt: Date.now() - 86400000 * 60,
    members: 2,
  },
  {
    destination: "Bali, Indonesia",
    origin: "Mumbai",
    days: 10,
    budget: 80000,
    mood: "relaxation",
    createdAt: Date.now() - 86400000 * 30,
    members: 4,
  },
  {
    destination: "Tokyo, Japan",
    origin: "Kolkata",
    days: 14,
    budget: 200000,
    mood: "adventure",
    createdAt: Date.now() - 86400000 * 14,
    members: 1,
  },
];

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function TripStats() {
  const rawTrips: SavedTrip[] = getStorage("tg_saved_plans", SAMPLE_TRIPS);
  const trips = rawTrips.length ? rawTrips : SAMPLE_TRIPS;

  const stats = useMemo(() => {
    const totalTrips = trips.length;
    const totalDays = trips.reduce((s, t) => s + (t.days ?? 0), 0);
    const totalBudget = trips.reduce((s, t) => s + (t.budget ?? 0), 0);
    const avgBudget = totalTrips ? Math.round(totalBudget / totalTrips) : 0;
    const longestTrip = trips.reduce(
      (best, t) => (!best || (t.days ?? 0) > (best.days ?? 0) ? t : best),
      trips[0],
    );
    const countries = new Set(
      trips.map((t) => t.destination?.split(",")[1]?.trim() ?? "Unknown"),
    ).size;

    // Trips by month
    const byMonth: Record<number, number> = {};
    trips.forEach((t) => {
      const m = t.createdAt ? new Date(t.createdAt).getMonth() : 0;
      byMonth[m] = (byMonth[m] ?? 0) + 1;
    });
    const monthData = MONTH_NAMES.map((name, i) => ({
      name,
      trips: byMonth[i] ?? 0,
    }));

    // Budget per trip
    const budgetData = trips.slice(-8).map((t) => ({
      name: t.destination?.split(",")[0] ?? "Trip",
      budget: Math.round((t.budget ?? 0) / 1000),
    }));

    // Mood distribution
    const moodCount: Record<string, number> = {};
    trips.forEach((t) => {
      if (t.mood) moodCount[t.mood] = (moodCount[t.mood] ?? 0) + 1;
    });
    const moodData = Object.entries(moodCount).map(([mood, count]) => ({
      name: MOOD_LABELS[mood] ?? mood,
      value: count,
      color: MOOD_COLORS[mood] ?? "#6b7280",
    }));

    // Members distribution
    const avgMembers =
      trips.reduce((s, t) => s + (t.members ?? 1), 0) / totalTrips;

    return {
      totalTrips,
      totalDays,
      totalBudget,
      avgBudget,
      longestTrip,
      countries,
      monthData,
      budgetData,
      moodData,
      avgMembers,
    };
  }, [trips]);

  const statCards = [
    {
      label: "Total Trips",
      value: stats.totalTrips,
      suffix: "",
      icon: Plane,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Countries",
      value: stats.countries,
      suffix: "+",
      icon: Globe2,
      color: "from-violet-500 to-purple-600",
    },
    {
      label: "Days Traveled",
      value: stats.totalDays,
      suffix: "",
      icon: CalendarDays,
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Total Budget",
      value: `₹${(stats.totalBudget / 1000).toFixed(0)}K`,
      suffix: "",
      icon: DollarSign,
      color: "from-emerald-500 to-teal-500",
      raw: true,
    },
    {
      label: "Avg per Trip",
      value: `₹${(stats.avgBudget / 1000).toFixed(0)}K`,
      suffix: "",
      icon: TrendingUp,
      color: "from-pink-500 to-rose-500",
      raw: true,
    },
    {
      label: "Avg Group Size",
      value: stats.avgMembers.toFixed(1),
      suffix: "x",
      icon: Star,
      color: "from-indigo-500 to-blue-600",
      raw: true,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass-card border border-primary/20 px-3 py-2 rounded-xl text-xs">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color ?? "#06b6d4" }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-primary">
            <BarChart3 className="h-4 w-4" />
            Travel Analytics
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Your Travel{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Story in Numbers
            </span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Insights and analytics across all your planned trips — budget
            trends, favourite moods, and lifetime stats.
          </p>
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Card className="glass-card border-primary/20">
                  <CardContent className="p-4 text-center space-y-2">
                    <div
                      className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto shadow-md`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-2xl font-extrabold">
                      {s.raw ? s.value : s.value}
                      {s.raw ? "" : s.suffix}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {s.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Longest Trip Highlight */}
        {stats.longestTrip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card border-amber-500/20 bg-amber-500/5">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                    🏆 Longest Trip
                  </div>
                  <div className="text-lg font-extrabold mt-0.5">
                    {stats.longestTrip.destination ?? "Unknown"}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {stats.longestTrip.days} days
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />₹
                      {((stats.longestTrip.budget ?? 0) / 1000).toFixed(0)}K
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {stats.longestTrip.origin}
                    </span>
                    {stats.longestTrip.mood && (
                      <Badge className="text-[10px] border border-amber-500/30 bg-amber-500/10 text-amber-400">
                        {MOOD_LABELS[stats.longestTrip.mood] ??
                          stats.longestTrip.mood}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trips by Month */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="glass-card border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Trips Planned by Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={stats.monthData}
                    margin={{ top: 5, right: 10, bottom: 5, left: -20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--primary) / 0.1)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                    />
                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="trips"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Budget per Trip */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  Budget per Trip (₹K)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={stats.budgetData}
                    margin={{ top: 5, right: 10, bottom: 5, left: -20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--primary) / 0.1)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 10,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                    />
                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="budget"
                      name="Budget (₹K)"
                      radius={[6, 6, 0, 0]}
                    >
                      {stats.budgetData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={`hsla(${180 + i * 20}, 70%, ${50 + i * 3}%, 0.85)`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mood Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="glass-card border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Star className="h-4 w-4 text-amber-400" />
                  Travel Style Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.moodData.length > 0 ? (
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie
                          data={stats.moodData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {stats.moodData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-1.5">
                      {stats.moodData.map((m) => (
                        <div key={m.name} className="flex items-center gap-2">
                          <div
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ background: m.color }}
                          />
                          <span className="text-xs text-muted-foreground flex-1">
                            {m.name}
                          </span>
                          <span className="text-xs font-bold">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Plan more trips to see your travel style breakdown.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Trips List */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Plane className="h-4 w-4 text-blue-400" />
                  Recent Trips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {[...trips]
                    .reverse()
                    .slice(0, 8)
                    .map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl border border-primary/10 bg-background/40 px-3 py-2.5"
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-sm">
                          ✈️
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">
                            {t.destination ?? "Unknown"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t.days ?? 0} days • ₹
                            {((t.budget ?? 0) / 1000).toFixed(0)}K
                          </div>
                        </div>
                        {t.mood && (
                          <Badge
                            className="text-[10px] shrink-0"
                            style={{
                              background: `${MOOD_COLORS[t.mood] ?? "#6b7280"}20`,
                              color: MOOD_COLORS[t.mood] ?? "#6b7280",
                              borderColor: `${MOOD_COLORS[t.mood] ?? "#6b7280"}40`,
                            }}
                          >
                            {t.mood}
                          </Badge>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
