import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plane,
  CloudSun,
  Map,
  Calendar,
  Users,
  Brain,
  CreditCard,
  FileDown,
  ArrowRight,
  Sparkles,
  Globe,
  Shield,
  Zap,
  Star,
  CheckCircle2,
} from "lucide-react";

/* ─────────────────────────── Landing Page ─────────────────────────────────── */

export default function Index() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <HeroSection />
      <LogoBar />
      <FeaturesSection />
      <HowItWorks />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}

/* ─────────────────────────── Hero ─────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 gradient-hero" />
      <div className="absolute inset-0 -z-10 dot-pattern opacity-40" />
      <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-20 md:grid-cols-2 md:px-6 md:pb-28 md:pt-32 2xl:gap-16">
        {/* Left — Copy */}
        <div className="animate-fade-in">
          <Badge className="mb-5 gap-1.5 rounded-full border-primary/20 bg-primary/10 px-4 py-1.5 text-primary hover:bg-primary/15">
            <Sparkles className="h-3.5 w-3.5" /> AI-Powered Travel Planner
          </Badge>

          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Plan Smarter. <span className="gradient-text">Travel Better.</span>
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            TripGenius uses AI to create personalized itineraries with real-time
            weather, flight &amp; hotel search, budget tracking, and group
            collaboration — all in one place.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 gap-2 px-6 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <Link to="/planner">
                <Brain className="h-5 w-5" /> Start Planning
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 gap-2 px-6 text-base hover-lift"
            >
              <a href="#features">
                <Map className="h-5 w-5" /> Explore Features
              </a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {[
              { icon: CloudSun, label: "Live Weather" },
              { icon: Plane, label: "Flight Search" },
              { icon: Calendar, label: "Day Planner" },
              { icon: Users, label: "Collaboration" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Hero image */}
        <div className="relative animate-slide-in-right">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl opacity-60" />
          <div className="relative rounded-2xl border bg-card/80 p-2 shadow-2xl backdrop-blur-sm hover-lift">
            <img
              src="https://images.pexels.com/photos/5953197/pexels-photo-5953197.jpeg"
              alt="Travel planning with TripGenius"
              className="h-auto w-full rounded-xl object-cover"
              loading="eager"
            />
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 animate-float glass-card rounded-xl px-4 py-2.5 shadow-lg">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-accent" />
                <span>AI-Generated Itinerary</span>
              </div>
            </div>
            <div className="absolute -top-3 -right-3 animate-bounce-subtle glass-card rounded-xl px-3 py-2 shadow-lg">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                4.9 Rating
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Logo / Trusted Bar ───────────────────────────── */

function LogoBar() {
  const items = [
    "Google Maps",
    "OpenWeather",
    "Skyscanner",
    "MongoDB",
    "OpenAI",
  ];
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4 py-6 text-sm font-medium text-muted-foreground md:px-6">
        <span className="text-xs uppercase tracking-widest">Powered by</span>
        {items.map((name) => (
          <span
            key={name}
            className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
          >
            <Globe className="h-4 w-4" /> {name}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── Features ─────────────────────────────────────── */

const features = [
  {
    title: "AI Itinerary Generator",
    desc: "Personalized day-by-day plans tailored to your interests, budget, and dates — powered by AI.",
    icon: Brain,
    gradient: "from-violet-500/20 to-indigo-500/20",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    title: "Real-time Weather",
    desc: "Weather-aware suggestions and daily forecasts built right into your trip timeline.",
    icon: CloudSun,
    gradient: "from-sky-500/20 to-blue-500/20",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    title: "Interactive Map & Calendar",
    desc: "Visualize your journey on maps and organize activities with drag-and-drop scheduling.",
    icon: Calendar,
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Budget Tracking",
    desc: "Set budgets, monitor spending, and get live currency conversions across 170+ currencies.",
    icon: CreditCard,
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    title: "Group Collaboration",
    desc: "Invite friends, share itineraries in real-time, and plan trips together seamlessly.",
    icon: Users,
    gradient: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
  {
    title: "Export & Smart Alerts",
    desc: "Download trip PDFs for offline use, get visa info, and receive smart change notifications.",
    icon: FileDown,
    gradient: "from-primary/20 to-accent/20",
    iconColor: "text-primary",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center animate-fade-in">
          <Badge
            variant="outline"
            className="mb-4 gap-1.5 rounded-full px-4 py-1.5"
          >
            <Zap className="h-3.5 w-3.5" /> Features
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Everything you need for{" "}
            <span className="gradient-text">unforgettable trips</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            AI itinerary generation, real-time data, booking search, budgeting,
            and group planning — unified into one seamless experience.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, idx) => (
            <Card
              key={f.title}
              className="group relative overflow-hidden border-transparent bg-card shadow-sm hover-lift hover-glow cursor-default"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              {/* Subtle gradient bg on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <CardContent className="relative p-6">
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient}`}
                >
                  <f.icon className={`h-6 w-6 ${f.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── How It Works ──────────────────────────────────── */

const steps = [
  {
    step: "01",
    title: "Enter Your Details",
    desc: "Tell us where you want to go, your budget, travel dates, and trip mood.",
    icon: Map,
  },
  {
    step: "02",
    title: "AI Generates Your Plan",
    desc: "Our AI creates a personalized day-by-day itinerary with activities, restaurants, and more.",
    icon: Brain,
  },
  {
    step: "03",
    title: "Customize & Collaborate",
    desc: "Fine-tune your plan, invite friends, check weather, and book flights — all in one place.",
    icon: Users,
  },
];

function HowItWorks() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center animate-fade-in">
          <Badge
            variant="outline"
            className="mb-4 gap-1.5 rounded-full px-4 py-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> How It Works
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Three steps to your{" "}
            <span className="gradient-text">perfect trip</span>
          </h2>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Connector line (desktop) */}
          <div className="absolute top-16 left-[16.66%] right-[16.66%] hidden h-0.5 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30 md:block" />

          {steps.map((s, idx) => (
            <div
              key={s.step}
              className="relative flex flex-col items-center text-center animate-slide-in-up"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                <s.icon className="h-7 w-7" />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                {s.step}
              </div>
              <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Stats ────────────────────────────────────────── */

function StatsSection() {
  const stats = [
    { value: "10K+", label: "Trips Planned" },
    { value: "170+", label: "Currencies" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9", label: "User Rating", suffix: "/5" },
  ];

  return (
    <section className="section-padding">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 md:grid-cols-4 md:px-6">
        {stats.map((s, idx) => (
          <div
            key={s.label}
            className="text-center animate-slide-in-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
              {s.value}
              {s.suffix && (
                <span className="text-muted-foreground text-lg font-medium">
                  {s.suffix}
                </span>
              )}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── Testimonials ──────────────────────────────────── */

const testimonials = [
  {
    quote:
      "TripGenius planned our honeymoon in seconds. The AI suggestions were spot-on and the weather integration saved us from a rainy day in Bali!",
    name: "Priya Sharma",
    role: "Newlywed Traveler",
    avatar: "PS",
  },
  {
    quote:
      "As a group of 8 friends, coordinating was always chaos. The real-time collaboration feature made our Japan trip planning actually fun.",
    name: "Alex Chen",
    role: "Group Organizer",
    avatar: "AC",
  },
  {
    quote:
      "The budget tracking with live currency conversion is a game changer. I finally traveled without worrying about overspending.",
    name: "Maria Rodriguez",
    role: "Budget Traveler",
    avatar: "MR",
  },
];

function TestimonialsSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center animate-fade-in">
          <Badge
            variant="outline"
            className="mb-4 gap-1.5 rounded-full px-4 py-1.5"
          >
            <Star className="h-3.5 w-3.5" /> Testimonials
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Loved by <span className="gradient-text">travelers worldwide</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <Card
              key={t.name}
              className="border-transparent shadow-sm hover-lift animate-slide-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── CTA ──────────────────────────────────────────── */

function CTASection() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl gradient-cta px-8 py-14 text-center text-white shadow-2xl shadow-primary/20 md:px-16 md:py-20">
          {/* Decorative blobs */}
          <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Start planning your next adventure
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
              Generate a complete itinerary in seconds. Invite your friends.
              Track your budget. All free with TripGenius.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="h-12 gap-2 px-8 text-base font-semibold shadow-lg"
              >
                <Link to="/planner">
                  <Sparkles className="h-5 w-5" /> Launch Planner
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 gap-2 px-8 text-base font-semibold border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <Link to="/signup">
                  <Shield className="h-5 w-5" /> Create Free Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
