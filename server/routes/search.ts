import { RequestHandler } from "express";

export const searchFlights: RequestHandler = (req, res) => {
  const q = String(req.query.q || "");
  const out = [
    {
      id: "F1",
      from: "NYC",
      to: q || "LAX",
      price: 399,
      airline: "SkyJet",
      departure: "09:20",
    },
    {
      id: "F2",
      from: "NYC",
      to: q || "SFO",
      price: 459,
      airline: "AeroFly",
      departure: "14:45",
    },
  ];
  res.json({ results: out });
};

export const searchHotels: RequestHandler = (req, res) => {
  const q = String(req.query.q || "");
  const out = [
    {
      id: "H1",
      name: `${q || "Grand"} Plaza`,
      pricePerNight: 129,
      rating: 4.4,
      url: "https://booking.com",
      reviews: [
        "Clean rooms and friendly staff.",
        "Great location near attractions.",
      ],
    },
    {
      id: "H2",
      name: `${q || "Sun"} Resort`,
      pricePerNight: 179,
      rating: 4.6,
      url: "https://agoda.com",
      reviews: [
        "Amazing breakfast and ocean view!",
        "Spacious rooms and fast Wi‑Fi.",
      ],
    },
  ];
  res.json({ results: out });
};
