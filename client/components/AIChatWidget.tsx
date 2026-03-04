import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Minimize2,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts: number;
}

const SUGGESTIONS = [
  "Best time to visit Japan?",
  "Budget tips for Europe",
  "Solo travel safety advice",
  "Packing list for beach trip",
];

async function askAI(prompt: string, destination?: string): Promise<string> {
  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, destination }),
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return data.reply || "I couldn't get an answer right now. Try again!";
  } catch {
    // Fallback smart responses
    const p = prompt.toLowerCase();
    if (p.includes("budget") || p.includes("cheap") || p.includes("cost"))
      return "💰 Budget tips: Book flights 6-8 weeks early, use Hostelworld for cheap stays, eat at local markets, travel shoulder season (Apr-May, Sep-Oct) for 30-40% savings!";
    if (p.includes("pack") || p.includes("bag") || p.includes("luggage"))
      return "🎒 Packing essentials: carry-on only saves time & money, pack 3-day outfits and do laundry, bring a portable charger, universal adapter, and microfibre towel. Roll clothes to save space!";
    if (p.includes("safe") || p.includes("solo") || p.includes("alone"))
      return "🛡️ Solo travel tips: Share your itinerary with someone, use hotel lockers for valuables, keep copies of documents in cloud, stay in social hostels, trust your instincts!";
    if (p.includes("japan") || p.includes("tokyo") || p.includes("kyoto"))
      return "🏯 Japan tips: Get a 14-day JR Pass (~$500, totally worth it), carry cash (many places are cash-only), try convenience store food (seriously amazing), visit temples early morning to avoid crowds!";
    if (p.includes("europe") || p.includes("paris") || p.includes("rome"))
      return "🌍 Europe tips: Interrail pass for train travel, book accommodation early in summer, carry an EU adapter, many museums are free on first Sunday of the month!";
    return "✈️ Great travel question! Use the AI Planner to generate a full customized itinerary for your trip. I can also answer questions about packing, budgeting, destinations, and travel tips. What specific destination are you thinking about?";
  }
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "👋 Hi! I'm your TripGenius AI assistant. Ask me anything about travel — destinations, budgets, packing, safety tips or more!",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, open, minimized]);

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: msg,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const reply = await askAI(msg);
    const botMsg: Message = {
      id: Date.now().toString() + "r",
      role: "assistant",
      text: reply,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-4 z-[200] w-[360px] max-w-[calc(100vw-2rem)] flex flex-col rounded-3xl border border-primary/20 glass-card shadow-[0_20px_60px_-10px_rgba(191,255,255,0.25)] overflow-hidden"
            style={{ maxHeight: minimized ? "64px" : "560px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/20 to-accent/10 border-b border-primary/10">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold leading-none">
                    TripGenius AI
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground">
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-primary/10"
                  onClick={() => setMinimized(!minimized)}
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-red-500/10 hover:text-red-400"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/70 backdrop-blur-xl"
                  style={{ maxHeight: "360px" }}
                >
                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm ${
                          m.role === "assistant"
                            ? "bg-gradient-to-br from-primary to-accent"
                            : "bg-muted-foreground"
                        }`}
                      >
                        {m.role === "assistant" ? (
                          <Bot className="h-3.5 w-3.5" />
                        ) : (
                          <User className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div
                        className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                          m.role === "assistant"
                            ? "bg-card border border-primary/10 text-foreground rounded-tl-sm"
                            : "bg-gradient-to-br from-primary to-accent text-white rounded-tr-sm"
                        }`}
                      >
                        {m.text}
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2"
                    >
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                        <Bot className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div className="bg-card border border-primary/10 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Quick suggestions */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2 bg-background/70 flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-[11px] rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 hover:bg-primary/15 transition-colors text-foreground/80 font-medium"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-3 border-t border-primary/10 bg-background/80 backdrop-blur-xl flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask about travel..."
                    className="flex-1 rounded-xl border-primary/20 bg-card/80 text-sm focus-visible:ring-primary/30 h-9"
                    disabled={loading}
                  />
                  <Button
                    size="icon"
                    className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent border-0 shadow-md hover:scale-105 transition-transform"
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setOpen(!open);
          setMinimized(false);
        }}
        className="fixed bottom-6 right-4 z-[200] h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_8px_30px_rgba(191,255,255,0.35)] flex items-center justify-center text-white border-2 border-white/20"
        aria-label="Open AI Chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageCircle className="h-6 w-6" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
