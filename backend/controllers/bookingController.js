import Booking from "../models/Booking.js";
import Court from "../models/Court.js";
import Coach from "../models/Coach.js";
import Equipment from "../models/Equipment.js";
import PricingRule from "../models/PricingRule.js";
import { calculatePrice } from "../utils/priceCalculator.js";

/**
 * Check if there is overlapping booking for given resource.
 */
async function isCourtAvailable(courtId, startTime, endTime) {
  const conflict = await Booking.findOne({
    court: courtId,
    status: "confirmed",
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      {
        startTime: { $lte: startTime },
        endTime: { $gte: endTime }
      }
    ]
  });
  return !conflict;
}

async function isCoachAvailable(coachId, startTime, endTime) {
  if (!coachId) return true;
  const conflict = await Booking.findOne({
    "resources.coach": coachId,
    status: "confirmed",
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      {
        startTime: { $lte: startTime },
        endTime: { $gte: endTime }
      }
    ]
  });
  return !conflict;
}

async function isEquipmentAvailable(startTime, endTime, requestedRackets, requestedShoes) {
  const equipmentList = await Equipment.find();
  const racketItem = equipmentList.find((e) => e.name.toLowerCase() === "racket");
  const shoesItem = equipmentList.find((e) => e.name.toLowerCase() === "shoes");

  const overlapping = await Booking.find({
    status: "confirmed",
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      {
        startTime: { $lte: startTime },
        endTime: { $gte: endTime }
      }
    ]
  });

  let usedRackets = 0;
  let usedShoes = 0;
  overlapping.forEach((b) => {
    usedRackets += b.resources?.rackets || 0;
    usedShoes += b.resources?.shoes || 0;
  });

  const racketAvailable = !racketItem || usedRackets + requestedRackets <= racketItem.totalStock;
  const shoesAvailable = !shoesItem || usedShoes + requestedShoes <= shoesItem.totalStock;

  return racketAvailable && shoesAvailable;
}

export async function previewPrice(req, res, next) {
  try {
    const { courtId, startTime, rackets = 0, shoes = 0 } = req.body;
    const court = await Court.findById(courtId);
    if (!court) return res.status(404).json({ message: "Court not found" });

    const rules = await PricingRule.find({ isActive: true });
    const breakdown = calculatePrice(
      court.basePrice,
      rules,
      new Date(startTime),
      { courtType: court.type, rackets, shoes }
    );
    res.json(breakdown);
  } catch (err) {
    next(err);
  }
}

export async function createBooking(req, res, next) {
  try {
    const {
      userName,
      courtId,
      startTime,
      endTime,
      rackets = 0,
      shoes = 0,
      coachId
    } = req.body;

    const s = new Date(startTime);
    const e = new Date(endTime);

    if (s >= e) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    const court = await Court.findById(courtId);
    if (!court) return res.status(404).json({ message: "Court not found" });

    if (coachId) {
      const coach = await Coach.findById(coachId);
      if (!coach || !coach.isAvailable) {
        return res.status(400).json({ message: "Coach not available" });
      }
    }

    const [courtFree, coachFree, equipmentFree] = await Promise.all([
      isCourtAvailable(courtId, s, e),
      isCoachAvailable(coachId, s, e),
      isEquipmentAvailable(s, e, rackets, shoes)
    ]);

    if (!courtFree) {
      return res.status(409).json({ message: "Court is not available for this slot" });
    }
    if (!coachFree) {
      return res.status(409).json({ message: "Coach is already booked for this slot" });
    }
    if (!equipmentFree) {
      return res.status(409).json({ message: "Requested equipment not available" });
    }

    const rules = await PricingRule.find({ isActive: true });
    const pricingBreakdown = calculatePrice(
      court.basePrice,
      rules,
      s,
      { courtType: court.type, rackets, shoes }
    );

    const booking = await Booking.create({
      userName,
      court: courtId,
      startTime: s,
      endTime: e,
      resources: {
        rackets,
        shoes,
        coach: coachId || null
      },
      pricingBreakdown
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

export async function getBookings(req, res, next) {
  try {
    const { date } = req.query;
    const filter = {};
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.startTime = { $gte: start, $lte: end };
    }
    const bookings = await Booking.find(filter)
      .populate("court")
      .populate("resources.coach");
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}
