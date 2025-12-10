import Equipment from "../models/Equipment.js";

export async function getEquipment(req, res, next) {
  try {
    const items = await Equipment.find();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function addEquipment(req, res, next) {
  try {
    const item = await Equipment.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}
