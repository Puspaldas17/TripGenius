import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  CloudSun,
  CalendarDays,
  FileDown,
  Plus,
  FolderKanban,
  Bell,
  Trash2,
} from "lucide-react";
import type { WeatherResponse } from "@shared/api";

function safeNumber(n: any, d = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : d;
}

async function safeFetch(input: RequestInfo | URL, init?: RequestInit) {
  try {
    return await fetch(input, init);
  } catch {
    return new Response(null, { status: 0 });
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  type SavedTrip = {
    id: string;
    name: string;
    destination: string;
    days: number;
    createdAt: number;
  };
  const [serverOk, setServerOk] = useState(false);
  const [apiBase, setApiBase] = useState("/api");
  const [saved, setSaved] = useState<SavedTrip[]>(() => {
    try {
      const raw = localStorage.getItem("tg_saved_trips");
      return raw ? (JSON.parse(raw) as SavedTrip[]) : [];
    } catch {
      return [];
    }
  });
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5 as const;
  const [activity, setActivity] = useState<
    { id: string; at: number; message: string }[]
  >(() => {
    try {
      const raw = localStorage.getItem("tg_activity");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const stats = useMemo(() => {
    const trips = saved.length;
    const days = saved.reduce((s, t) => s + safeNumber(t.days), 0);
    return { trips, days };
  }, [saved]);

  useEffect(() => {
    (async () => {
      const ok = await ensureServer();
      if (!ok) return;
      // Try enrich from backend if logged in
      const token = localStorage.getItem("tg_token");
      if (!token) return;
      try {
        setLoadingTrips(true);
        const r = await safeFetch(`${apiBase}/trips`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (r.ok) {
          const j = (await r.json()) as { trips: any[] };
          const mapped: SavedTrip[] = (j.trips || []).map((t: any) => ({
            id: String(t.id),
            name: String(t.name || t.itinerary?.destination || "Trip"),
            destination: String(t.itinerary?.destination || ""),
            days: Number((t.itinerary?.days || []).length || 0),
            createdAt: Number(t.createdAt || Date.now()),
          }));
          setSaved((prev) => {
            const all = [...prev];
            for (const m of mapped)
              if (!all.find((x) => x.id === m.id)) all.push(m);
            try {
              localStorage.setItem("tg_saved_trips", JSON.stringify(all));
            } catch {}
            return all;
          });
        }
      } catch {
      } finally {
        setLoadingTrips(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!saved.length) return;
      if (!(await ensureServer())) return;
      const dest = saved[0].destination;
      if (!dest) return;
      try {
        const r = await safeFetch(
          `${apiBase}/weather?location=${encodeURIComponent(dest)}`,
        );
        if (r.ok) setWeather((await r.json()) as WeatherResponse);
      } catch {}
    })();
  }, [saved]);

  const ensureServer = async () => {
    if (serverOk) return true;
    const probe = async (base: string) => {
      try {
        const res = await safeFetch(`${base}/ping`);
        if (!res.ok) return false;
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) return false;
        const j = await res.json().catch(() => null as any);
        return !!j && typeof j === "object" && "message" in j;
      } catch {
        return false;
      }
    };
    if (await probe("/api")) {
      setApiBase("/api");
      setServerOk(true);
      return true;
    }
    if (await probe("/.netlify/functions/api")) {
      setApiBase("/.netlify/functions/api");
      setServerOk(true);
      return true;
    }
    return false;
  };

  const pushActivity = (message: string) => {
    const entry = { id: String(Date.now()), at: Date.now(), message };
    try {
      const raw = localStorage.getItem("tg_activity");
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(entry);
      localStorage.setItem("tg_activity", JSON.stringify(list));
    } catch {}
    setActivity((a) => [entry, ...a]);
  };

  const openTrip = (id: string) => {
    try {
      localStorage.setItem("tg_open_trip", id);
    } catch {}
    navigate("/planner");
  };

  const deleteTrip = (id: string) => {
    setSaved((prev) => {
      const next = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem("tg_saved_trips", JSON.stringify(next));
        localStorage.removeItem("tg_trip_" + id);
      } catch {}
      return next;
    });
    const trip = saved.find((t) => t.id === id);
    if (trip) pushActivity(`Deleted plan: ${trip.name}`);
  };

  const exportLast = () => {
    if (!saved.length) return;
    const s = saved[0];
    const html = `<!doctype html><html><head><meta charset='utf-8'><title>${s.name}</title>
      <style>body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial;padding:24px;color:#0f172a}
      h1{margin:0 0 8px} p{margin:4px 0}</style></head><body>
      <h1>${s.name}</h1>
      <p>Destination: ${s.destination}</p>
      <p>Days: ${s.days}</p>
      <p>Created: ${new Date(s.createdAt).toLocaleString()}</p>
      </body></html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
    pushActivity(`Exported plan: ${s.name}`);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-8 sm:px-4 md:px-6 md:py-10">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2">
            <Button asChild>
              <Link to="/planner" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                New Trip
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={exportLast}
              disabled={!saved.length}
              className="w-full"
            >
              <FileDown className="mr-2 h-4 w-4" /> Export last plan
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" /> Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md border p-3">
              Trips
              <div className="text-2xl font-bold">{stats.trips}</div>
            </div>
            <div className="rounded-md border p-3">
              Days
              <div className="text-2xl font-bold">{stats.days}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudSun className="h-5 w-5 text-primary" /> Upcoming Weather
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weather ? (
              <div className="space-y-2 text-sm">
                {weather.alerts?.length ? (
                  <div className="rounded-md border bg-amber-50 p-2 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200 text-xs">
                    ⚠️ Alerts:{" "}
                    {weather.alerts.map((a) => a.description).join(", ")}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    No alerts.
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {weather.daily.slice(0, 3).map((d) => (
                    <div key={d.date} className="rounded-md border p-2 text-xs">
                      <div className="font-medium">
                        {new Date(d.date).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground">{d.summary}</div>
                      <div>
                        {Math.round(d.tempMin)}° / {Math.round(d.tempMax)}°C
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                Save a trip to see weather for it.
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            No notifications yet.
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Saved Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center gap-2">
              <Input
                placeholder="Search by name or destination"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("tg_saved_trips");
                  setSaved([]);
                }}
                disabled={!saved.length}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
            </div>
            {loadingTrips ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : saved.length ? (
              (() => {
                const filtered = saved.filter((t) =>
                  (t.name + " " + t.destination)
                    .toLowerCase()
                    .includes(query.toLowerCase()),
                );
                const total = filtered.length;
                const totalPages = Math.max(1, Math.ceil(total / pageSize));
                const cur = Math.min(page, totalPages);
                const start = (cur - 1) * pageSize;
                const pageItems = filtered.slice(start, start + pageSize);
                return (
                  <>
                    <div className="space-y-2">
                      {pageItems.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between rounded-md border p-3 text-sm"
                        >
                          <div>
                            <div className="font-medium">
                              {t.name}{" "}
                              <Badge variant="secondary" className="ml-2">
                                {t.days} days
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t.destination} •{" "}
                              {new Date(t.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button asChild variant="outline">
                              <Link
                                to="/planner"
                                onClick={(e) => {
                                  e.preventDefault();
                                  openTrip(t.id);
                                }}
                              >
                                Open
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => deleteTrip(t.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Pagination className="mt-3">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage((p) => Math.max(1, p - 1));
                            }}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage((p) => p + 1);
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </>
                );
              })()
            ) : (
              <div className="text-sm text-muted-foreground">
                No saved plans yet. Create one from the Planner.
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activity.length ? (
              <div className="space-y-2 text-sm">
                {activity.slice(0, 10).map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div>
                      <div>{a.message}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(a.at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      localStorage.removeItem("tg_activity");
                      setActivity([]);
                    }}
                  >
                    Clear activity
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Nothing here yet. Start planning to see activity.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
