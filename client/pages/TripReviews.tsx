import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Plus,
  MapPin,
  ThumbsUp,
  Trash2,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  destination: string;
  rating: number;
  title: string;
  content: string;
  tags: string[];
  helpful: number;
  createdAt: number;
}

const SUGGESTED_TAGS = [
  "Beautiful",
  "Budget-friendly",
  "Must visit",
  "Overrated",
  "Hidden gem",
  "Family-friendly",
  "Solo-friendly",
  "Romantic",
  "Adventurous",
  "Foodie paradise",
];

const STORAGE_KEY = "tg_reviews";

function load(): Review[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}
function save(r: Review[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
}

export default function TripReviews() {
  const [reviews, setReviews] = useState<Review[]>(load);
  const [writing, setWriting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    destination: "",
    rating: 5,
    title: "",
    content: "",
    tags: [] as string[],
  });

  const toggleTag = (t: string) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t],
    }));

  const handleSave = () => {
    if (
      !form.destination.trim() ||
      !form.content.trim() ||
      !form.title.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const review: Review = {
      id: `rv_${Date.now()}`,
      ...form,
      helpful: 0,
      createdAt: Date.now(),
    };
    const updated = [review, ...reviews];
    setReviews(updated);
    save(updated);
    setForm({ destination: "", rating: 5, title: "", content: "", tags: [] });
    setWriting(false);
    toast.success("⭐ Review posted!");
  };

  const handleHelpful = (id: string) => {
    const updated = reviews.map((r) =>
      r.id === id ? { ...r, helpful: r.helpful + 1 } : r,
    );
    setReviews(updated);
    save(updated);
    toast.success("Marked as helpful!");
  };

  const handleDelete = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);
    save(updated);
    toast.success("Review deleted");
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

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
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight gradient-text flex items-center gap-2">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />{" "}
                Trip Reviews
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-muted-foreground">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </span>
                {reviews.length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs gap-1 border-yellow-500/30 text-yellow-400"
                  >
                    ⭐ {avgRating} avg rating
                  </Badge>
                )}
              </div>
            </div>
            <Button
              onClick={() => setWriting((w) => !w)}
              className={`gap-2 font-bold transition-all shrink-0 ${writing ? "bg-muted text-muted-foreground border border-muted-foreground/20" : "bg-gradient-to-r from-primary to-accent border-0 text-white shadow-lg"}`}
            >
              {writing ? (
                "Cancel"
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Write Review
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Write form */}
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
                    <Globe className="h-4 w-4 text-primary" /> Review a
                    Destination
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> Destination *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Tokyo, Japan"
                        value={form.destination}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            destination: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-primary/20 bg-background/70 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" /> Rating
                      </label>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            onClick={() =>
                              setForm((f) => ({ ...f, rating: n }))
                            }
                            className={`text-2xl transition-all hover:scale-110 ${n <= form.rating ? "text-yellow-400" : "text-muted/40"}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Review Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Sum up your experience in one line"
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                      className="w-full rounded-xl border border-primary/20 bg-background/70 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Your Review *
                    </label>
                    <textarea
                      placeholder="Share what made this destination special (or not!)..."
                      value={form.content}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, content: e.target.value }))
                      }
                      className="w-full min-h-[100px] resize-none rounded-xl border border-primary/20 bg-background/70 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Tags (optional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`text-xs px-3 py-1 rounded-full border transition-all ${form.tags.includes(tag) ? "border-primary/50 bg-primary/20 text-primary" : "border-primary/15 bg-background/60 text-muted-foreground hover:border-primary/30"}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={handleSave}
                    className="w-full gap-2 bg-gradient-to-r from-primary to-accent border-0 text-white font-bold hover:scale-[1.02] transition-transform"
                  >
                    <Star className="h-4 w-4 fill-white" /> Post Review
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review cards */}
        {reviews.length === 0 ? (
          <Card className="glass-card border-primary/20 text-center">
            <CardContent className="py-16 space-y-3">
              <div className="text-5xl">🌍</div>
              <p className="font-semibold text-foreground">No reviews yet</p>
              <p className="text-sm text-muted-foreground">
                Share your travel experiences with the community!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, i) => {
              const expanded = expandedId === review.id;
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card className="glass-card border-primary/20 overflow-hidden group hover:border-primary/40 transition-all">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="flex">
                              {Array.from({ length: 5 }, (_, j) => (
                                <span
                                  key={j}
                                  className={`text-sm ${j < review.rating ? "text-yellow-400" : "text-muted/30"}`}
                                >
                                  ★
                                </span>
                              ))}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 border-primary/20 flex items-center gap-0.5"
                            >
                              <MapPin className="h-2.5 w-2.5" />{" "}
                              {review.destination}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground ml-auto">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                          <p className="font-bold text-sm text-foreground">
                            {review.title}
                          </p>
                          <p
                            className={`text-sm text-muted-foreground mt-1 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}
                          >
                            {review.content}
                          </p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() =>
                              setExpandedId(expanded ? null : review.id)
                            }
                            className="rounded-lg p-1.5 hover:bg-primary/10 text-muted-foreground transition-colors"
                          >
                            {expanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="rounded-lg p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {review.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {review.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded-full border border-accent/25 bg-accent/10 text-accent font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2 pt-1 border-t border-primary/10">
                        <button
                          onClick={() => handleHelpful(review.id)}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group/helpful"
                        >
                          <ThumbsUp className="h-3.5 w-3.5 group-hover/helpful:fill-primary group-hover/helpful:text-primary transition-colors" />
                          Helpful ({review.helpful})
                        </button>
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
