import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Map,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  X,
} from "lucide-react";

const STEPS = [
  {
    icon: Brain,
    emoji: "🤖",
    title: "Meet Your AI Travel Planner",
    desc: "Just tell TripGenius where you want to go, your budget, and travel dates. Our AI generates a complete day-by-day itinerary in seconds.",
    color: "from-violet-500 to-indigo-500",
    bg: "from-violet-500/10 to-indigo-500/10",
  },
  {
    icon: Map,
    emoji: "🗺️",
    title: "Explore the World Your Way",
    desc: "Use the interactive map, live weather forecasts, and currency converter to plan smarter. See transport options, hotels, and nearby places instantly.",
    color: "from-cyan-500 to-blue-500",
    bg: "from-cyan-500/10 to-blue-500/10",
  },
  {
    icon: Users,
    emoji: "💼",
    title: "Plan, Share & Collaborate",
    desc: "Share your itinerary with travel partners. Track spending, download trip PDFs, and get visa info — everything in one place.",
    color: "from-pink-500 to-rose-500",
    bg: "from-pink-500/10 to-rose-500/10",
  },
];

const STORAGE_KEY = "tg_onboarded";

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else dismiss();
  };

  const current = STEPS[step];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="onboarding-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            key={`onboarding-card-${step}`}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md glass-card rounded-3xl border border-primary/20 shadow-[0_20px_60px_rgba(191,255,255,0.2)] overflow-hidden"
          >
            {/* Header gradient bar */}
            <div className={`h-1 w-full bg-gradient-to-r ${current.color}`} />

            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 h-7 w-7 rounded-full glass-card border border-primary/20 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* Content */}
            <div className="p-8">
              {/* Icon */}
              <div
                className={`mb-6 mx-auto h-24 w-24 rounded-3xl bg-gradient-to-br ${current.bg} border border-primary/20 flex items-center justify-center`}
              >
                <span className="text-5xl">{current.emoji}</span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-3">
                  <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                  <span className="text-xs font-bold text-accent uppercase tracking-widest">
                    Step {step + 1} of {STEPS.length}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground mb-3">
                  {current.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {current.desc}
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 my-6">
                {STEPS.map((_, i) => (
                  <button key={i} onClick={() => setStep(i)}>
                    <motion.div
                      animate={{
                        width: i === step ? 24 : 8,
                        backgroundColor:
                          i === step
                            ? "hsl(var(--primary))"
                            : "hsl(var(--muted))",
                      }}
                      className="h-2 rounded-full"
                      transition={{ duration: 0.3 }}
                    />
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {step > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setStep((s) => s - 1)}
                    className="flex-1 border-primary/20 hover:bg-primary/10"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={next}
                  className={`flex-1 bg-gradient-to-r ${current.color} border-0 text-white font-bold shadow-md hover:scale-[1.02] transition-transform gap-2`}
                >
                  {step === STEPS.length - 1 ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Let's Go!
                    </>
                  ) : (
                    <>
                      Next <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              <button
                onClick={dismiss}
                className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip tour
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
