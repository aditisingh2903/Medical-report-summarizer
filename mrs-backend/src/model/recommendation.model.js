import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: true,
    },

    condition: String,

    dietPlan: String,

    tips: [String],
  },
  {
    timestamps: true,
  }
);

export const Recommendation = mongoose.model(
  "Recommendation",
  recommendationSchema
);