import { RequestHandler } from "express";

type Client = { id: string; res: any };
const rooms = new Map<string, Set<Client>>();
const history = new Map<string, any[]>();

export const collabSubscribe: RequestHandler = (req, res) => {
  const room = String(req.query.room || "").trim();
  if (!room) return res.status(400).end();
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
  const id = Math.random().toString(36).slice(2);
  const set = rooms.get(room) || new Set<Client>();
  set.add({ id, res });
  rooms.set(room, set);
  const hist = history.get(room) || [];
  if (hist.length) res.write(`data: ${JSON.stringify({ type: "history", payload: hist })}\n\n`);
  const keep = setInterval(() => res.write(`: keepalive\n\n`), 15000);
  req.on("close", () => {
    clearInterval(keep);
    const s = rooms.get(room);
    if (s) {
      for (const c of s) if (c.id === id) s.delete(c);
      if (!s.size) rooms.delete(room);
    }
  });
};

export const collabPublish: RequestHandler = (req, res) => {
  const { room, message } = req.body ?? {};
  const r = String(room || "").trim();
  if (!r || !message) return res.status(400).json({ error: "Missing room/message" });
  const evt = { id: Date.now(), type: "message", payload: message };
  const s = rooms.get(r);
  const hist = history.get(r) || [];
  hist.push(evt);
  while (hist.length > 100) hist.shift();
  history.set(r, hist);
  if (s) for (const c of s) c.res.write(`data: ${JSON.stringify(evt)}\n\n`);
  res.json({ ok: true });
};
