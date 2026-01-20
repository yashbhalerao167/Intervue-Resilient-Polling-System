import mongoose, { Schema, Document } from "mongoose";

export interface VoteDocument extends Document {
  pollId: mongoose.Types.ObjectId;
  studentId: string;
  selectedOption: string;
  createdAt: Date;
}

const VoteSchema = new Schema<VoteDocument>({
  pollId: {
    type: Schema.Types.ObjectId,
    ref: "Poll",
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  selectedOption: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * VERY IMPORTANT:
 * This index guarantees:
 * - One student can vote only once per poll
 * - Even if they spam API or hack frontend
 */
VoteSchema.index({ pollId: 1, studentId: 1 }, { unique: true });

export const Vote = mongoose.model<VoteDocument>("Vote", VoteSchema);
