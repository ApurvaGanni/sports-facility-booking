import mongoose from "mongoose";

const CoachSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sport: { type: String, default: "badminton" },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Coach", CoachSchema);
