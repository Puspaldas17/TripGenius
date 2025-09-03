import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, CloudSun, Map, Calendar, Users, Brain, CreditCard, FileDown, Globe2, Bell } from "lucide-react";

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent" />
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-3 pb-10 pt-14 xs:px-4 md:grid-cols-2 md:px-6 md:pb-20 md:pt-24 2xl:gap-12">
          <div>
            <Badge className="mb-4 bg-accent text-accent-foreground">AI Travel Planner</Badge>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight xs:text-4xl md:text-6xl lg:text-7xl">
              Plan Smarter. <span className="text-primary">Travel Better.</span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground xs:text-lg lg:text-xl">
              TripGenius uses AI to create personalized itineraries with real-time weather, flight & hotel search, budget tracking, and group collaboration — all in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/planner" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" /> Start Planning
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#features" className="flex items-center gap-2">
                  <Map className="h-4 w-4" /> Explore Features
                </a>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CloudSun className="h-4 w-4"/> Weather</div>
              <div className="flex items-center gap-2"><Plane className="h-4 w-4"/> Flights</div>
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4"/> Drag & Drop</div>
              <div className="flex items-center gap-2"><Users className="h-4 w-4"/> Collaboration</div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl border bg-card p-4 shadow-xl">
              <img src="/placeholder.svg" alt="TripGenius preview" className="rounded-2xl border"/>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="text-2xl font-extrabold md:text-3xl">Everything you need for unforgettable trips</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          AI itinerary generation, real-time data, booking search, budgeting, and group planning — unified into a single seamless experience.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 xs:grid-cols-2 md:grid-cols-3 2xl:gap-8">
          {features.map((f) => (
            <Card key={f.title} className="hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.tint}`}>
                  {f.icon}
                </div>
                <div className="text-lg font-semibold">{f.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tech */}
      <section className="mx-auto w-full max-w-7xl px-3 pb-12 xs:px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 rounded-3xl border p-6 xs:gap-8 xs:p-8 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold">Tech Stack</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Frontend: React, TailwindCSS</li>
              <li>Backend: Node.js, Express.js</li>
              <li>Database: MongoDB (JWT Authentication)</li>
              <li>APIs: OpenAI, Skyscanner, Booking.com, Google Maps, OpenWeather, Currency, Yelp/Eventbrite</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold">Roadmap</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Phase 1 — MVP: AI itinerary, weather & maps, flight/hotel search, trip dashboard</li>
              <li>Phase 2 — Expansion: AI chat, calendar drag-drop, budget & currency, collaboration, local events</li>
              <li>Phase 3 — Monetization: PDF export, visa checker, templates marketplace, subscriptions & alerts</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mb-16 max-w-7xl px-4 md:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-primary to-accent px-8 py-10 text-primary-foreground">
          <h3 className="text-2xl font-extrabold">Start planning your next adventure</h3>
          <p className="mt-2 max-w-2xl opacity-90">Generate a complete itinerary in seconds. Invite your friends. Track your budget. All in TripGenius.</p>
          <div className="mt-5">
            <Button asChild size="lg" variant="secondary">
              <Link to="/planner" className="font-semibold">Launch Planner</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "AI Itinerary Generator",
    desc: "Personalized day-by-day plans tailored to your interests, budget, and dates.",
    icon: <Brain className="h-5 w-5 text-primary" />,
    tint: "bg-primary/10",
  },
  {
    title: "Real-time Weather",
    desc: "Weather-aware suggestions and daily forecasts built into your trip plan.",
    icon: <CloudSun className="h-5 w-5 text-primary" />,
    tint: "bg-primary/10",
  },
  {
    title: "Map & Calendar",
    desc: "Interactive Google Maps view and drag-and-drop calendar for organizing days.",
    icon: <Calendar className="h-5 w-5 text-primary" />,
    tint: "bg-primary/10",
  },
  {
    title: "Budget Tracking",
    desc: "Set budgets and monitor spend with live currency conversion.",
    icon: <CreditCard className="h-5 w-5 text-primary" />,
    tint: "bg-primary/10",
  },
  {
    title: "Group Collaboration",
    desc: "Invite friends, vote on activities, and plan together in real time.",
    icon: <Users className="h-5 w-5 text-primary" />,
    tint: "bg-primary/10",
  },
  {
    title: "PDF & Alerts",
    desc: "Offline export, visa checks, and smart notifications for key changes.",
    icon: <div className="flex items-center gap-2"><FileDown className="h-5 w-5 text-primary"/><Bell className="h-5 w-5 text-primary"/></div>,
    tint: "bg-primary/10",
  },
];
