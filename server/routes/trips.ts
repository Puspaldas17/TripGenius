import { RequestHandler } from "express";
import { z } from "zod";
import crypto from "crypto";
import { Trip } from "../models/Trip";
import { logger } from "../utils/logger";

const tripSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  origin: z.string().min(1, "Origin is required"),
  startDate: z.string(),
  endDate: z.string(),
  days: z.number().int().min(1).max(365),
  budget: z.number().min(0),
  members: z.number().int().min(1),
  mood: z.string().optional(),
  itinerary: z.any().optional(),
});

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Create a new trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - destination
 *               - origin
 *               - startDate
 *               - endDate
 *               - days
 *               - budget
 *               - members
 *             properties:
 *               destination:
 *                 type: string
 *               origin:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               days:
 *                 type: integer
 *               budget:
 *                 type: number
 *               members:
 *                 type: integer
 *               mood:
 *                 type: string
 *               itinerary:
 *                 type: object
 *     responses:
 *       201:
 *         description: Trip created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
export const handleCreateTrip: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = tripSchema.parse(req.body);
    const tripId = `trip_${crypto.randomUUID()}`;

    const trip = await Trip.create({
      tripId,
      userId,
      destination: data.destination,
      origin: data.origin,
      startDate: data.startDate,
      endDate: data.endDate,
      days: data.days,
      budget: data.budget,
      members: data.members,
      mood: data.mood || "Adventure",
      itinerary: data.itinerary,
      isFavorite: false,
    });

    // Return a flat object matching the client's expected shape
    res.status(201).json({
      id: trip.tripId,
      userId: trip.userId,
      destination: trip.destination,
      origin: trip.origin,
      startDate: trip.startDate,
      endDate: trip.endDate,
      days: trip.days,
      budget: trip.budget,
      members: trip.members,
      mood: trip.mood,
      itinerary: trip.itinerary,
      isFavorite: trip.isFavorite,
      createdAt: trip.createdAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    logger.error("trips", "Failed to create trip", error);
    res.status(500).json({ message: "Failed to create trip" });
  }
};

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Get all trips for the authenticated user
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user trips
 *       401:
 *         description: Unauthorized
 */
export const handleGetUserTrips: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const docs = await Trip.find({ userId }).sort({ createdAt: -1 }).lean();

    // Map to the flat shape the frontend expects (id, not tripId)
    const userTrips = docs.map((t) => ({
      id: t.tripId,
      userId: t.userId,
      destination: t.destination,
      origin: t.origin,
      startDate: t.startDate,
      endDate: t.endDate,
      days: t.days,
      budget: t.budget,
      members: t.members,
      mood: t.mood,
      itinerary: t.itinerary,
      isFavorite: t.isFavorite,
      createdAt:
        t.createdAt instanceof Date
          ? t.createdAt.toISOString()
          : String(t.createdAt),
    }));

    res.json(userTrips);
  } catch (error) {
    logger.error("trips", "Failed to fetch trips", error);
    res.status(500).json({ message: "Failed to fetch trips" });
  }
};

/**
 * @swagger
 * /api/trips/{tripId}:
 *   get:
 *     summary: Get a specific trip by its ID
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: The trip ID
 *     responses:
 *       200:
 *         description: Trip details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not owner)
 *       404:
 *         description: Trip not found
 */
export const handleGetTrip: RequestHandler = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = (req as any).userId;

    const trip = await Trip.findOne({ tripId }).lean();
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json({
      id: trip.tripId,
      userId: trip.userId,
      destination: trip.destination,
      origin: trip.origin,
      startDate: trip.startDate,
      endDate: trip.endDate,
      days: trip.days,
      budget: trip.budget,
      members: trip.members,
      mood: trip.mood,
      itinerary: trip.itinerary,
      isFavorite: trip.isFavorite,
      createdAt:
        trip.createdAt instanceof Date
          ? trip.createdAt.toISOString()
          : String(trip.createdAt),
    });
  } catch (error) {
    logger.error("trips", "Failed to fetch trip", error);
    res.status(500).json({ message: "Failed to fetch trip" });
  }
};

/**
 * @swagger
 * /api/trips/{tripId}:
 *   put:
 *     summary: Update an existing trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: The trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not owner)
 *       404:
 *         description: Trip not found
 */
export const handleUpdateTrip: RequestHandler = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = (req as any).userId;

    const existing = await Trip.findOne({ tripId });
    if (!existing) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const data = tripSchema.partial().parse(req.body);
    Object.assign(existing, data);
    await existing.save();

    res.json({
      id: existing.tripId,
      userId: existing.userId,
      destination: existing.destination,
      origin: existing.origin,
      startDate: existing.startDate,
      endDate: existing.endDate,
      days: existing.days,
      budget: existing.budget,
      members: existing.members,
      mood: existing.mood,
      itinerary: existing.itinerary,
      isFavorite: existing.isFavorite,
      createdAt:
        existing.createdAt instanceof Date
          ? existing.createdAt.toISOString()
          : String(existing.createdAt),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    logger.error("trips", "Failed to update trip", error);
    res.status(500).json({ message: "Failed to update trip" });
  }
};

/**
 * @swagger
 * /api/trips/{tripId}/favorite:
 *   patch:
 *     summary: Toggle favorite status of a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: The trip ID
 *     responses:
 *       200:
 *         description: Fetched updated favorite status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not owner)
 *       404:
 *         description: Trip not found
 */
export const handleToggleFavorite: RequestHandler = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = (req as any).userId;

    const trip = await Trip.findOne({ tripId });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    trip.isFavorite = !trip.isFavorite;
    await trip.save();

    res.json({
      id: trip.tripId,
      userId: trip.userId,
      destination: trip.destination,
      origin: trip.origin,
      startDate: trip.startDate,
      endDate: trip.endDate,
      days: trip.days,
      budget: trip.budget,
      members: trip.members,
      mood: trip.mood,
      itinerary: trip.itinerary,
      isFavorite: trip.isFavorite,
      createdAt:
        trip.createdAt instanceof Date
          ? trip.createdAt.toISOString()
          : String(trip.createdAt),
    });
  } catch (error) {
    logger.error("trips", "Failed to toggle favorite", error);
    res.status(500).json({ message: "Failed to toggle favorite" });
  }
};

/**
 * @swagger
 * /api/trips/{tripId}:
 *   delete:
 *     summary: Delete a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: The trip ID
 *     responses:
 *       204:
 *         description: Trip deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not owner)
 *       404:
 *         description: Trip not found
 */
export const handleDeleteTrip: RequestHandler = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = (req as any).userId;

    const trip = await Trip.findOne({ tripId }).lean();
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Trip.deleteOne({ tripId });
    res.status(204).send();
  } catch (error) {
    logger.error("trips", "Failed to delete trip", error);
    res.status(500).json({ message: "Failed to delete trip" });
  }
};
