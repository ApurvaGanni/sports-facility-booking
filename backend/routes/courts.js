import express from "express";
import { getCourts, addCourt } from "../controllers/courtController.js";

const router = express.Router();

router.get("/", getCourts);
router.post("/admin", addCourt);

export default router;
