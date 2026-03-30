import mongoose from "mongoose";

const quickSummarySchema = new mongoose.Schema(
  {
    extractedText: String,

    summary: String,

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 43200, // auto delete after 12 hours
    },
  }
);

export const QuickSummary = mongoose.model(
  "QuickSummary",
  quickSummarySchema
);