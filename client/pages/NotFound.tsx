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
    <div className="relative flex min-h-[70vh] items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 gradient-hero" />
      <div className="absolute inset-0 -z-10 dot-pattern opacity-20" />

      <div className="text-center max-w-md animate-fade-in">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 animate-float">
          <MapPin className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-7xl font-extrabold tracking-tight gradient-text">
          404
        </h1>
        <p className="mt-4 text-xl font-medium">
          Looks like this destination doesn't exist on our map.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          The page{" "}
          <code className="rounded-md bg-muted px-2 py-1 text-xs font-mono">
            {location.pathname}
          </code>{" "}
          could not be found.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="shadow-md shadow-primary/20">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
          >
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
