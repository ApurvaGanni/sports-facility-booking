import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import "./config/db.js";

import courtRoutes from "./routes/courts.js";
import coachRoutes from "./routes/coaches.js";
import equipmentRoutes from "./routes/equipment.js";
import pricingRuleRoutes from "./routes/pricingRules.js";
import bookingRoutes from "./routes/bookings.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Sports Facility Booking API running" });
});

app.use("/api/courts", courtRoutes);
app.use("/api/coaches", coachRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/pricing-rules", pricingRuleRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
