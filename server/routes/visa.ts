import { RequestHandler } from "express";

const RULES: Record<string, Record<string, { visa: string; notes?: string }>> = {
  IN: {
    US: { visa: "Required", notes: "Apply for B1/B2; check earliest appointment windows." },
    TH: { visa: "Visa on Arrival", notes: "Confirm e‑VOA option and fees." },
    ID: { visa: "Visa on Arrival", notes: "Available at major airports; proof of onward travel required." },
    AE: { visa: "E‑visa", notes: "Airline/agency facilitation available; ensure passport validity 6+ months." },
  },
  US: {
    IN: { visa: "E‑visa", notes: "Tourist e‑visa categories; apply online in advance." },
    CA: { visa: "Not required", notes: "NEXUS/ESTA analogs not applicable; check eTA when flying." },
    MX: { visa: "Not required", notes: "Tourist entry with passport; FMM form at entry." },
  },
};

export const visaCheck: RequestHandler = (req, res) => {
  const from = String(req.query.from || "").toUpperCase();
  const to = String(req.query.to || "").toUpperCase();
  if (!from || !to) return res.status(400).json({ error: "Missing from/to" });
  const rule = RULES[from]?.[to];
  if (!rule) return res.json({ from, to, visa: "Check embassy", notes: "Rules vary; verify with official sources." });
  res.json({ from, to, ...rule });
};
