import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X, Sparkles, ArrowRight, Loader2 } from "lucide-react";

const QUESTIONS = [
  {
    id: "climate",
    question: "What climate do you prefer?",
    options: [
      { label: "☀️ Tropical & Hot", value: "tropical" },
      { label: "❄️ Cold & Snowy", value: "cold" },
      { label: "🌤️ Mild & Pleasant", value: "mild" },
      { label: "🌵 Dry & Arid", value: "desert" },
    ],
  },
  {
    id: "activity",
    question: "What's your ideal trip activity?",
    options: [
      { label: "🏛️ Culture & History", value: "culture" },
      { label: "🏖️ Beach & Relaxation", value: "beach" },
      { label: "🥾 Adventure & Hiking", value: "adventure" },
      { label: "🍜 Food & Nightlife", value: "food" },
    ],
  },
  {
    id: "vibe",
    question: "What's your travel vibe?",
    options: [
      { label: "🧳 Solo Explorer", value: "solo" },
      { label: "💑 Romantic Getaway", value: "romantic" },
      { label: "👨‍👩‍👧 Family Fun", value: "family" },
      { label: "🎉 Friends Trip", value: "friends" },
    ],
  },
  {
    id: "budget",
    question: "What's your budget range?",
    options: [
      { label: "💸 Budget ($500-$1k)", value: "budget" },
      { label: "💼 Mid-range ($1k-$3k)", value: "midrange" },
      { label: "✈️ Premium ($3k-$8k)", value: "premium" },
      { label: "👑 Luxury ($8k+)", value: "luxury" },
    ],
  },
];

const SUGGESTIONS: Record<
  string,
  { dest: string; why: string; emoji: string }[]
> = {
  "tropical-beach": [
    {
      dest: "Bali, Indonesia",
      why: "Perfect beaches, rich culture, budget-friendly",
      emoji: "🌴",
    },
    {
      dest: "Phuket, Thailand",
      why: "Crystal water, vibrant nightlife, stunning temples",
      emoji: "🐘",
    },
  ],
  "tropical-culture": [
    {
      dest: "Hoi An, Vietnam",
      why: "Ancient town, lanterns, incredible food scene",
      emoji: "🏮",
    },
    {
      dest: "Chiang Mai, Thailand",
      why: "Temples, jungle treks, amazing street food",
      emoji: "🐅",
    },
  ],
  "cold-adventure": [
    {
      dest: "Reykjavik, Iceland",
      why: "Northern lights, volcanoes, midnight sun",
      emoji: "🌌",
    },
    {
      dest: "Queenstown, New Zealand",
      why: "Bungee jumping, fjords, Lord of the Rings scenery",
      emoji: "🏔️",
    },
  ],
  "mild-culture": [
    {
      dest: "Rome, Italy",
      why: "2,500 years of history, world's best food",
      emoji: "🏛️",
    },
    {
      dest: "Kyoto, Japan",
      why: "Temples, geishas, autumn leaves",
      emoji: "⛩️",
    },
  ],
  "mild-food": [
    {
      dest: "Barcelona, Spain",
      why: "Tapas, Gaudí, beach promenade, vibrant nightlife",
      emoji: "🎨",
    },
    {
      dest: "Tokyo, Japan",
      why: "3 Michelin-starred restaurants per km²",
      emoji: "🍣",
    },
  ],
  "desert-adventure": [
    {
      dest: "Marrakech, Morocco",
      why: "Sahara dunes, medina souks, riads",
      emoji: "🐪",
    },
    {
      dest: "Petra, Jordan",
      why: "Ancient carved city, Wadi Rum stargazing",
      emoji: "🏺",
    },
  ],
};

function getSuggestions(answers: Record<string, string>) {
  const key = `${answers.climate}-${answers.activity}`;
  return (
    SUGGESTIONS[key] ?? [
      {
        dest: "Lisbon, Portugal",
        why: "Affordable, sunny, stunning architecture, great food scene",
        emoji: "🇵🇹",
      },
      {
        dest: "Buenos Aires, Argentina",
        why: "Tango, beef, European flair, vibrant arts scene",
        emoji: "💃",
      },
      {
        dest: "Cape Town, South Africa",
        why: "Mountains, beaches, wine, safari within reach",
        emoji: "🦁",
      },
    ]
  );
}

interface DestinationDiscoveryProps {
  onClose?: () => void;
}

export default function DestinationDiscovery({
  onClose,
}: DestinationDiscoveryProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [thinking, setThinking] = useState(false);
  const [results, setResults] = useState<
    { dest: string; why: string; emoji: string }[] | null
  >(null);

  const current = QUESTIONS[step];

  const handleAnswer = (value: string) => {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setThinking(true);
      setTimeout(() => {
        setResults(getSuggestions(next));
        setThinking(false);
      }, 1800);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResults(null);
  };

  return (
    <Card className="glass-card border-primary/20 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-primary to-accent" />
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
            Where Should I Go?
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-muted/50 transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {thinking && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 py-12 text-center"
            >
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">
                AI is finding your perfect destination…
              </p>
            </motion.div>
          )}

          {!thinking && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground font-medium">
                🎯 Based on your answers, we recommend:
              </p>
              {results.map((r, i) => (
                <motion.div
                  key={r.dest}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-4 group hover:border-primary/40 hover:shadow-md transition-all cursor-default"
                >
                  <div className="text-4xl">{r.emoji}</div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-foreground">
                      {r.dest}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {r.why}
                    </div>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="shrink-0 bg-gradient-to-r from-primary to-accent border-0 text-white text-xs"
                  >
                    <Link
                      to={`/planner?destination=${encodeURIComponent(r.dest)}`}
                    >
                      Plan <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </motion.div>
              ))}
              <Button
                variant="outline"
                onClick={reset}
                className="w-full mt-2 border-primary/20 hover:bg-primary/10 text-sm"
              >
                Try Again
              </Button>
            </motion.div>
          )}

          {!thinking && !results && (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-4"
            >
              {/* Progress */}
              <div className="flex gap-1">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-gradient-to-r from-primary to-accent" : "bg-muted"}`}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-foreground pt-2">
                {current.question}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {current.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className="flex items-center justify-center text-left rounded-xl border border-primary/20 bg-background/50 px-3 py-3 text-sm font-medium text-foreground hover:border-primary hover:bg-primary/10 hover:shadow-md transition-all duration-200 active:scale-95"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Question {step + 1} of {QUESTIONS.length}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
