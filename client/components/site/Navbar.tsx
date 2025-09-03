import { Link, NavLink, useLocation } from "react-router-dom";
import { Plane, Map, Calendar, Users, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const location = useLocation();
  const links = [
    { to: "/", label: "Home" },
    { to: "/planner", label: "Planner" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:bg-background/70">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-3 xs:px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Plane className="h-5 w-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">TripGenius</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive || location.pathname === l.to
                    ? "text-primary"
                    : "text-muted-foreground",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild className="shadow-sm">
            <Link to="/signup" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Get Started
            </Link>
          </Button>
        </div>
      </nav>
      <div className="block border-t md:hidden" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 md:hidden">
        <div className="flex items-center gap-5">
          <NavLink to="/planner" className="text-muted-foreground hover:text-primary">
            <Map className="h-5 w-5" />
          </NavLink>
          <NavLink to="/dashboard" className="text-muted-foreground hover:text-primary">
            <Calendar className="h-5 w-5" />
          </NavLink>
          <NavLink to="/dashboard" className="text-muted-foreground hover:text-primary">
            <Users className="h-5 w-5" />
          </NavLink>
        </div>
      </div>
    </header>
  );
}
