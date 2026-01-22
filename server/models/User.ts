import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    id: string; // we will keep using the string id for now to maintain compatibility with existing logic if we want, or we can rely on _id. 
    // Let's actually define it explicitly as the custom ID string used in the app logic, or rely on _id.
    // The app currently generates IDs like `user_${Date.now()}`.
    // Storing that in a separate field 'userId' or just 'id' is fine.
    // Let's use 'id' as a string field to match the interface exactly.
    email: string;
    name: string;
    passwordHash: string;
    createdAt: string;
    emailVerified: boolean;
    verificationToken?: string;
}

const UserSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: String, required: true }, // Keeping as string to match current usage, normally Date is better
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
});

export const User = mongoose.model<IUser>("User", UserSchema);
