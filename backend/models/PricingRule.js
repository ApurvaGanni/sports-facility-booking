import mongoose from "mongoose";

const PricingRuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["weekend", "peak", "courtType", "fixed"],
      required: true
    },
    isActive: { type: Boolean, default: true },

    // Weekend rule
    weekendSurcharge: { type: Number, default: 0 },

    // Peak hours
    startHour: { type: Number, min: 0, max: 23 },
    endHour: { type: Number, min: 0, max: 23 },
    multiplier: { type: Number, default: 1 },

    // Court type premium
    courtType: { type: String, enum: ["indoor", "outdoor"], required: false },
    courtTypeSurcharge: { type: Number, default: 0 },

    // Fixed fee (e.g. holiday)
    fixedSurcharge: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("PricingRule", PricingRuleSchema);
