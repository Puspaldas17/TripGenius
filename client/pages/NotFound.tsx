import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <MapPin className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-6xl font-extrabold tracking-tight text-primary">404</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Looks like this destination doesn't exist on our map.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          The page <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{location.pathname}</code> could not be found.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" onClick={() => window.history.back()}>
            <span className="cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
