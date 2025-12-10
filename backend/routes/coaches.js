import express from "express";
import { getCoaches, addCoach, toggleCoachAvailability } from "../controllers/coachController.js";

const router = express.Router();

router.get("/", getCoaches);
router.post("/admin", addCoach);
router.patch("/admin/:id/toggle", toggleCoachAvailability);

export default router;
