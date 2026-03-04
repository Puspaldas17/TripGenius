import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Plane,
  Map,
  Calendar,
  Users,
  Brain,
  Sun,
  Moon,
  LogOut,
  BookOpen,
  Star,
  ChevronDown,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const location = useLocation();
  const { user, isGuest, isLoading, logout } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("tg_theme");
      if (saved === "dark" || saved === "light") return saved;
    } catch {}
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("tg_theme", theme);
    } catch {}
  }, [theme]);
  const links = [
    { to: "/", label: "Home" },
    { to: "/planner", label: "Planner" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  const moreLinks = [
    { to: "/journal", label: "Journal", icon: BookOpen },
    { to: "/reviews", label: "Reviews", icon: Star },
    { to: "/group-trips", label: "Group Trips", icon: Users },
    { to: "/compare", label: "Compare Destinations", icon: Scale },
    { to: "/emergency", label: "Safety Hub", icon: ShieldCheck },
    { to: "/profile", label: "Profile", icon: Map },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass transition-all duration-300">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-2.5 xs:px-4 md:px-6 transition-all duration-300">
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
            <Plane className="h-5 w-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tight gradient-text">
            TripGenius
          </span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-300 ease-out hover:bg-primary/5 hover:text-primary",
                  isActive || location.pathname === l.to
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground",
                  (isActive || location.pathname === l.to) &&
                    "after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-primary after:rounded-full",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}

          {/* More dropdown for Journal, Reviews, Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "relative flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-300 hover:bg-primary/5 hover:text-primary",
                  moreLinks.some((l) => location.pathname === l.to)
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground",
                )}
              >
                More <ChevronDown className="h-3.5 w-3.5" />
                {moreLinks.some((l) => location.pathname === l.to) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 mt-1">
              {moreLinks.map((ml) => (
                <DropdownMenuItem key={ml.to} asChild>
                  <Link to={ml.to} className="flex items-center gap-2">
                    <ml.icon className="h-4 w-4 text-muted-foreground" />{" "}
                    {ml.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="hidden md:inline-flex h-9 w-9 rounded-lg hover:bg-primary/5"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {isLoading ? (
            <Button variant="ghost" disabled>
              Loading...
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:inline-flex gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {user.name[0]?.toUpperCase()}
                  </div>
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/journal" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Travel Journal
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/reviews" className="flex items-center gap-2">
                    <Star className="h-4 w-4" /> Trip Reviews
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : isGuest ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden md:inline-flex gap-2"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs text-amber-900 font-semibold">
                    G
                  </div>
                  Guest Mode
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Browsing as guest
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Your data will be cleared when you logout
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/planner">Planner</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Exit Guest Mode
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="hidden md:inline-flex rounded-lg hover:bg-primary/5"
              >
                <Link to="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                <Link to="/signup" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </div>
      </nav>
      <div className="block border-t border-border/40 md:hidden" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 md:hidden">
        <div className="flex items-center gap-4">
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="rounded-lg border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <NavLink
            to="/planner"
            className={({ isActive }) =>
              cn(
                "rounded-lg p-1.5 transition-colors",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary",
              )
            }
          >
            <Map className="h-5 w-5" />
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              cn(
                "rounded-lg p-1.5 transition-colors",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary",
              )
            }
          >
            <Calendar className="h-5 w-5" />
          </NavLink>
          <NavLink
            to="/journal"
            className={({ isActive }) =>
              cn(
                "rounded-lg p-1.5 transition-colors",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary",
              )
            }
          >
            <BookOpen className="h-5 w-5" />
          </NavLink>
          <NavLink
            to="/reviews"
            className={({ isActive }) =>
              cn(
                "rounded-lg p-1.5 transition-colors",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary",
              )
            }
          >
            <Star className="h-5 w-5" />
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                "rounded-lg p-1.5 transition-colors",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary",
              )
            }
          >
            <Users className="h-5 w-5" />
          </NavLink>
        </div>
      </div>
    </header>
  );
}
