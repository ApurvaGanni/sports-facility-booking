import express from "express";
import {
  createBooking,
  getBookings,
  previewPrice
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/", getBookings);
router.post("/", createBooking);
router.post("/preview-price", previewPrice);

export default router;
