import Court from "../models/Court.js";

export async function getCourts(req, res, next) {
  try {
    const courts = await Court.find();
    res.json(courts);
  } catch (err) {
    next(err);
  }
}

export async function addCourt(req, res, next) {
  try {
    const { name, type, basePrice } = req.body;
    const court = await Court.create({ name, type, basePrice });
    res.status(201).json(court);
  } catch (err) {
    next(err);
  }
}
