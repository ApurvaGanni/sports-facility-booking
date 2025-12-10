import mongoose from "mongoose";

const EquipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "racket", "shoes"
    totalStock: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Equipment", EquipmentSchema);
