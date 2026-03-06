import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
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
  Zap,
  Star,
  CheckCircle2,
} from "lucide-react";

/* ─────────────────────────── Landing Page ─────────────────────────────────── */

export default function Index() {
  return (
    <>
      <Helmet>
        <title>TripGenius — Your AI Travel Agent</title>
        <meta
          name="description"
          content="Build your perfect travel itinerary in seconds with TripGenius AI."
        />
      </Helmet>
      <div className="flex flex-col w-full overflow-hidden bg-background">
        <HeroSection />
        <LogoBar />
        <FeaturesSection />
        <HowItWorks />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
      </div>
    </>
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
              className="h-12 gap-2 px-6 text-base shadow-lg shadow-primary/25 hover:shadow-[0_0_30px_rgba(191,255,255,0.4)] hover:scale-[1.02] bg-gradient-to-r from-primary to-accent border-0 text-white transition-all cursor-pointer"
            >
              <Link to="/planner">
                <Brain className="h-5 w-5 animate-pulse" /> Start Planning
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 gap-2 px-6 text-base glass-card hover-glow border-primary/30 hover:bg-primary/10 transition-all cursor-pointer"
            >
              <a href="#features">
                <Map className="h-5 w-5" /> Explore Features
              </a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-foreground/80 font-medium">
            {[
              { icon: CloudSun, label: "Live Weather" },
              { icon: Plane, label: "Flight Search" },
              { icon: Calendar, label: "Day Planner" },
              { icon: Users, label: "Collaboration" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full glass-card border border-primary/30 shadow-[0_0_15px_rgba(191,255,255,0.15)]">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Hero Floating App Mockup */}
        <div className="relative animate-slide-in-right mt-10 md:mt-0 flex justify-center lg:justify-end xl:w-full perspective-[1000px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-[100px] animate-pulse-glow" />

          {/* Main App Window */}
          <div
            className="relative z-10 w-full max-w-sm rounded-[2rem] border border-primary/30 bg-background/60 p-2 shadow-[0_0_40px_-10px_rgba(191,255,255,0.2)] backdrop-blur-xl transition-transform duration-700 hover:rotate-0 hover:scale-[1.02]"
            style={{ transform: "rotateY(-15deg) rotateX(5deg)" }}
          >
            <div className="flex flex-col gap-3 rounded-[1.5rem] bg-card/80 p-4 w-full shadow-inner border border-primary/10 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />

              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                </div>
                <div className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent uppercase tracking-widest">
                  TripGenius AI
                </div>
              </div>

              <div
                className="h-32 w-full rounded-xl object-cover bg-cover bg-center overflow-hidden border border-primary/20 relative shadow-sm"
                style={{
                  backgroundImage:
                    "url('https://images.pexels.com/photos/5953197/pexels-photo-5953197.jpeg')",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
                  <Map className="h-4 w-4 drop-shadow-md text-primary" />
                  <span className="text-sm font-bold tracking-wide drop-shadow-md">
                    Kyoto, Japan
                  </span>
                </div>
              </div>

              <div className="space-y-2 mt-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-foreground">
                    Day 1 Overview
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-5 px-1.5 bg-accent/20 text-accent border border-accent/30 shadow-[0_0_10px_rgba(255,100,200,0.2)]"
                  >
                    AI Generated
                  </Badge>
                </div>
                <div className="space-y-2 relative z-10">
                  {[
                    { time: "09:00", act: "Fushimi Inari Taisha", icon: "⛩️" },
                    { time: "12:30", act: "Nishiki Market Lunch", icon: "🍜" },
                    { time: "15:00", act: "Kiyomizu-dera Temple", icon: "🏯" },
                  ].map((x) => (
                    <div
                      key={x.time}
                      className="flex items-center gap-3 rounded-xl border border-primary/20 bg-background/60 p-2.5 shadow-sm text-xs backdrop-blur-md transition-all hover:bg-primary/10 cursor-default"
                    >
                      <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-primary/20 shadow-inner">
                        <span className="text-sm">{x.icon}</span>
                      </div>
                      <div className="flex-1 font-semibold text-foreground">
                        {x.act}
                      </div>
                      <div className="text-primary font-medium tracking-tight bg-primary/10 px-1.5 py-0.5 rounded">
                        {x.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                size="sm"
                className="w-full h-8 mt-1 text-xs font-bold bg-gradient-to-r from-primary to-accent border-0 text-white shadow-md shadow-primary/20"
              >
                View Full Itinerary <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>

            {/* Floating widget 1: Weather */}
            <div
              className="absolute -left-6 sm:-left-12 top-24 animate-float glass-card border flex flex-col items-center justify-center border-primary/40 rounded-[1.5rem] h-20 w-20 shadow-[0_10px_30px_-5px_rgba(191,255,255,0.3)] backdrop-blur-xl bg-background/80"
              style={{ animationDelay: "0.5s" }}
            >
              <CloudSun className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
              <div className="text-sm font-extrabold mt-1 text-foreground">
                24°
              </div>
            </div>

            {/* Floating widget 2: Rating */}
            <div
              className="absolute -right-4 sm:-right-8 bottom-32 animate-bounce-subtle glass-card border flex items-center gap-2 border-accent/40 rounded-full px-4 py-2.5 shadow-[0_10px_30px_-5px_rgba(255,100,200,0.3)] backdrop-blur-xl bg-background/80"
              style={{ animationDelay: "1.2s" }}
            >
              <Star className="h-4 w-4 fill-accent text-accent animate-pulse" />
              <span className="text-sm font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-accent to-pink-500">
                4.9 / 5
              </span>
            </div>

            {/* Floating widget 3: Collab */}
            <div
              className="absolute -left-4 sm:-left-8 bottom-12 animate-float glass-card border border-primary/30 rounded-full px-3 py-1.5 shadow-xl backdrop-blur-xl bg-background/80 flex items-center gap-2"
              style={{ animationDelay: "2.5s" }}
            >
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white border-2 border-background z-20 shadow-sm">
                  JS
                </div>
                <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-white border-2 border-background z-10 shadow-sm">
                  MK
                </div>
              </div>
              <span className="text-[10px] font-bold text-foreground pr-1">
                + Joined
              </span>
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

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f, idx) => (
            <motion.div
              key={f.title}
              variants={{
                hidden: { opacity: 0, scale: 0.95, y: 30 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 100, damping: 15 },
                },
              }}
              className={`flex
                ${idx === 0 ? "md:col-span-2 lg:col-span-2" : ""}
                ${idx === 4 ? "md:col-span-2 lg:col-span-2 lg:col-start-2 lg:row-start-3" : ""}
                ${idx === 5 ? "lg:col-start-1 lg:row-start-3" : ""}
              `}
            >
              <Card
                className={`w-full group relative overflow-hidden glass-card border border-primary/20 bg-background/50 shadow-lg hover-glow hover:scale-[1.01] cursor-default transition-all duration-500`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none`}
                />
                <div className="absolute -inset-10 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none" />

                <CardContent className="relative p-6 sm:p-8 flex flex-col items-start h-full">
                  <div
                    className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} shadow-inner border border-white/10`}
                  >
                    <f.icon
                      className={`h-7 w-7 ${f.iconColor} drop-shadow-md`}
                    />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground lg:max-w-[90%]">
                    {f.desc}
                  </p>

                  {/* Visual Flair Banners */}
                  {idx === 0 && (
                    <div className="mt-auto pt-6 w-full opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="w-full rounded-2xl border border-primary/20 bg-background/80 p-4 shadow-sm backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-3">
                          <Brain className="h-5 w-5 text-accent animate-pulse" />
                          <div className="h-2.5 w-full bg-primary/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-accent w-2/3 animate-pulse" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-1.5 w-1/3 bg-muted rounded-full" />
                          <div className="h-1.5 w-1/4 bg-muted/50 rounded-full" />
                        </div>
                      </div>
                    </div>
                  )}

                  {idx === 4 && (
                    <div className="mt-auto pt-6 flex -space-x-3 opacity-90 group-hover:opacity-100 transition-opacity">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-11 w-11 rounded-full border-[3px] border-background bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-md animate-float`}
                          style={{ animationDelay: `${i * 0.2}s` }}
                        >
                          <Users className="h-4 w-4 text-white drop-shadow-sm" />
                        </div>
                      ))}
                      <div className="h-11 w-11 rounded-full border-[3px] border-background bg-muted flex items-center justify-center shadow-md z-10 text-xs font-bold text-foreground">
                        +5
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
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
    <section className="section-padding relative overflow-hidden">
      {/* Background blobs for "How It Works" */}
      <div className="absolute inset-0 -z-10 bg-muted/20" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-accent/5 blur-3xl saturate-150" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl saturate-150" />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center animate-fade-in">
          <Badge
            variant="outline"
            className="mb-4 gap-1.5 rounded-full px-4 py-1.5 border-primary/20 bg-primary/5 text-primary shadow-sm"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> How It Works
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Three steps to your{" "}
            <span className="gradient-text">perfect trip</span>
          </h2>
        </div>

        <div className="relative mt-20 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {/* Animated glowing connector line (desktop) */}
          <div className="absolute top-10 left-[16.66%] right-[16.66%] hidden h-[2px] bg-muted md:block overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/80 to-transparent w-full animate-shimmer" />
          </div>

          {steps.map((s, idx) => (
            <div
              key={s.step}
              className="relative flex flex-col items-center text-center animate-slide-in-up group"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent p-[2px] shadow-[0_0_20px_rgba(191,255,255,0.2)] transition-transform duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(191,255,255,0.4)]">
                <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-background/90 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <s.icon className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-500 relative z-10" />
                </div>
              </div>

              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-extrabold text-white bg-gradient-to-r from-primary to-accent rounded-full px-3 py-1 shadow-md z-20">
                STEP {s.step}
              </div>

              <h3 className="mt-8 text-xl font-bold tracking-tight text-foreground">
                {s.title}
              </h3>
              <p className="mt-3 max-w-[260px] text-sm text-muted-foreground leading-relaxed">
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
    <section className="section-padding relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/90 via-accent/80 to-primary/90 px-8 py-16 text-center text-white shadow-[0_0_50px_rgba(191,255,255,0.2)] md:px-16 md:py-24 group">
          {/* Animated meshes */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/20 blur-3xl transition-transform duration-1000 group-hover:scale-150 group-hover:translate-x-10" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/20 blur-3xl transition-transform duration-1000 group-hover:scale-150 group-hover:-translate-x-10" />

          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl drop-shadow-md">
              Start planning your next adventure
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg opacity-90 font-medium">
              Generate a complete itinerary in seconds. Invite your friends.
              Track your budget. All completely free with TripGenius.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="h-14 gap-2 px-8 text-base font-bold shadow-xl hover:scale-105 transition-transform text-primary bg-white hover:bg-white/90"
              >
                <Link to="/planner">
                  <Sparkles className="h-5 w-5 animate-pulse text-accent" />{" "}
                  Launch App Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
