import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Users,
  UserPlus,
  Mail,
  Copy,
  Check,
  Trash2,
  Crown,
  Vote,
  DollarSign,
  MessageSquare,
  MapPin,
  Calendar,
  Share2,
  PieChart,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "organizer" | "member";
  avatar: string;
  paid?: number;
}

interface Proposal {
  id: string;
  author: string;
  authorAvatar: string;
  title: string;
  description: string;
  votes: { up: string[]; down: string[] };
  createdAt: number;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
  createdAt: number;
}

interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  text: string;
  createdAt: number;
}

const AVATARS = ["🧑‍💼", "👩‍🎨", "🧑‍🔬", "👩‍🚀", "🧑‍🏫", "👩‍💻", "🧑‍🍳", "👩‍🎤"];
const COLORS = [
  "from-violet-500 to-purple-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
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

const DEMO_MEMBERS: Member[] = [
  {
    id: "u1",
    name: "You",
    email: "you@example.com",
    role: "organizer",
    avatar: "🧑‍💼",
    paid: 0,
  },
  {
    id: "u2",
    name: "Priya",
    email: "priya@example.com",
    role: "member",
    avatar: "👩‍🎨",
    paid: 0,
  },
  {
    id: "u3",
    name: "Arjun",
    email: "arjun@example.com",
    role: "member",
    avatar: "🧑‍🔬",
    paid: 0,
  },
];

const DEMO_PROPOSALS: Proposal[] = [
  {
    id: "p1",
    author: "You",
    authorAvatar: "🧑‍💼",
    title: "Visit Taj Mahal on Day 2",
    description:
      "We should visit Taj Mahal early morning (6 AM) to avoid crowds. Entry fee ~₹1,100 per person.",
    votes: { up: ["u1"], down: [] },
    createdAt: Date.now() - 3600000,
  },
  {
    id: "p2",
    author: "Priya",
    authorAvatar: "👩‍🎨",
    title: "Stay at boutique hotel in Old Delhi",
    description:
      "Found a beautiful riad-style hotel near Jama Masjid. ₹3,500/night. Rooftop terrace with city views!",
    votes: { up: ["u2", "u3"], down: [] },
    createdAt: Date.now() - 7200000,
  },
];

export default function GroupTrips() {
  const [members, setMembers] = useState<Member[]>(
    getStorage("tg_group_members", DEMO_MEMBERS),
  );
  const [proposals, setProposals] = useState<Proposal[]>(
    getStorage("tg_group_proposals", DEMO_PROPOSALS),
  );
  const [expenses, setExpenses] = useState<Expense[]>(
    getStorage("tg_group_expenses", []),
  );
  const [comments, setComments] = useState<Comment[]>(
    getStorage("tg_group_comments", []),
  );

  // Form states
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDesc, setProposalDesc] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expensePaidBy, setExpensePaidBy] = useState("u1");
  const [commentText, setCommentText] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>("members");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const groupLink = `${window.location.origin}/group/${btoa("tg_demo_group")}`;

  const save = (m: Member[], p: Proposal[], e: Expense[], c: Comment[]) => {
    setStorage("tg_group_members", m);
    setStorage("tg_group_proposals", p);
    setStorage("tg_group_expenses", e);
    setStorage("tg_group_comments", c);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(groupLink);
    setCopied(true);
    toast.success("Group invite link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const inviteMember = () => {
    if (!inviteEmail.trim() || !inviteName.trim()) {
      toast.error("Please enter both name and email");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newMember: Member = {
        id: `u${Date.now()}`,
        name: inviteName,
        email: inviteEmail,
        role: "member",
        avatar: AVATARS[members.length % AVATARS.length],
        paid: 0,
      };
      const updated = [...members, newMember];
      setMembers(updated);
      save(updated, proposals, expenses, comments);
      setInviteEmail("");
      setInviteName("");
      setLoading(false);
      toast.success(`Invited ${inviteName}! (Simulated — no email sent)`);
    }, 800);
  };

  const removeMember = (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    save(updated, proposals, expenses, comments);
    toast.info("Member removed");
  };

  const addProposal = () => {
    if (!proposalTitle.trim()) return;
    const p: Proposal = {
      id: `p${Date.now()}`,
      author: "You",
      authorAvatar: "🧑‍💼",
      title: proposalTitle,
      description: proposalDesc,
      votes: { up: [], down: [] },
      createdAt: Date.now(),
    };
    const updated = [p, ...proposals];
    setProposals(updated);
    save(members, updated, expenses, comments);
    setProposalTitle("");
    setProposalDesc("");
    toast.success("Proposal added!");
  };

  const vote = (proposalId: string, direction: "up" | "down") => {
    const updated = proposals.map((p) => {
      if (p.id !== proposalId) return p;
      const myId = "u1";
      const alreadyUp = p.votes.up.includes(myId);
      const alreadyDown = p.votes.down.includes(myId);
      if (direction === "up") {
        return {
          ...p,
          votes: {
            up: alreadyUp
              ? p.votes.up.filter((v) => v !== myId)
              : [...p.votes.up, myId],
            down: p.votes.down.filter((v) => v !== myId),
          },
        };
      } else {
        return {
          ...p,
          votes: {
            up: p.votes.up.filter((v) => v !== myId),
            down: alreadyDown
              ? p.votes.down.filter((v) => v !== myId)
              : [...p.votes.down, myId],
          },
        };
      }
    });
    setProposals(updated);
    save(members, updated, expenses, comments);
  };

  const addExpense = () => {
    if (!expenseDesc.trim() || !expenseAmount) return;
    const e: Expense = {
      id: `e${Date.now()}`,
      description: expenseDesc,
      amount: parseFloat(expenseAmount),
      paidBy: expensePaidBy,
      splitAmong: members.map((m) => m.id),
      createdAt: Date.now(),
    };
    const updatedExpenses = [e, ...expenses];
    // Update paid amounts
    const updatedMembers = members.map((m) =>
      m.id === expensePaidBy ? { ...m, paid: (m.paid || 0) + e.amount } : m,
    );
    setExpenses(updatedExpenses);
    setMembers(updatedMembers);
    save(updatedMembers, proposals, updatedExpenses, comments);
    setExpenseDesc("");
    setExpenseAmount("");
    toast.success(`Expense of ₹${e.amount} added`);
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    const c: Comment = {
      id: `c${Date.now()}`,
      author: "You",
      authorAvatar: "🧑‍💼",
      text: commentText,
      createdAt: Date.now(),
    };
    const updated = [...comments, c];
    setComments(updated);
    save(members, proposals, expenses, updated);
    setCommentText("");
  };

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const perPerson = members.length ? totalExpenses / members.length : 0;

  const toggle = (s: string) =>
    setActiveSection((prev) => (prev === s ? null : s));

  const sections = [
    { id: "members", label: "Members", icon: Users, count: members.length },
    {
      id: "proposals",
      label: "Proposals",
      icon: Vote,
      count: proposals.length,
    },
    {
      id: "expenses",
      label: "Expenses",
      icon: DollarSign,
      count: expenses.length,
    },
    {
      id: "chat",
      label: "Group Chat",
      icon: MessageSquare,
      count: comments.length,
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-primary">
            <Users className="h-4 w-4" />
            Group Trip Planner
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Plan Together,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Travel Better
            </span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Collaborate with friends and family. Vote on plans, split expenses,
            and keep everyone in the loop.
          </p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="flex items-center gap-1 rounded-xl border border-primary/20 bg-card/70 px-3 py-2 backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">Delhi → Agra → Jaipur</span>
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-primary/20 bg-card/70 px-3 py-2 backdrop-blur-md">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">Mar 15 – Mar 22</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={copyLink}
              className="h-8 gap-1.5 rounded-xl border-primary/30"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <Share2 className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied!" : "Share Group"}
            </Button>
          </div>
        </motion.div>

        {/* Member avatars strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-3"
        >
          {members.map((m, i) => (
            <div key={m.id} className="flex flex-col items-center gap-1">
              <div
                className={`h-12 w-12 rounded-full bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center text-xl shadow-md border-2 border-background`}
              >
                {m.avatar}
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">
                {m.name}
              </span>
              {m.role === "organizer" && (
                <Crown className="h-3 w-3 text-amber-400" />
              )}
            </div>
          ))}
          <button
            onClick={() => toggle("members")}
            className="h-12 w-12 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center hover:bg-primary/10 transition-colors"
          >
            <UserPlus className="h-5 w-5 text-primary/60" />
          </button>
        </motion.div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            const isOpen = activeSection === sec.id;
            return (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
              >
                <Card className="glass-card border-primary/20 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-primary/5 transition-colors"
                    onClick={() => toggle(sec.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-semibold">{sec.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {sec.count}
                      </Badge>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-primary/10">
                          {/* MEMBERS SECTION */}
                          {sec.id === "members" && (
                            <div className="space-y-4">
                              <div className="divide-y divide-primary/10">
                                {members.map((m) => (
                                  <div
                                    key={m.id}
                                    className="flex items-center justify-between py-3"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-xl">
                                        {m.avatar}
                                      </span>
                                      <div>
                                        <div className="text-sm font-semibold flex items-center gap-1.5">
                                          {m.name}
                                          {m.role === "organizer" && (
                                            <Crown className="h-3 w-3 text-amber-400" />
                                          )}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {m.email}
                                        </div>
                                      </div>
                                    </div>
                                    {m.id !== "u1" && (
                                      <button
                                        onClick={() => removeMember(m.id)}
                                        className="text-muted-foreground hover:text-red-400 transition-colors"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="space-y-2 pt-2 border-t border-primary/10">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                  Invite Member
                                </p>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Name"
                                    value={inviteName}
                                    onChange={(e) =>
                                      setInviteName(e.target.value)
                                    }
                                    className="rounded-xl border-primary/20 h-9 text-sm"
                                  />
                                  <Input
                                    placeholder="Email"
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) =>
                                      setInviteEmail(e.target.value)
                                    }
                                    className="rounded-xl border-primary/20 h-9 text-sm"
                                  />
                                  <Button
                                    size="sm"
                                    className="h-9 rounded-xl gap-1 shrink-0"
                                    onClick={inviteMember}
                                    disabled={loading}
                                  >
                                    {loading ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <Mail className="h-3.5 w-3.5" />
                                    )}
                                    Invite
                                  </Button>
                                </div>
                                <div className="flex items-center gap-2 rounded-xl border border-primary/10 bg-background/60 px-3 py-2">
                                  <span className="text-xs text-muted-foreground flex-1 truncate">
                                    {groupLink}
                                  </span>
                                  <button
                                    onClick={copyLink}
                                    className="text-primary hover:text-primary/80"
                                  >
                                    {copied ? (
                                      <Check className="h-3.5 w-3.5" />
                                    ) : (
                                      <Copy className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* PROPOSALS SECTION */}
                          {sec.id === "proposals" && (
                            <div className="space-y-4">
                              {proposals.map((p) => {
                                const myId = "u1";
                                const votedUp = p.votes.up.includes(myId);
                                const votedDown = p.votes.down.includes(myId);
                                return (
                                  <div
                                    key={p.id}
                                    className="rounded-2xl border border-primary/10 bg-background/60 p-4 space-y-3"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">
                                          {p.authorAvatar}
                                        </span>
                                        <div>
                                          <div className="text-sm font-bold">
                                            {p.title}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            by {p.author}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {p.description && (
                                      <p className="text-sm text-muted-foreground">
                                        {p.description}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={() => vote(p.id, "up")}
                                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                                          votedUp
                                            ? "border-green-500/60 bg-green-500/15 text-green-400"
                                            : "border-primary/20 bg-background/60 text-muted-foreground hover:bg-green-500/10"
                                        }`}
                                      >
                                        <ThumbsUp className="h-3.5 w-3.5" />
                                        {p.votes.up.length}
                                      </button>
                                      <button
                                        onClick={() => vote(p.id, "down")}
                                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                                          votedDown
                                            ? "border-red-500/60 bg-red-500/15 text-red-400"
                                            : "border-primary/20 bg-background/60 text-muted-foreground hover:bg-red-500/10"
                                        }`}
                                      >
                                        <ThumbsDown className="h-3.5 w-3.5" />
                                        {p.votes.down.length}
                                      </button>
                                      <div className="ml-auto text-xs text-muted-foreground">
                                        {new Date(
                                          p.createdAt,
                                        ).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              <div className="space-y-2 pt-2 border-t border-primary/10">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                  Add Proposal
                                </p>
                                <Input
                                  placeholder="Proposal title (e.g. Visit Red Fort on Day 3)"
                                  value={proposalTitle}
                                  onChange={(e) =>
                                    setProposalTitle(e.target.value)
                                  }
                                  className="rounded-xl border-primary/20 text-sm"
                                />
                                <textarea
                                  placeholder="Details (optional)"
                                  value={proposalDesc}
                                  onChange={(e) =>
                                    setProposalDesc(e.target.value)
                                  }
                                  className="flex w-full rounded-xl border border-primary/20 bg-background/60 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 min-h-[60px] resize-none"
                                />
                                <Button
                                  size="sm"
                                  className="rounded-xl"
                                  onClick={addProposal}
                                >
                                  <Vote className="h-3.5 w-3.5 mr-1.5" />
                                  Submit Proposal
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* EXPENSES SECTION */}
                          {sec.id === "expenses" && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-3 gap-3">
                                <div className="rounded-2xl border border-primary/20 bg-background/60 p-3 text-center">
                                  <div className="text-xl font-extrabold text-foreground">
                                    ₹{totalExpenses.toLocaleString()}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground mt-0.5">
                                    Total Spent
                                  </div>
                                </div>
                                <div className="rounded-2xl border border-primary/20 bg-background/60 p-3 text-center">
                                  <div className="text-xl font-extrabold text-foreground">
                                    ₹{Math.round(perPerson).toLocaleString()}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground mt-0.5">
                                    Per Person
                                  </div>
                                </div>
                                <div className="rounded-2xl border border-primary/20 bg-background/60 p-3 text-center">
                                  <div className="text-xl font-extrabold text-foreground">
                                    {expenses.length}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground mt-0.5">
                                    Transactions
                                  </div>
                                </div>
                              </div>

                              {expenses.length > 0 && (
                                <div className="divide-y divide-primary/10">
                                  {expenses.map((e) => {
                                    const payer = members.find(
                                      (m) => m.id === e.paidBy,
                                    );
                                    return (
                                      <div
                                        key={e.id}
                                        className="flex items-center justify-between py-2.5"
                                      >
                                        <div>
                                          <div className="text-sm font-semibold">
                                            {e.description}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            Paid by {payer?.name ?? "Unknown"} •
                                            split {members.length} ways
                                          </div>
                                        </div>
                                        <span className="font-bold text-sm text-primary">
                                          ₹{e.amount.toLocaleString()}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              <div className="space-y-2 pt-2 border-t border-primary/10">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                  Log Expense
                                </p>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Description"
                                    value={expenseDesc}
                                    onChange={(e) =>
                                      setExpenseDesc(e.target.value)
                                    }
                                    className="rounded-xl border-primary/20 text-sm"
                                  />
                                  <Input
                                    placeholder="Amount (₹)"
                                    type="number"
                                    value={expenseAmount}
                                    onChange={(e) =>
                                      setExpenseAmount(e.target.value)
                                    }
                                    className="rounded-xl border-primary/20 text-sm w-32 shrink-0"
                                  />
                                </div>
                                <select
                                  value={expensePaidBy}
                                  onChange={(e) =>
                                    setExpensePaidBy(e.target.value)
                                  }
                                  className="w-full rounded-xl border border-primary/20 bg-card/70 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                                >
                                  {members.map((m) => (
                                    <option key={m.id} value={m.id}>
                                      {m.name} paid
                                    </option>
                                  ))}
                                </select>
                                <Button
                                  size="sm"
                                  className="rounded-xl"
                                  onClick={addExpense}
                                >
                                  <PieChart className="h-3.5 w-3.5 mr-1.5" />
                                  Add Expense
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* CHAT SECTION */}
                          {sec.id === "chat" && (
                            <div className="space-y-4">
                              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                {comments.length === 0 && (
                                  <p className="text-center text-sm text-muted-foreground py-4">
                                    No messages yet. Start the conversation!
                                  </p>
                                )}
                                {comments.map((c) => (
                                  <div key={c.id} className="flex gap-2">
                                    <span className="text-xl shrink-0">
                                      {c.authorAvatar}
                                    </span>
                                    <div className="bg-card/80 border border-primary/10 rounded-2xl rounded-tl-sm px-3 py-2 flex-1">
                                      <div className="text-xs font-semibold text-primary mb-0.5">
                                        {c.author}
                                      </div>
                                      <div className="text-sm">{c.text}</div>
                                      <div className="text-[10px] text-muted-foreground mt-1">
                                        {new Date(
                                          c.createdAt,
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2 pt-2 border-t border-primary/10">
                                <Input
                                  placeholder="Message your group..."
                                  value={commentText}
                                  onChange={(e) =>
                                    setCommentText(e.target.value)
                                  }
                                  onKeyDown={(e) =>
                                    e.key === "Enter" && addComment()
                                  }
                                  className="rounded-xl border-primary/20 text-sm"
                                />
                                <Button
                                  size="sm"
                                  className="rounded-xl shrink-0"
                                  onClick={addComment}
                                >
                                  <MessageSquare className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
