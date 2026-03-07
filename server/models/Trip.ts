import mongoose, { Schema, Document } from "mongoose";

export interface ITrip extends Document {
  tripId: string;
  userId: string;
  destination: string;
  origin: string;
  startDate: string;
  endDate: string;
  days: number;
  budget: number;
  members: number;
  mood: string;
  itinerary?: unknown;
  isFavorite: boolean;
  createdAt: Date;
}

const TripSchema: Schema = new Schema(
  {
    tripId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    destination: { type: String, required: true },
    origin: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    days: { type: Number, required: true, min: 1, max: 365 },
    budget: { type: Number, required: true, min: 0 },
    members: { type: Number, required: true, min: 1 },
    mood: { type: String, default: "Adventure" },
    itinerary: { type: Schema.Types.Mixed },
    isFavorite: { type: Boolean, default: false },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  },
);

// Compound index for fast user-specific queries
TripSchema.index({ userId: 1, createdAt: -1 });
export const Trip =
  (mongoose.models.Trip as mongoose.Model<ITrip>) ||
  mongoose.model<ITrip>("Trip", TripSchema);
