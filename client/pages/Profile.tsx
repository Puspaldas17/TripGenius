import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  LogOut,
  Calendar,
  DollarSign,
  Users,
  Plus,
  Edit2,
  Trophy,
  Star,
  MapPin,
  Globe,
  Zap,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  members: number;
  status: "planned" | "ongoing" | "completed";
  thumbnail?: string;
}

const BADGES = [
  {
    id: "first_trip",
    label: "First Adventure",
    icon: "🧭",
    desc: "Planned your first trip",
    condition: (trips: Trip[]) => trips.length >= 1,
  },
  {
    id: "globetrotter",
    label: "Globetrotter",
    icon: "🌍",
    desc: "Planned 5+ trips",
    condition: (trips: Trip[]) => trips.length >= 5,
  },
  {
    id: "budget_master",
    label: "Budget Master",
    icon: "💰",
    desc: "Total budget over $5,000",
    condition: (trips: Trip[]) =>
      trips.reduce((s, t) => s + t.budget, 0) >= 5000,
  },
  {
    id: "group_leader",
    label: "Group Leader",
    icon: "👥",
    desc: "Planned a group trip",
    condition: (trips: Trip[]) => trips.some((t) => t.members > 2),
  },
  {
    id: "explorer",
    label: "World Explorer",
    icon: "🗺️",
    desc: "Visited 3+ destinations",
    condition: (trips: Trip[]) =>
      trips.filter((t) => t.status === "completed").length >= 3,
  },
  {
    id: "power_user",
    label: "Power Planner",
    icon: "⚡",
    desc: "10+ trips planned",
    condition: (trips: Trip[]) => trips.length >= 10,
  },
];

const SPEND_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "#22d3ee",
  "#f59e0b",
  "#ec4899",
  "#a78bfa",
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"trips" | "badges" | "stats">(
    "trips",
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tg_saved_trips");
      const saved = raw ? JSON.parse(raw) : [];
      if (saved.length) {
        setTrips(saved);
      } else {
        // Demo trips for non-empty state
        setTrips([
          {
            id: "1",
            destination: "Paris, France",
            startDate: "2024-06-15",
            endDate: "2024-06-25",
            budget: 4500,
            members: 2,
            status: "planned",
            thumbnail:
              "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg",
          },
          {
            id: "2",
            destination: "Tokyo, Japan",
            startDate: "2024-05-01",
            endDate: "2024-05-14",
            budget: 3500,
            members: 3,
            status: "completed",
            thumbnail:
              "https://images.pexels.com/photos/2738126/pexels-photo-2738126.jpeg",
          },
        ]);
      }
    } catch {
      setTrips([]);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const totalDays = trips.reduce((sum, t) => {
    const d = Math.max(
      0,
      Math.ceil(
        (new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) /
          86400000,
      ),
    );
    return sum + d;
  }, 0);

  const stats = {
    totalTrips: trips.length,
    totalBudget: trips.reduce((s, t) => s + t.budget, 0),
    completed: trips.filter((t) => t.status === "completed").length,
    totalDays,
    avgBudget: trips.length
      ? Math.round(trips.reduce((s, t) => s + t.budget, 0) / trips.length)
      : 0,
  };

  const earnedBadges = BADGES.filter((b) => b.condition(trips));

  const spendData = [
    { name: "Accommodation", value: Math.round(stats.totalBudget * 0.4) },
    { name: "Flights", value: Math.round(stats.totalBudget * 0.25) },
    { name: "Food", value: Math.round(stats.totalBudget * 0.2) },
    { name: "Activities", value: Math.round(stats.totalBudget * 0.1) },
    { name: "Other", value: Math.round(stats.totalBudget * 0.05) },
  ];

  const barData = trips.slice(0, 5).map((t) => ({
    name: t.destination.split(",")[0],
    budget: t.budget,
  }));

  const TABS = [
    { id: "trips", label: "My Trips", icon: Globe },
    { id: "badges", label: `Badges (${earnedBadges.length})`, icon: Trophy },
    { id: "stats", label: "Analytics", icon: TrendingUp },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl glass-card border border-primary/20 p-6 shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-primary/30">
                  {user?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                {earnedBadges.length >= 3 && (
                  <div
                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-yellow-400 border-2 border-background flex items-center justify-center shadow-md"
                    title="Experienced Traveler"
                  >
                    <Star className="h-4 w-4 text-yellow-900 fill-yellow-900" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight gradient-text">
                  {user?.name}
                </h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className="text-xs gap-1 bg-primary/10 text-primary border border-primary/20"
                  >
                    <Zap className="h-3 w-3" /> {stats.totalTrips} trips planned
                  </Badge>
                  {earnedBadges.slice(0, 2).map((b) => (
                    <Badge
                      key={b.id}
                      variant="outline"
                      className="text-xs gap-1 border-accent/30 text-accent"
                    >
                      {b.icon} {b.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-primary/20 hover:bg-primary/10"
              >
                <Edit2 className="h-4 w-4" /> Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-500 border-red-500/20 hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Total Trips",
              value: stats.totalTrips,
              icon: "🗺️",
              color: "from-violet-500/10 to-indigo-500/10",
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: "✅",
              color: "from-emerald-500/10 to-teal-500/10",
            },
            {
              label: "Total Budget",
              value: `$${stats.totalBudget.toLocaleString()}`,
              icon: "💰",
              color: "from-amber-500/10 to-orange-500/10",
            },
            {
              label: "Days Traveled",
              value: totalDays,
              icon: "📅",
              color: "from-pink-500/10 to-rose-500/10",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card
                className={`glass-card border-primary/20 bg-gradient-to-br ${s.color} hover-glow group cursor-default`}
              >
                <CardContent className="pt-5 text-center">
                  <div className="text-3xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-extrabold text-foreground tracking-tight">
                    {s.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {s.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 rounded-2xl glass-card border border-primary/20 p-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimateTabContent
          activeTab={activeTab}
          trips={trips}
          loading={loading}
          spendData={spendData}
          barData={barData}
          navigate={navigate}
          stats={stats}
          earnedBadges={earnedBadges}
        />
      </div>
    </div>
  );
}

function AnimateTabContent({
  activeTab,
  trips,
  loading,
  spendData,
  barData,
  navigate,
  stats,
  earnedBadges,
}: any) {
  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {activeTab === "trips" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">My Trips</h2>
            <Button
              className="gap-2 bg-gradient-to-r from-primary to-accent border-0 text-white"
              onClick={() => navigate("/planner")}
            >
              <Plus className="h-4 w-4" /> New Trip
            </Button>
          </div>
          {loading ? (
            <p className="text-muted-foreground text-center py-10">Loading…</p>
          ) : trips.length === 0 ? (
            <Card className="glass-card border-primary/20">
              <CardContent className="text-center py-16">
                <div className="text-5xl mb-4">✈️</div>
                <p className="text-muted-foreground mb-4">
                  No trips yet. Plan your first adventure!
                </p>
                <Button onClick={() => navigate("/planner")}>
                  Create your first trip
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {trips.map((trip: Trip) => (
                <TripCard key={trip.id} trip={trip} navigate={navigate} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "badges" && (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Achievement Badges</h2>
            <p className="text-sm text-muted-foreground">
              {earnedBadges.length} of {BADGES.length} earned
            </p>
          </div>
          <div className="mb-6 h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
              style={{
                width: `${(earnedBadges.length / BADGES.length) * 100}%`,
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {BADGES.map((badge) => {
              const earned = earnedBadges.some((b: any) => b.id === badge.id);
              return (
                <motion.div key={badge.id} whileHover={{ scale: 1.03 }}>
                  <Card
                    className={`glass-card text-center cursor-default transition-all duration-300 ${earned ? "border-accent/40 shadow-[0_0_20px_rgba(255,100,200,0.15)]" : "border-primary/10 opacity-50 grayscale"}`}
                  >
                    <CardContent className="pt-6 pb-4">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <div className="font-bold text-sm">{badge.label}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">
                        {badge.desc}
                      </div>
                      {earned && (
                        <Badge className="mt-2 bg-accent/20 text-accent border-accent/30 text-[10px]">
                          Earned ✓
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "stats" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-base font-bold">
                Budget Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.totalBudget > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={spendData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {spendData.map((_: any, i: number) => (
                          <Cell
                            key={i}
                            fill={SPEND_COLORS[i % SPEND_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: any) => `$${v.toLocaleString()}`}
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {spendData.map((d: any, i: number) => (
                      <div
                        key={d.name}
                        className="flex items-center gap-2 text-xs"
                      >
                        <div
                          className="h-3 w-3 rounded-full flex-shrink-0"
                          style={{ background: SPEND_COLORS[i] }}
                        />
                        <span className="text-muted-foreground">{d.name}</span>
                        <span className="font-bold ml-auto">
                          ${d.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-10 text-sm">
                  No budget data yet. Plan a trip to see analytics!
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-base font-bold">
                Budget by Trip
              </CardTitle>
            </CardHeader>
            <CardContent>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={barData}
                    margin={{ top: 5, right: 5, bottom: 30, left: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      angle={-35}
                      textAnchor="end"
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `$${v / 1000}k`}
                    />
                    <Tooltip
                      formatter={(v: any) => `$${v.toLocaleString()}`}
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="budget" radius={[6, 6, 0, 0]}>
                      {barData.map((_: any, i: number) => (
                        <Cell
                          key={i}
                          fill={SPEND_COLORS[i % SPEND_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-10 text-sm">
                  Plan some trips to see your budget chart!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
}

function TripCard({ trip, navigate }: { trip: Trip; navigate: any }) {
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const days = Math.max(
    0,
    Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000),
  );

  const statusColor = {
    completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    ongoing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    planned: "bg-primary/20 text-primary border-primary/30",
  }[trip.status];

  return (
    <motion.div whileHover={{ scale: 1.01 }}>
      <Card className="overflow-hidden glass-card border border-primary/20 hover-glow cursor-pointer group">
        {trip.thumbnail && (
          <div className="h-40 overflow-hidden relative">
            <img
              src={trip.thumbnail}
              alt={trip.destination}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-3 text-white font-bold text-sm flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary" /> {trip.destination}
            </div>
          </div>
        )}
        <CardContent className="p-4 space-y-3">
          {!trip.thumbnail && (
            <h3 className="font-bold text-base flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" /> {trip.destination}
            </h3>
          )}
          <div className="flex items-center justify-between">
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${statusColor}`}
            >
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </span>
            <span className="text-xs text-muted-foreground">{days} days</span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />{" "}
              {startDate.toLocaleDateString()} → {endDate.toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" /> $
              {trip.budget.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> {trip.members}{" "}
              {trip.members === 1 ? "person" : "people"}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-primary/20 hover:bg-primary/10 mt-1"
            onClick={() => navigate("/planner", { state: { tripId: trip.id } })}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const BADGES_EXPORT = BADGES;
export { BADGES_EXPORT as BADGES };
