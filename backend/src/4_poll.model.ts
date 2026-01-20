import mongoose, { Schema, Document } from "mongoose";

export interface PollDocument extends Document {
  question: string;
  options: string[];
  correctOption?: string;   // ✅ NEW (optional for old polls)
  isActive: boolean;
  startTime: Date;
  endTime: Date;
}

const PollSchema = new Schema<PollDocument>({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctOption: {
    type: String,
    required: false   // ✅ VERY IMPORTANT (old polls safety)
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
});


export const Poll = mongoose.model<PollDocument>("Poll", PollSchema);
