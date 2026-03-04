import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  AlertTriangle,
  ShieldCheck,
  Heart,
  UserPlus,
  Trash2,
  Globe2,
  Search,
  ExternalLink,
  CheckCircle2,
  Circle,
  Truck as Ambulance,
  Flame as Fire,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email?: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

const COUNTRY_EMERGENCIES: Record<
  string,
  {
    police: string;
    ambulance: string;
    fire: string;
    tourist?: string;
    flag: string;
  }
> = {
  India: {
    police: "100",
    ambulance: "108",
    fire: "101",
    tourist: "1363",
    flag: "🇮🇳",
  },
  USA: { police: "911", ambulance: "911", fire: "911", flag: "🇺🇸" },
  UK: {
    police: "999",
    ambulance: "999",
    fire: "999",
    tourist: "020 7230 1212",
    flag: "🇬🇧",
  },
  France: {
    police: "17",
    ambulance: "15",
    fire: "18",
    tourist: "08 92 70 23 72",
    flag: "🇫🇷",
  },
  Japan: { police: "110", ambulance: "119", fire: "119", flag: "🇯🇵" },
  Australia: { police: "000", ambulance: "000", fire: "000", flag: "🇦🇺" },
  Germany: { police: "110", ambulance: "112", fire: "112", flag: "🇩🇪" },
  Thailand: {
    police: "191",
    ambulance: "1669",
    fire: "199",
    tourist: "1155",
    flag: "🇹🇭",
  },
  Italy: { police: "113", ambulance: "118", fire: "115", flag: "🇮🇹" },
  Spain: { police: "091", ambulance: "112", fire: "080", flag: "🇪🇸" },
  Singapore: { police: "999", ambulance: "995", fire: "995", flag: "🇸🇬" },
  Canada: { police: "911", ambulance: "911", fire: "911", flag: "🇨🇦" },
  UAE: {
    police: "999",
    ambulance: "998",
    fire: "997",
    tourist: "800 4438",
    flag: "🇦🇪",
  },
  Brazil: { police: "190", ambulance: "192", fire: "193", flag: "🇧🇷" },
  "New Zealand": { police: "111", ambulance: "111", fire: "111", flag: "🇳🇿" },
};

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "c1", label: "Travel insurance purchased & active", checked: false },
  { id: "c2", label: "Passport copy stored in cloud", checked: false },
  { id: "c3", label: "Emergency contacts saved offline", checked: false },
  { id: "c4", label: "Hotel address & phone saved", checked: false },
  {
    id: "c5",
    label: "Local SIM card or roaming plan activated",
    checked: false,
  },
  { id: "c6", label: "Nearest hospital noted", checked: false },
  { id: "c7", label: "Embassy/consulate phone number saved", checked: false },
  {
    id: "c8",
    label: "Prescription medicines packed (extra supply)",
    checked: false,
  },
  { id: "c9", label: "Emergency cash in local currency", checked: false },
  { id: "c10", label: "Shared itinerary with someone at home", checked: false },
];

function getStorage<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, val: T) {
  localStorage.setItem(key, JSON.stringify(val));
}

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(
    getStorage("tg_emergency_contacts", []),
  );
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    getStorage("tg_safety_checklist", DEFAULT_CHECKLIST),
  );
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("India");

  const filtered = useMemo(() => {
    if (!search) return Object.entries(COUNTRY_EMERGENCIES);
    const q = search.toLowerCase();
    return Object.entries(COUNTRY_EMERGENCIES).filter(([c]) =>
      c.toLowerCase().includes(q),
    );
  }, [search]);

  const current = COUNTRY_EMERGENCIES[selectedCountry];

  const addContact = () => {
    if (!name || !phone) {
      toast.error("Name and phone are required");
      return;
    }
    const c: EmergencyContact = {
      id: Date.now().toString(),
      name,
      relation,
      phone,
      email,
    };
    const updated = [...contacts, c];
    setContacts(updated);
    setStorage("tg_emergency_contacts", updated);
    setName("");
    setRelation("");
    setPhone("");
    setEmail("");
    toast.success("Emergency contact saved");
  };

  const removeContact = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    setStorage("tg_emergency_contacts", updated);
  };

  const toggleCheck = (id: string) => {
    const updated = checklist.map((c) =>
      c.id === id ? { ...c, checked: !c.checked } : c,
    );
    setChecklist(updated);
    setStorage("tg_safety_checklist", updated);
  };

  const checkedCount = checklist.filter((c) => c.checked).length;
  const safetyScore = Math.round((checkedCount / checklist.length) * 100);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 px-4 py-1.5 text-sm font-semibold text-red-400">
            <ShieldCheck className="h-4 w-4" />
            Travel Safety Hub
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Stay Safe,{" "}
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Wherever You Go
            </span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Emergency numbers for every country, personal contacts, and a
            pre-trip safety checklist.
          </p>
        </motion.div>

        {/* Safety Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-primary/20 overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center gap-5">
                <div className="relative h-20 w-20 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke={
                        safetyScore >= 80
                          ? "#22c55e"
                          : safetyScore >= 50
                            ? "#f59e0b"
                            : "#ef4444"
                      }
                      strokeWidth="3"
                      strokeDasharray={`${safetyScore} ${100 - safetyScore}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-extrabold">
                      {safetyScore}%
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Travel Safety Score</h3>
                  <p className="text-sm text-muted-foreground">
                    {checkedCount} of {checklist.length} safety items completed
                  </p>
                  <div className="mt-2">
                    <Badge
                      className={`text-xs font-semibold ${
                        safetyScore >= 80
                          ? "bg-green-500/15 text-green-400 border-green-500/30"
                          : safetyScore >= 50
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                            : "bg-red-500/15 text-red-400 border-red-500/30"
                      } border`}
                    >
                      {safetyScore >= 80
                        ? "✅ Well Prepared"
                        : safetyScore >= 50
                          ? "⚠️ Needs Attention"
                          : "🚨 Not Ready"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Country Emergency Numbers */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="glass-card border-primary/20 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe2 className="h-4 w-4 text-primary" />
                  Emergency Numbers by Country
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search country..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9 rounded-xl border-primary/20 text-sm"
                  />
                </div>
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {filtered.map(([country, info]) => (
                    <button
                      key={country}
                      onClick={() => setSelectedCountry(country)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                        selectedCountry === country
                          ? "border-primary/40 bg-primary/10"
                          : "border-primary/10 bg-background/40 hover:bg-primary/5"
                      }`}
                    >
                      <span className="text-xl">{info.flag}</span>
                      <span className="text-sm font-semibold flex-1">
                        {country}
                      </span>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>🚔 {info.police}</span>
                        <span>🚑 {info.ambulance}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Selected Country Detail */}
                {current && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 space-y-3 mt-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <span className="text-xl">{current.flag}</span>
                      {selectedCountry} — Emergency Numbers
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          label: "Police",
                          number: current.police,
                          icon: Building2,
                          color: "text-blue-400",
                        },
                        {
                          label: "Ambulance",
                          number: current.ambulance,
                          icon: Ambulance,
                          color: "text-red-400",
                        },
                        {
                          label: "Fire",
                          number: current.fire,
                          icon: Fire,
                          color: "text-orange-400",
                        },
                        ...(current.tourist
                          ? [
                              {
                                label: "Tourist Hotline",
                                number: current.tourist,
                                icon: Phone,
                                color: "text-green-400",
                              },
                            ]
                          : []),
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.label}
                            href={`tel:${item.number}`}
                            className="flex items-center gap-2 rounded-xl border border-primary/10 bg-background/60 px-3 py-2.5 hover:bg-primary/5 transition-colors"
                          >
                            <Icon className={`h-4 w-4 ${item.color}`} />
                            <div>
                              <div className="text-[10px] text-muted-foreground">
                                {item.label}
                              </div>
                              <div className="text-sm font-bold">
                                {item.number}
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                    <a
                      href={`https://travel.state.gov/content/travel/en/international-travel/before-you-go/travelers-with-special-considerations/US-Travelers-in-${selectedCountry.replace(" ", "-")}.html`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      US State Dept travel advisory for {selectedCountry}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Personal Emergency Contacts */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Heart className="h-4 w-4 text-red-400" />
                    Personal Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contacts.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-3">
                      No contacts saved yet. Add your emergency contacts below.
                    </p>
                  )}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {contacts.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-primary/10 bg-background/60 px-3 py-2.5"
                      >
                        <div>
                          <div className="text-sm font-semibold">{c.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {c.relation && `${c.relation} • `}
                            {c.phone}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${c.phone}`}
                            className="h-7 w-7 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center hover:bg-green-500/25 transition-colors"
                          >
                            <Phone className="h-3 w-3 text-green-400" />
                          </a>
                          <button
                            onClick={() => removeContact(c.id)}
                            className="h-7 w-7 rounded-full hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-primary/10">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-xl border-primary/20 h-9 text-sm"
                      />
                      <Input
                        placeholder="Relation (e.g. Mom)"
                        value={relation}
                        onChange={(e) => setRelation(e.target.value)}
                        className="rounded-xl border-primary/20 h-9 text-sm"
                      />
                      <Input
                        placeholder="Phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="rounded-xl border-primary/20 h-9 text-sm"
                      />
                      <Input
                        placeholder="Email (optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-xl border-primary/20 h-9 text-sm"
                      />
                    </div>
                    <Button
                      size="sm"
                      className="rounded-xl w-full"
                      onClick={addContact}
                    >
                      <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                      Save Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Safety Checklist */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="glass-card border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    Pre-Trip Safety Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {checklist.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                          item.checked
                            ? "border-green-500/30 bg-green-500/5 text-foreground"
                            : "border-primary/10 bg-background/40 hover:bg-primary/5 text-muted-foreground"
                        }`}
                      >
                        {item.checked ? (
                          <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                        )}
                        <span
                          className={`text-sm ${item.checked ? "line-through text-muted-foreground" : ""}`}
                        >
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
