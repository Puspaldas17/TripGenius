import { Sparkles } from "lucide-react";

export function ProBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-200 to-yellow-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-950 shadow-sm border border-amber-300 ml-2 animate-pulse cursor-help"
      title="TripGenius Pro Feature"
    >
      <Sparkles className="h-3 w-3" />
      PRO
    </span>
  );
}
