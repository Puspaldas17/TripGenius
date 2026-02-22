import { RequestHandler } from "express";

export const convertCurrency: RequestHandler = async (req, res) => {
  const amount = Number(req.query.amount || 1);
  const from = String(req.query.from || "INR").toUpperCase();
  const to = String(req.query.to || "USD").toUpperCase();

  try {
    // Use a free, no-key-required exchange rate API
    const resp = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from}`,
    );
    if (!resp.ok) throw new Error(`Exchange rate API returned ${resp.status}`);
    const json = await resp.json();
    const rate = Number(json.rates?.[to]);
    if (!rate || !Number.isFinite(rate)) throw new Error(`No rate for ${to}`);
    const result = amount * rate;
    return res.json({ amount, from, to, rate, result });
  } catch (e) {
    console.error("Currency conversion error:", e);
    const fallbackRate = 0.9;
    return res.json({
      amount,
      from,
      to,
      rate: fallbackRate,
      result: amount * fallbackRate,
    });
  }
};
