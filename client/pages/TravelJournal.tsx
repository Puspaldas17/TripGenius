import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Save,
  Edit2,
  ChevronDown,
  ChevronUp,
  Smile,
  Cloud,
  Sun,
} from "lucide-react";
import { toast } from "sonner";

type Mood = "😄" | "😊" | "😐" | "😴" | "😤";

const MOODS: Mood[] = ["😄", "😊", "😐", "😴", "😤"];
const MOOD_LABELS: Record<Mood, string> = {
  "😄": "Amazing!",
  "😊": "Good",
  "😐": "Okay",
  "😴": "Tired",
  "😤": "Stressful",
};

interface JournalEntry {
  id: string;
  date: string;
  location: string;
  mood: Mood;
  content: string;
  weather?: string;
  photos?: number;
  createdAt: number;
}

const STORAGE_KEY = "tg_travel_journal";

function loadEntries(): JournalEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export default function TravelJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(loadEntries);
  const [writing, setWriting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    location: "",
    mood: "😊" as Mood,
    content: "",
    weather: "",
  });

  const handleSave = () => {
    if (!form.content.trim() || !form.location.trim()) {
      toast.error("Please fill in your location and journal entry.");
      return;
    }
    const entry: JournalEntry = {
      id: `je_${Date.now()}`,
      date: form.date,
      location: form.location,
      mood: form.mood,
      content: form.content,
      weather: form.weather,
      createdAt: Date.now(),
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    saveEntries(updated);
    setForm({
      date: new Date().toISOString().split("T")[0],
      location: "",
      mood: "😊",
      content: "",
      weather: "",
    });
    setWriting(false);
    toast.success("✍️ Journal entry saved!");
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveEntries(updated);
    toast.success("Entry deleted");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl glass-card border border-primary/20 p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight gradient-text flex items-center gap-2">
                <BookOpen className="h-6 w-6" /> Travel Journal
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {entries.length} {entries.length === 1 ? "memory" : "memories"}{" "}
                captured
              </p>
            </div>
            <Button
              onClick={() => setWriting((w) => !w)}
              className={`gap-2 font-bold transition-all ${writing ? "bg-muted text-muted-foreground border border-muted-foreground/20" : "bg-gradient-to-r from-primary to-accent border-0 text-white shadow-lg"}`}
            >
              {writing ? (
                "Cancel"
              ) : (
                <>
                  <Plus className="h-4 w-4" /> New Entry
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* New entry form */}
        <AnimatePresence>
          {writing && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <Card className="glass-card border-primary/30 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Edit2 className="h-4 w-4 text-primary" /> Write Today's
                    Memory
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Date
                      </label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, date: e.target.value }))
                        }
                        className="w-full rounded-xl border border-primary/20 bg-background/70 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> Location
                      </label>
                      <input
                        type="text"
                        placeholder="Where are you?"
                        value={form.location}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, location: e.target.value }))
                        }
                        className="w-full rounded-xl border border-primary/20 bg-background/70 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <Smile className="h-3.5 w-3.5" /> Today's Mood
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {MOODS.map((m) => (
                          <button
                            key={m}
                            onClick={() => setForm((f) => ({ ...f, mood: m }))}
                            className={`text-xl p-1.5 rounded-xl transition-all ${form.mood === m ? "bg-primary/20 ring-2 ring-primary scale-110" : "hover:bg-muted/60"}`}
                            title={MOOD_LABELS[m]}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <Cloud className="h-3.5 w-3.5" /> Weather (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sunny, 28°C"
                        value={form.weather}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, weather: e.target.value }))
                        }
                        className="w-full rounded-xl border border-primary/20 bg-background/70 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      ✍️ Your Memory
                    </label>
                    <textarea
                      placeholder="What happened today? What did you see, eat, or feel? Write freely..."
                      value={form.content}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, content: e.target.value }))
                      }
                      className="w-full min-h-[120px] resize-none rounded-xl border border-primary/20 bg-background/70 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <Button
                    onClick={handleSave}
                    className="w-full gap-2 bg-gradient-to-r from-primary to-accent border-0 text-white font-bold hover:scale-[1.02] transition-transform"
                  >
                    <Save className="h-4 w-4" /> Save Memory
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entries list */}
        {entries.length === 0 ? (
          <Card className="glass-card border-primary/20 text-center">
            <CardContent className="py-16 space-y-3">
              <div className="text-5xl">📓</div>
              <p className="font-semibold text-foreground">
                Your journal is empty
              </p>
              <p className="text-sm text-muted-foreground">
                Start writing memories from your travels!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, i) => {
              const expanded = expandedId === entry.id;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card className="glass-card border-primary/20 overflow-hidden group hover:border-primary/40 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl shrink-0">{entry.mood}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-bold text-sm text-foreground">
                                {entry.location}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />{" "}
                                  {new Date(entry.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )}
                                </span>
                                {entry.weather && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Sun className="h-3 w-3" /> {entry.weather}
                                  </span>
                                )}
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 h-4 border-primary/20 text-muted-foreground"
                                >
                                  {MOOD_LABELS[entry.mood]}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() =>
                                  setExpandedId(expanded ? null : entry.id)
                                }
                                className="rounded-lg p-1.5 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                              >
                                {expanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="rounded-lg p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <p
                            className={`text-sm text-muted-foreground mt-2 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}
                          >
                            {entry.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
