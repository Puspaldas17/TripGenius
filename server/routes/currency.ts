import { RequestHandler } from "express";

export const convertCurrency: RequestHandler = async (req, res) => {
  const amount = Number(req.query.amount || 1);
  const from = String(req.query.from || "INR").toUpperCase();
  const to = String(req.query.to || "USD").toUpperCase();

  try {
    const resp = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
    const json = await resp.json();
    const rate = Number(json.info?.rate ?? json.result / amount);
    const result = Number(json.result ?? amount * rate);
    return res.json({ amount, from, to, rate, result });
  } catch (e) {
    const fallbackRate = 0.9;
    return res.json({ amount, from, to, rate: fallbackRate, result: amount * fallbackRate });
  }
}
