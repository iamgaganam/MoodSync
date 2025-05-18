// src/models/activity.model.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  time: string;
  category: "therapy" | "mindfulness" | "checkup" | "other";
  isCompleted: boolean;
}

const ActivitySchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["therapy", "mindfulness", "checkup", "other"],
      default: "other",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IActivity>("Activity", ActivitySchema);
