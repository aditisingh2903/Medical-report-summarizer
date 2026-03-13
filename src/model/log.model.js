import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  action: String,

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Log = mongoose.model("Log", logSchema);