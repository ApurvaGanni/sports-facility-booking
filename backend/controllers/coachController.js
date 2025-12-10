import Coach from "../models/Coach.js";

export async function getCoaches(req, res, next) {
  try {
    const coaches = await Coach.find();
    res.json(coaches);
  } catch (err) {
    next(err);
  }
}

export async function addCoach(req, res, next) {
  try {
    const coach = await Coach.create(req.body);
    res.status(201).json(coach);
  } catch (err) {
    next(err);
  }
}

export async function toggleCoachAvailability(req, res, next) {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }
    coach.isAvailable = !coach.isAvailable;
    await coach.save();
    res.json(coach);
  } catch (err) {
    next(err);
  }
}
