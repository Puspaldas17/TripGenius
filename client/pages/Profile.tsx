import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  LogOut,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Plus,
  Edit2,
} from "lucide-react";
import { toast } from "sonner";

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

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock trip data - in production, fetch from API
    const mockTrips: Trip[] = [
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
    ];
    
    setTrips(mockTrips);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const stats = {
    totalTrips: trips.length,
    totalBudget: trips.reduce((sum, t) => sum + t.budget, 0),
    destinationsVisited: trips.filter((t) => t.status === "completed").length,
    totalDays: trips.reduce((sum, t) => {
      const start = new Date(t.startDate);
      const end = new Date(t.endDate);
      return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* User Header */}
        <div className="mb-8 flex items-start justify-between rounded-lg border p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Member since{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {stats.totalTrips}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Total Trips
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {stats.destinationsVisited}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Destinations Visited
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  ${stats.totalBudget.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Total Budget
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {stats.totalDays}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Days Traveled
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trips Section */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">My Trips</h2>
              <p className="text-muted-foreground">
                Manage and view all your travel plans
              </p>
            </div>
            <Button className="gap-2" onClick={() => navigate("/planner")}>
              <Plus className="h-4 w-4" />
              New Trip
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading trips...</p>
            </div>
          ) : trips.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">No trips yet</p>
                <Button onClick={() => navigate("/planner")}>
                  Create your first trip
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {trips.map((trip) => {
                const startDate = new Date(trip.startDate);
                const endDate = new Date(trip.endDate);
                const days = Math.ceil(
                  (endDate.getTime() - startDate.getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                return (
                  <Card
                    key={trip.id}
                    className="overflow-hidden hover:shadow-lg transition cursor-pointer"
                  >
                    {trip.thumbnail && (
                      <div className="h-40 overflow-hidden bg-muted">
                        <img
                          src={trip.thumbnail}
                          alt={trip.destination}
                          className="h-full w-full object-cover hover:scale-105 transition"
                        />
                      </div>
                    )}
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">
                            {trip.destination}
                          </h3>
                          <Badge
                            variant={
                              trip.status === "completed"
                                ? "default"
                                : trip.status === "ongoing"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {trip.status.charAt(0).toUpperCase() +
                              trip.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {startDate.toLocaleDateString()} →{" "}
                          {endDate.toLocaleDateString()} ({days} days)
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          Budget: ${trip.budget.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {trip.members} {trip.members === 1 ? "person" : "people"}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            navigate("/planner", {
                              state: { tripId: trip.id },
                            })
                          }
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            toast.success(
                              `Duplicating trip to ${trip.destination}`
                            )
                          }
                        >
                          Duplicate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
