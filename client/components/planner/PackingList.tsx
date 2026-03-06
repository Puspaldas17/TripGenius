import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  CheckCircle2,
  Circle,
  RefreshCw,
  Plus,
  Trash2,
  Shirt,
  Droplets,
  FileText,
  Heart,
  Smartphone,
  Backpack,
  Weight,
} from "lucide-react";
import { toast } from "sonner";

interface PackingItem {
  id: string;
  label: string;
  category: string;
  checked: boolean;
  custom?: boolean;
  weight?: number; // grams
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const CATEGORIES: Category[] = [
  {
    id: "clothes",
    label: "Clothes",
    icon: <Shirt className="h-4 w-4" />,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "toiletries",
    label: "Toiletries",
    icon: <Droplets className="h-4 w-4" />,
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    id: "documents",
    label: "Documents",
    icon: <FileText className="h-4 w-4" />,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "health",
    label: "Health",
    icon: <Heart className="h-4 w-4" />,
    color: "text-red-400 bg-red-500/10 border-red-500/20",
  },
  {
    id: "tech",
    label: "Tech",
    icon: <Smartphone className="h-4 w-4" />,
    color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  },
  {
    id: "gear",
    label: "Gear",
    icon: <Backpack className="h-4 w-4" />,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
];

type TripProfile = {
  destination?: string;
  days?: number;
  mood?: string;
  weather?: { temp?: number } | null;
};

function generateList(profile: TripProfile): PackingItem[] {
  const { days = 5, mood = "adventure", weather } = profile;
  const cold = (weather?.temp ?? 25) < 15;
  const beach =
    mood === "relaxation" ||
    (profile.destination ?? "").toLowerCase().includes("bali") ||
    (profile.destination ?? "").toLowerCase().includes("goa");
  const business = mood === "business";
  const long = days > 7;

  const base: [string, string, number][] = [
    // [label, category, weight_grams]
    // Clothes
    [`Underwear (${Math.min(days, 7)} pairs)`, "clothes", 200],
    [`T-Shirts (${Math.min(days, 5)})`, "clothes", 500],
    [
      business ? "Formal shirt (3)" : beach ? "Shorts (3)" : "Casual pants (2)",
      "clothes",
      600,
    ],
    ["Comfortable shoes", "clothes", 800],
    ...(cold
      ? [
          ["Warm jacket", "clothes", 900] as [string, string, number],
          ["Thermal undershirt", "clothes", 250] as [string, string, number],
        ]
      : []),
    ...(beach
      ? [
          ["Swimsuit / Beachwear", "clothes", 200] as [string, string, number],
          ["Flip flops", "clothes", 300] as [string, string, number],
        ]
      : []),
    ...(business
      ? [
          ["Formal trousers", "clothes", 500] as [string, string, number],
          ["Belt & tie", "clothes", 200] as [string, string, number],
        ]
      : []),
    ["Pyjama / sleepwear", "clothes", 300],
    ...(long
      ? [["Laundry bag", "clothes", 100] as [string, string, number]]
      : []),
    // Toiletries
    ["Toothbrush & toothpaste", "toiletries", 150],
    ["Shampoo & conditioner", "toiletries", 300],
    ["Deodorant", "toiletries", 100],
    ["Razor / shaver", "toiletries", 200],
    ["Sunscreen SPF 50+", "toiletries", 200],
    ...(beach
      ? [["After-sun lotion", "toiletries", 200] as [string, string, number]]
      : []),
    ["Body wash / soap", "toiletries", 200],
    ["Moisturiser", "toiletries", 100],
    // Documents
    ["Passport + 2 photocopies", "documents", 50],
    ["Visa documents / e-Visa screenshot", "documents", 20],
    ["Travel insurance card", "documents", 10],
    ["Booking confirmations (hotel, flights)", "documents", 20],
    ["Emergency contact list (printed)", "documents", 10],
    ["International driving licence (if needed)", "documents", 30],
    // Health
    ["Personal medications (+ extra 3 days)", "health", 200],
    ["Pain reliever (paracetamol)", "health", 100],
    ["Antiseptic wipes / first aid", "health", 100],
    ["Hand sanitiser", "health", 100],
    ["Motion sickness tablets", "health", 50],
    ...(beach
      ? [["Mosquito repellent", "health", 150] as [string, string, number]]
      : []),
    // Tech
    ["Phone + charger", "tech", 300],
    ["Power bank (10,000+ mAh)", "tech", 250],
    ["Universal power adapter", "tech", 200],
    ["Earphones / AirPods", "tech", 100],
    ["Laptop / tablet + charger", "tech", 1500],
    ["Camera + memory card", "tech", 500],
    ["Downloaded offline maps (Google Maps)", "tech", 0],
    // Gear
    ["Backpack / day bag", "gear", 700],
    ["Padlock for luggage", "gear", 150],
    ["Microfibre towel", "gear", 200],
    ["Reusable water bottle", "gear", 300],
    ["Travel pillow (for long flights)", "gear", 250],
    ...(cold
      ? [["Gloves & beanie", "gear", 200] as [string, string, number]]
      : []),
    ...(beach
      ? [
          ["Beach bag / dry bag", "gear", 200] as [string, string, number],
          ["Snorkelling set", "gear", 500] as [string, string, number],
        ]
      : []),
  ];

  return base.map(([label, category, weight], i) => ({
    id: `gen_${i}`,
    label,
    category,
    weight,
    checked: false,
  }));
}

function getStorageKey(destination: string) {
  return `tg_packing_${destination.replace(/\s+/g, "_").toLowerCase()}`;
}

interface PackingListProps {
  destination?: string;
  days?: number;
  mood?: string;
  weather?: { temp?: number } | null;
}

export default function PackingList({
  destination = "Your Trip",
  days = 5,
  mood = "adventure",
  weather,
}: PackingListProps) {
  const storageKey = getStorageKey(destination);

  const generated = useMemo(
    () => generateList({ destination, days, mood, weather }),
    [destination, days, mood, weather],
  );

  const [items, setItems] = useState<PackingItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : generated;
    } catch {
      return generated;
    }
  });

  const [newItem, setNewItem] = useState("");
  const [newItemCat, setNewItemCat] = useState("gear");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)),
    );
  };

  const addCustom = () => {
    if (!newItem.trim()) return;
    const item: PackingItem = {
      id: `custom_${Date.now()}`,
      label: newItem.trim(),
      category: newItemCat,
      checked: false,
      custom: true,
    };
    setItems((prev) => [...prev, item]);
    setNewItem("");
    toast.success("Item added to packing list");
  };

  const removeCustom = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const regenerate = () => {
    setItems(generated);
    toast.success("Packing list regenerated based on your trip profile!");
  };

  const grouped = useMemo(() => {
    const g: Record<string, PackingItem[]> = {};
    CATEGORIES.forEach((c) => {
      g[c.id] = items.filter((it) => it.category === c.id);
    });
    return g;
  }, [items]);

  const totalChecked = items.filter((it) => it.checked).length;
  const totalItems = items.length;
  const progress = totalItems
    ? Math.round((totalChecked / totalItems) * 100)
    : 0;
  const totalWeight = items
    .filter((it) => it.checked)
    .reduce((s, it) => s + (it.weight ?? 0), 0);

  const filteredCats = activeCategory
    ? CATEGORIES.filter((c) => c.id === activeCategory)
    : CATEGORIES;

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="h-4 w-4 text-primary" />
          Smart Packing List
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            {totalChecked}/{totalItems} packed
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress + Weight */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress}% packed</span>
            <span className="flex items-center gap-1">
              <Weight className="h-3 w-3" />~{(totalWeight / 1000).toFixed(1)}{" "}
              kg packed
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-primary to-accent"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <p className="text-xs text-green-400 font-semibold text-center">
              ✅ You're fully packed — ready to fly!
            </p>
          )}
        </div>

        {/* Category Filter + Regenerate */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all font-semibold ${
              !activeCategory
                ? "border-primary/60 bg-primary/15 text-primary"
                : "border-primary/20 bg-background/40 text-muted-foreground hover:bg-primary/5"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                setActiveCategory(activeCategory === c.id ? null : c.id)
              }
              className={`text-xs px-2.5 py-1 rounded-full border transition-all font-semibold ${
                activeCategory === c.id
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-primary/20 bg-background/40 text-muted-foreground hover:bg-primary/5"
              }`}
            >
              {c.label}
            </button>
          ))}
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto h-7 text-xs gap-1 text-muted-foreground hover:text-primary"
            onClick={regenerate}
          >
            <RefreshCw className="h-3 w-3" />
            Regenerate
          </Button>
        </div>

        {/* Items by Category */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {filteredCats.map((cat) => {
            const catItems = grouped[cat.id] ?? [];
            if (!catItems.length) return null;
            const catChecked = catItems.filter((it) => it.checked).length;
            return (
              <div key={cat.id}>
                <div
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border text-xs font-bold mb-1.5 ${cat.color}`}
                >
                  {cat.icon}
                  {cat.label}
                  <span className="ml-auto opacity-60">
                    {catChecked}/{catItems.length}
                  </span>
                </div>
                <div className="space-y-1 pl-2">
                  <AnimatePresence>
                    {catItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 group"
                      >
                        <button
                          onClick={() => toggle(item.id)}
                          className="shrink-0"
                        >
                          {item.checked ? (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground/40 hover:text-primary/50 transition-colors" />
                          )}
                        </button>
                        <span
                          className={`text-sm flex-1 transition-all ${
                            item.checked
                              ? "line-through text-muted-foreground/50"
                              : "text-foreground"
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.weight ? (
                          <span className="text-[10px] text-muted-foreground/40">
                            {item.weight}g
                          </span>
                        ) : null}
                        {item.custom && (
                          <button
                            onClick={() => removeCustom(item.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add custom item */}
        <div className="flex gap-2 pt-2 border-t border-primary/10">
          <Input
            placeholder="Add item (e.g. Sunglasses)"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            className="rounded-xl border-primary/20 h-9 text-sm flex-1"
          />
          <select
            value={newItemCat}
            onChange={(e) => setNewItemCat(e.target.value)}
            className="rounded-xl border border-primary/20 bg-card/70 px-2 py-1 text-xs focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            className="h-9 rounded-xl shrink-0"
            onClick={addCustom}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Trip Profile badge */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-primary/10">
          <Badge className="text-[10px] bg-primary/10 text-primary border border-primary/20">
            📍 {destination}
          </Badge>
          <Badge className="text-[10px] bg-primary/10 text-primary border border-primary/20">
            🗓️ {days} days
          </Badge>
          <Badge className="text-[10px] bg-primary/10 text-primary border border-primary/20">
            ✨ {mood}
          </Badge>
          {weather?.temp !== undefined && (
            <Badge className="text-[10px] bg-primary/10 text-primary border border-primary/20">
              🌡️ {weather.temp}°C
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
