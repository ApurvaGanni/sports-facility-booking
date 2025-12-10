import mongoose from "mongoose";

const CourtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["indoor", "outdoor"], default: "indoor" },
    basePrice: { type: Number, required: true, default: 10 }
  },
  { timestamps: true }
);

export default mongoose.model("Court", CourtSchema);
