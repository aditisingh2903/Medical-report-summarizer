import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    fileName: String,

    filePath: {
      type: String,
      required: true,
    },

    extractedText: String,

    summary: String,

    conditionsDetected: [String],

    status: {
      type: String,
      enum: ["uploaded", "processing", "completed"],
      default: "uploaded",
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model("Report", reportSchema);