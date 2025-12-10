import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const BookingSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    court: { type: ObjectId, ref: "Court", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    resources: {
      rackets: { type: Number, default: 0 },
      shoes: { type: Number, default: 0 },
      coach: { type: ObjectId, ref: "Coach", required: false }
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed"
    },
    pricingBreakdown: {
      basePrice: { type: Number, default: 0 },
      weekendFee: { type: Number, default: 0 },
      peakHourFee: { type: Number, default: 0 },
      courtTypeFee: { type: Number, default: 0 },
      equipmentFee: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
