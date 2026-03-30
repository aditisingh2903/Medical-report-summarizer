import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  age: Number,

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },

  allergies: [String],

  medicalHistory: [String],
});

export const Profile = mongoose.model("Profile", profileSchema);