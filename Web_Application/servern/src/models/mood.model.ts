import mongoose, { Schema, Document } from "mongoose";

export interface IMood extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  mood: string; // 'happy', 'neutral', 'sad'
  score: number; // 0-100
  note: string;
  createdAt: Date;
}

const MoodSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  mood: {
    type: String,
    enum: ["happy", "neutral", "sad"],
    required: true,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for quick lookups by user and date
MoodSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IMood>("Mood", MoodSchema);
