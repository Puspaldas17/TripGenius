import { RequestHandler } from "express";
import { z } from "zod";

interface Trip {
  id: string;
  userId: string;
  destination: string;
  origin: string;
  startDate: string;
  endDate: string;
  days: number;
  budget: number;
  members: number;
  mood: string;
  itinerary?: any;
  isFavorite: boolean;
  createdAt: string;
}

// In-memory trip store (in production, use a real database)
const trips: Map<string, Trip> = new Map();

const tripSchema = z.object({
  destination: z.string(),
  origin: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  days: z.number(),
  budget: z.number(),
  members: z.number(),
  mood: z.string().optional(),
  itinerary: z.any().optional(),
});

export const handleCreateTrip: RequestHandler = (req, res) => {
  try {
    const userId = (req as any).userId; // Set by auth middleware
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = tripSchema.parse(req.body);
    const tripId = `trip_${Date.now()}`;

    const trip: Trip = {
      id: tripId,
      userId,
      ...data,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    trips.set(tripId, trip);

    res.status(201).json(trip);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "Failed to create trip" });
  }
};

export const handleGetUserTrips: RequestHandler = (req, res) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userTrips = Array.from(trips.values()).filter(
      (t) => t.userId === userId
    );

    res.json(userTrips);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trips" });
  }
};

export const handleGetTrip: RequestHandler = (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = (req as any).userId;

    const trip = trips.get(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trip" });
  }
};

export const handleUpdateTrip: RequestHandler = (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = (req as any).userId;

    const trip = trips.get(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const data = tripSchema.partial().parse(req.body);

    const updatedTrip = { ...trip, ...data };
    trips.set(tripId, updatedTrip);

    res.json(updatedTrip);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "Failed to update trip" });
  }
};

export const handleToggleFavorite: RequestHandler = (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = (req as any).userId;

    const trip = trips.get(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    trip.isFavorite = !trip.isFavorite;
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle favorite" });
  }
};

export const handleDeleteTrip: RequestHandler = (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = (req as any).userId;

    const trip = trips.get(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    trips.delete(tripId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete trip" });
  }
};
