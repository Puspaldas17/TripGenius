import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Sparkles, X } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Pricing() {
  const { user } = useAuth();

  const handleUpgrade = () => {
    toast.success("Welcome to TripGenius Pro! (Mock demonstration)");
  };

  return (
    <>
      <Helmet>
        <title>Pricing & Pro Plans | TripGenius</title>
        <meta
          name="description"
          content="Upgrade to TripGenius Pro for unlimited AI trips, PDF exports, and group collaboration."
        />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl gradient-text">
            Travel smarter. Plan better.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-foreground">
            Choose the perfect plan for your travel style. Upgrade to Pro for
            unlimited AI-powered journeys.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          {/* Free Tier */}
          <Card className="flex flex-col h-full glass-card hover-glow">
            <CardHeader>
              <CardTitle className="text-2xl">Explorer</CardTitle>
              <CardDescription>
                Perfect for the occasional weekend getaway.
              </CardDescription>
              <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                ₹0
                <span className="ml-1 text-xl font-medium text-muted-foreground">
                  /mo
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>3 AI generated trips per month</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Interactive Route Map</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Live Weather & Basic Budgets</span>
                </li>
                <li className="flex items-center gap-3 opacity-50">
                  <X className="h-5 w-5 text-muted-foreground" />
                  <span className="line-through text-muted-foreground">
                    Export trips to PDF
                  </span>
                </li>
                <li className="flex items-center gap-3 opacity-50">
                  <X className="h-5 w-5 text-muted-foreground" />
                  <span className="line-through text-muted-foreground">
                    Group Trip Collab (up to 10)
                  </span>
                </li>
                <li className="flex items-center gap-3 opacity-50">
                  <X className="h-5 w-5 text-muted-foreground" />
                  <span className="line-through text-muted-foreground">
                    Live Flight & Hotel tracking
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Tier (Highlighted) */}
          <Card className="flex flex-col h-full border-primary shadow-[0_0_30px_rgba(191,255,255,0.2)] md:scale-105 relative bg-gradient-to-b from-background to-primary/5">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-950 shadow-md flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Most Popular
            </div>
            <CardHeader className="pt-8">
              <CardTitle className="text-3xl text-primary">
                TripGenius Pro
              </CardTitle>
              <CardDescription>
                Unleash the full power of AI for frequent flyers.
              </CardDescription>
              <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                ₹499
                <span className="ml-1 text-xl font-medium text-muted-foreground">
                  /mo
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-amber-500" />
                  <span className="font-medium">
                    Unlimited AI generated trips
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Interactive Route Map</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Advanced Analytics Dashboard</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Export beautiful PDF itineraries</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Group Trip Collaboration (Unlimited)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Smart AI Packing List Checklists</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                onClick={handleUpgrade}
              >
                {user ? "Upgrade to Pro" : "Start Free Trial"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
