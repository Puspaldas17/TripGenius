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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:bg-background/70 transition-all duration-300">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-3 xs:px-4 md:px-6 transition-all duration-300">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Plane className="h-5 w-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            TripGenius
          </span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-all duration-300 ease-out hover:text-primary relative",
                  isActive || location.pathname === l.to
                    ? "text-primary"
                    : "text-muted-foreground",
                  (isActive || location.pathname === l.to) &&
                    "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            aria-label="Toggle theme"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="hidden md:inline-flex"
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
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
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
              <Button asChild variant="ghost" className="hidden md:inline-flex">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="shadow-sm">
                <Link to="/signup" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </div>
      </nav>
      <div className="block border-t md:hidden" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 md:hidden">
        <div className="flex items-center gap-5">
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="rounded-md border px-2 py-1 text-xs text-muted-foreground"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <NavLink
            to="/planner"
            className="text-muted-foreground hover:text-primary"
          >
            <Map className="h-5 w-5" />
          </NavLink>
          <NavLink
            to="/dashboard"
            className="text-muted-foreground hover:text-primary"
          >
            <Calendar className="h-5 w-5" />
          </NavLink>
          <NavLink
            to="/dashboard"
            className="text-muted-foreground hover:text-primary"
          >
            <Users className="h-5 w-5" />
          </NavLink>
        </div>
      </div>
    </header>
  );
}
