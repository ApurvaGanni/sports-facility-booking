import express from "express";
import { getEquipment, addEquipment } from "../controllers/equipmentController.js";

const router = express.Router();

router.get("/", getEquipment);
router.post("/admin", addEquipment);

export default router;
