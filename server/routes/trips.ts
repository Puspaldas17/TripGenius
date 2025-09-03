import { RequestHandler } from "express";
import { requireAuth } from "../middleware/auth";
import type { ItineraryResponse } from "@shared/api";

const trips = new Map<string, any[]>();

export const listTrips: RequestHandler = (req, res) =>
  requireAuth(req, res, () => {
    const uid = (req as any).user.sub as string;
    res.json({ trips: trips.get(uid) || [] });
  });

export const saveTrip: RequestHandler = (req, res) =>
  requireAuth(req, res, () => {
    const uid = (req as any).user.sub as string;
    const body = req.body as { name: string; itinerary: ItineraryResponse };
    const list = trips.get(uid) || [];
    const trip = {
      id: cryptoRandom(),
      name: body.name,
      itinerary: body.itinerary,
      createdAt: Date.now(),
    };
    list.push(trip);
    trips.set(uid, list);
    res.json(trip);
  });

function cryptoRandom() {
  return Math.random().toString(36).slice(2, 10);
}
